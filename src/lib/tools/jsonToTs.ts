function toPascalCase(str: string): string {
  return str.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase());
}

interface InterfaceMap { [name: string]: string; }

export interface JsonToTsOptions {
  useExport?: boolean;
  useType?: boolean;
  useReadonly?: boolean;
  strictNulls?: boolean;
  outputFormat?: "typescript" | "zod" | "yup";
}

function inferType(value: unknown, key: string, interfaces: InterfaceMap, opts: JsonToTsOptions): string {
  if (value === null) return opts.strictNulls ? "null" : "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const types = [...new Set(value.map(v => inferType(v, key, interfaces, opts)))];
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

function generateZodSchema(obj: Record<string, unknown>, name: string, schemas: InterfaceMap, opts: JsonToTsOptions): void {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    lines.push(`  ${key}: ${inferZodType(value, key, schemas, opts)},`);
  }
  const prefix = opts.useExport ? "export " : "";
  schemas[name] = `${prefix}const ${name}Schema = z.object({\n${lines.join("\n")}\n});`;
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

function generateYupSchema(obj: Record<string, unknown>, name: string, schemas: InterfaceMap, opts: JsonToTsOptions): void {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    lines.push(`  ${key}: ${inferYupType(value, key, schemas, opts)},`);
  }
  const prefix = opts.useExport ? "export " : "";
  schemas[name] = `${prefix}const ${name}Schema = yup.object({\n${lines.join("\n")}\n});`;
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

export function jsonToTypescript(json: string, options: JsonToTsOptions = {}): string {
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

  // TypeScript interfaces/types
  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === "object") {
      generateInterface(parsed[0] as Record<string, unknown>, "Root", interfaces, opts);
    }
    return Object.values(interfaces).reverse().join("\n\n") + `\n\n${opts.useExport ? "export " : ""}type RootArray = Root[];`;
  }
  generateInterface(parsed as Record<string, unknown>, "Root", interfaces, opts);
  return Object.values(interfaces).reverse().join("\n\n");
}
