// Web Worker for heavy transformation tasks
// This runs in a separate thread to keep UI at 60fps

type JsonToTsOptions = {
  useExport?: boolean;
  useType?: boolean;
  useReadonly?: boolean;
  strictNulls?: boolean;
  outputFormat?: "typescript" | "zod" | "yup";
};

type WorkerTask =
  | { type: "formatSQL"; payload: { sql: string; options: { indent: number; uppercase: boolean } } }
  | { type: "jsonToTs"; payload: { json: string; options: JsonToTsOptions } }
  | { type: "parseCron"; payload: { expression: string } }
  | { type: "convertCurl"; payload: { cmd: string; language: string } };

self.onmessage = async (e: MessageEvent<{ id: string; task: WorkerTask }>) => {
  const { id, task } = e.data;
  try {
    let result: unknown;
    switch (task.type) {
      case "formatSQL": {
        result = workerFormatSQL(task.payload.sql, task.payload.options);
        break;
      }
      case "jsonToTs": {
        result = workerJsonToTs(task.payload.json, task.payload.options);
        break;
      }
      default:
        result = null;
    }
    self.postMessage({ id, result, error: null });
  } catch (err) {
    self.postMessage({ id, result: null, error: (err as Error).message });
  }
};

// ---- Inlined heavy functions for worker context ----

function workerFormatSQL(sql: string, options: { indent: number; uppercase: boolean }): string {
  const KEYWORDS = [
    "SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN",
    "CROSS JOIN","ON","AND","OR","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES",
    "UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","INDEX","UNION","UNION ALL",
    "CASE","WHEN","THEN","ELSE","END","AS","IN","NOT","NULL","IS","BETWEEN","LIKE","EXISTS","DISTINCT",
  ];
  const { indent = 2, uppercase = true } = options;
  const pad = " ".repeat(indent);
  let result = sql.replace(/\s+/g, " ").trim();
  if (uppercase) {
    for (const kw of KEYWORDS) {
      result = result.replace(new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi"), kw);
    }
  }
  const breakBefore = ["SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN",
    "CROSS JOIN","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","UPDATE","SET",
    "DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","UNION","UNION ALL","VALUES"];
  for (const kw of breakBefore) {
    result = result.replace(new RegExp(`\\s+${kw}\\b`, "gi"), `\n${kw}`);
  }
  result = result.replace(/\b(AND|OR)\b/gi, `\n${pad}$1`);
  result = result.replace(/\bON\b/gi, `\n${pad}ON`);
  const selectMatch = result.match(/^SELECT\s+(.+?)(?=\nFROM)/is);
  if (selectMatch) {
    const cols = selectMatch[1].split(",").map((c: string, i: number) => i === 0 ? c.trim() : `${pad}${c.trim()}`);
    result = result.replace(selectMatch[1], "\n" + pad + cols.join(",\n" + pad));
  }
  return result.trim();
}

// ---- Inlined jsonToTs for worker context ----

type InterfaceMap = { [name: string]: string };

function toPascalCase(str: string): string {
  return str
    .replace(/(^|[_-])([a-z])/g, (_, __, c: string) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

function inferType(value: unknown, key: string, interfaces: InterfaceMap, opts: JsonToTsOptions): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const types = [...new Set(value.map((v) => inferType(v, key, interfaces, opts)))];
    if (types.length === 1) return types[0] + "[]";
    return "(" + types.join(" | ") + ")[]";
  }
  if (typeof value === "object") {
    const name = toPascalCase(key);
    generateInterface(value as Record<string, unknown>, name, interfaces, opts);
    return name;
  }
  return typeof value;
}

function generateInterface(obj: Record<string, unknown>, name: string, interfaces: InterfaceMap, opts: JsonToTsOptions): void {
  const lines: string[] = [];
  const ro = opts.useReadonly ? "readonly " : "";
  for (const [key, value] of Object.entries(obj)) {
    const type = inferType(value, key, interfaces, opts);
    const optional = opts.strictNulls && value === null ? "?" : "";
    lines.push(`  ${ro}${key}${optional}: ${type};`);
  }
  const prefix = opts.useExport ? "export " : "";
  if (opts.useType) {
    interfaces[name] = `${prefix}type ${name} = {\n${lines.join("\n")}\n};`;
  } else {
    interfaces[name] = `${prefix}interface ${name} {\n${lines.join("\n")}\n}`;
  }
}

function inferZodType(value: unknown, key: string, schemas: InterfaceMap, opts: JsonToTsOptions): string {
  if (value === null) return "z.null()";
  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";
    return `z.array(${inferZodType(value[0], key, schemas, opts)})`;
  }
  if (typeof value === "object") {
    const name = toPascalCase(key);
    generateZodSchema(value as Record<string, unknown>, name, schemas, opts);
    return `${name}Schema`;
  }
  if (typeof value === "string") return "z.string()";
  if (typeof value === "number") return Number.isInteger(value) ? "z.number().int()" : "z.number()";
  if (typeof value === "boolean") return "z.boolean()";
  return "z.unknown()";
}

function generateZodSchema(obj: Record<string, unknown>, name: string, schemas: InterfaceMap, opts: JsonToTsOptions): void {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    lines.push(`  ${key}: ${inferZodType(value, key, schemas, opts)},`);
  }
  const prefix = opts.useExport ? "export " : "";
  schemas[name] = `${prefix}const ${name}Schema = z.object({\n${lines.join("\n")}\n});`;
}

function inferYupType(value: unknown, key: string, schemas: InterfaceMap, opts: JsonToTsOptions): string {
  if (value === null) return "yup.mixed().nullable()";
  if (Array.isArray(value)) {
    if (value.length === 0) return "yup.array()";
    return `yup.array().of(${inferYupType(value[0], key, schemas, opts)})`;
  }
  if (typeof value === "object") {
    const name = toPascalCase(key);
    generateYupSchema(value as Record<string, unknown>, name, schemas, opts);
    return `${name}Schema`;
  }
  if (typeof value === "string") return "yup.string().required()";
  if (typeof value === "number") return "yup.number().required()";
  if (typeof value === "boolean") return "yup.boolean().required()";
  return "yup.mixed()";
}

function generateYupSchema(obj: Record<string, unknown>, name: string, schemas: InterfaceMap, opts: JsonToTsOptions): void {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    lines.push(`  ${key}: ${inferYupType(value, key, schemas, opts)},`);
  }
  const prefix = opts.useExport ? "export " : "";
  schemas[name] = `${prefix}const ${name}Schema = yup.object({\n${lines.join("\n")}\n});`;
}

function workerJsonToTs(json: string, options: JsonToTsOptions): string {
  const opts: JsonToTsOptions = {
    useExport: true,
    useType: false,
    useReadonly: false,
    strictNulls: false,
    outputFormat: "typescript",
    ...options,
  };
  const parsed = JSON.parse(json) as unknown;
  const interfaces: InterfaceMap = {};

  if (opts.outputFormat === "zod") {
    const header = 'import { z } from "zod";\n\n';
    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && typeof parsed[0] === "object") {
        generateZodSchema(parsed[0] as Record<string, unknown>, "Root", interfaces, opts);
      }
      return header + Object.values(interfaces).reverse().join("\n\n") + `\n\n${opts.useExport ? "export " : ""}const RootArraySchema = z.array(RootSchema);`;
    }
    generateZodSchema(parsed as Record<string, unknown>, "Root", interfaces, opts);
    return header + Object.values(interfaces).reverse().join("\n\n");
  }

  if (opts.outputFormat === "yup") {
    const header = 'import * as yup from "yup";\n\n';
    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && typeof parsed[0] === "object") {
        generateYupSchema(parsed[0] as Record<string, unknown>, "Root", interfaces, opts);
      }
      return header + Object.values(interfaces).reverse().join("\n\n") + `\n\n${opts.useExport ? "export " : ""}const RootArraySchema = yup.array().of(RootSchema);`;
    }
    generateYupSchema(parsed as Record<string, unknown>, "Root", interfaces, opts);
    return header + Object.values(interfaces).reverse().join("\n\n");
  }

  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === "object") {
      generateInterface(parsed[0] as Record<string, unknown>, "Root", interfaces, opts);
    }
    return Object.values(interfaces).reverse().join("\n\n") + `\n\n${opts.useExport ? "export " : ""}type RootArray = Root[];`;
  }
  generateInterface(parsed as Record<string, unknown>, "Root", interfaces, opts);
  return Object.values(interfaces).reverse().join("\n\n");
}
