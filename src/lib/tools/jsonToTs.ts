function toPascalCase(str: string): string {
  return str.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase());
}

interface InterfaceMap { [name: string]: string; }

function inferType(value: unknown, key: string, interfaces: InterfaceMap, useExport: boolean, useType: boolean): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const types = [...new Set(value.map(v => inferType(v, key, interfaces, useExport, useType)))];
    if (types.length === 1) return types[0] + "[]";
    return "(" + types.join(" | ") + ")[]";
  }
  if (typeof value === "object") {
    const name = toPascalCase(key);
    generateInterface(value as Record<string, unknown>, name, interfaces, useExport, useType);
    return name;
  }
  return typeof value;
}

function generateInterface(obj: Record<string, unknown>, name: string, interfaces: InterfaceMap, useExport: boolean, useType: boolean): void {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const type = inferType(value, key, interfaces, useExport, useType);
    lines.push(`  ${key}: ${type};`);
  }
  const prefix = useExport ? "export " : "";
  if (useType) {
    interfaces[name] = `${prefix}type ${name} = {\n${lines.join("\n")}\n};`;
  } else {
    interfaces[name] = `${prefix}interface ${name} {\n${lines.join("\n")}\n}`;
  }
}

export function jsonToTypescript(json: string, options: { useExport?: boolean; useType?: boolean } = {}): string {
  const { useExport = true, useType = false } = options;
  const parsed = JSON.parse(json) as unknown;
  const interfaces: InterfaceMap = {};
  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === "object") {
      generateInterface(parsed[0] as Record<string, unknown>, "Root", interfaces, useExport, useType);
    }
    return Object.values(interfaces).reverse().join("\n\n") + `\n\n${useExport ? "export " : ""}type RootArray = Root[];`;
  }
  generateInterface(parsed as Record<string, unknown>, "Root", interfaces, useExport, useType);
  return Object.values(interfaces).reverse().join("\n\n");
}
