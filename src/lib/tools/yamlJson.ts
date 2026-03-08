// Lightweight YAML parser/serializer (handles common cases)

type YamlPrimitive = string | number | boolean | null;
type YamlValue = YamlPrimitive | YamlPrimitive[] | { [key: string]: YamlValue } | YamlValue[];

export function yamlToJson(yaml: string): string {
  const lines = yaml.split("\n");
  const result = parseYamlLines(lines, 0, 0).value;
  return JSON.stringify(result, null, 2);
}

function parseYamlLines(lines: string[], start: number, baseIndent: number): { value: YamlValue; nextLine: number } {
  const obj: Record<string, YamlValue> = {};
  let i = start;
  let isArray = false;
  const arr: YamlValue[] = [];

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "" || line.trim().startsWith("#")) { i++; continue; }

    const indent = line.search(/\S/);
    if (indent < baseIndent) break;
    if (indent > baseIndent && i > start) break;

    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith("- ")) {
      isArray = true;
      const val = trimmed.slice(2).trim();
      if (val.includes(": ")) {
        const colonIdx = val.indexOf(": ");
        const key = val.slice(0, colonIdx);
        const v = parseYamlValue(val.slice(colonIdx + 2));
        const subObj: Record<string, YamlValue> = { [key]: v };
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j];
          if (nextLine.trim() === "" || nextLine.trim().startsWith("#")) { j++; continue; }
          const nextIndent = nextLine.search(/\S/);
          if (nextIndent <= indent) break;
          const nt = nextLine.trim();
          const ci = nt.indexOf(": ");
          if (ci > 0) {
            subObj[nt.slice(0, ci)] = parseYamlValue(nt.slice(ci + 2));
          }
          j++;
        }
        arr.push(subObj);
        i = j;
      } else {
        arr.push(parseYamlValue(val));
        i++;
      }
      continue;
    }

    // Key-value
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx > 0) {
      const key = trimmed.slice(0, colonIdx).trim();
      const val = trimmed.slice(colonIdx + 1).trim();

      if (val === "" || val === "|" || val === ">") {
        const nextNonEmpty = lines.slice(i + 1).findIndex(l => l.trim() !== "");
        if (nextNonEmpty >= 0) {
          const nextIndent = lines[i + 1 + nextNonEmpty].search(/\S/);
          if (nextIndent > indent) {
            const sub = parseYamlLines(lines, i + 1, nextIndent);
            obj[key] = sub.value;
            i = sub.nextLine;
            continue;
          }
        }
        obj[key] = null;
      } else {
        obj[key] = parseYamlValue(val);
      }
    }
    i++;
  }

  return { value: isArray ? arr : obj, nextLine: i };
}

function parseYamlValue(val: string): YamlValue {
  if (val === "true" || val === "True") return true;
  if (val === "false" || val === "False") return false;
  if (val === "null" || val === "~" || val === "") return null;
  if (/^-?\d+$/.test(val)) return parseInt(val);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    return val.slice(1, -1);
  if (val.startsWith("[")) {
    try { return JSON.parse(val) as YamlValue; } catch { return val; }
  }
  return val;
}

export function jsonToYaml(json: string): string {
  const obj = JSON.parse(json) as YamlValue;
  return toYaml(obj, 0);
}

function toYaml(value: YamlValue, indent: number): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return /[:#{}[\],&*?|>!%@`]/.test(value) ? `"${value}"` : value;

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value.map(item => {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const entries = Object.entries(item);
        const first = `${pad}- ${entries[0][0]}: ${toYaml(entries[0][1], indent + 1)}`;
        const rest = entries.slice(1).map(([k, v]) => `${pad}  ${k}: ${toYaml(v, indent + 1)}`);
        return [first, ...rest].join("\n");
      }
      return `${pad}- ${toYaml(item, indent + 1)}`;
    }).join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    return entries.map(([k, v]) => {
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        return `${pad}${k}:\n${toYaml(v, indent + 1)}`;
      }
      if (Array.isArray(v)) {
        return `${pad}${k}:\n${toYaml(v, indent + 1)}`;
      }
      return `${pad}${k}: ${toYaml(v, indent + 1)}`;
    }).join("\n");
  }

  return String(value);
}

export function detectDirection(input: string): "json-to-yaml" | "yaml-to-json" {
  const trimmed = input.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json-to-yaml";
  return "yaml-to-json";
}
