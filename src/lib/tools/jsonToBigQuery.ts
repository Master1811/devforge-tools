export interface BigQueryField {
  name: string;
  type: BigQueryType;
  mode: 'NULLABLE' | 'REQUIRED' | 'REPEATED';
  description?: string;
  fields?: BigQueryField[];
}

export type BigQueryType =
  | 'STRING'
  | 'INTEGER'
  | 'FLOAT'
  | 'BOOLEAN'
  | 'TIMESTAMP'
  | 'DATE'
  | 'TIME'
  | 'BYTES'
  | 'RECORD';

export interface JsonToBigQueryOptions {
  strictNulls?: boolean;
  includeDescriptions?: boolean;
  conflictResolution?: 'cast_to_string' | 'keep_record_ignore_invalid';
}

export interface BigQueryConflict {
  fieldPath: string;
  existingKind: string;
  incomingKind: string;
  message: string;
}

export interface JsonToBigQueryAnalysis {
  schema: BigQueryField[];
  warnings: string[];
  recordCount: number;
  conflicts: BigQueryConflict[];
}

export class BigQueryConflictError extends Error {
  conflicts: BigQueryConflict[];

  constructor(conflicts: BigQueryConflict[]) {
    super('Hard type conflicts detected. Resolution required.');
    this.name = 'BigQueryConflictError';
    this.conflicts = conflicts;
  }
}

type PrimitiveType = Exclude<BigQueryType, 'RECORD'>;
type InferredNode =
  | { kind: 'primitive'; type: PrimitiveType }
  | { kind: 'record'; fields: Map<string, FieldAccumulator> }
  | { kind: 'array'; element: InferredNode | null };

interface FieldAccumulator {
  seen: number;
  nulls: number;
  node: InferredNode | null;
}

function inferPrimitiveType(value: string | number | boolean): PrimitiveType {
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'TIMESTAMP';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'DATE';
    if (/^\d{2}:\d{2}:\d{2}/.test(value)) return 'TIME';
    return 'STRING';
  }
  if (typeof value === 'number') return Number.isInteger(value) ? 'INTEGER' : 'FLOAT';
  return 'BOOLEAN';
}

function mergePrimitiveTypes(left: PrimitiveType, right: PrimitiveType, path: string, warnings: string[]): PrimitiveType {
  if (left === right) return left;
  if ((left === 'INTEGER' && right === 'FLOAT') || (left === 'FLOAT' && right === 'INTEGER')) return 'FLOAT';
  if ((left === 'TIMESTAMP' && right === 'STRING') || (left === 'STRING' && right === 'TIMESTAMP')) {
    warnings.push(`Potential Date Conflict at '${path}': TIMESTAMP mixed with STRING. Falling back to STRING.`);
    return 'STRING';
  }
  if (left === 'STRING' || right === 'STRING') return 'STRING';
  return 'STRING';
}

function nodeKindName(node: InferredNode): string {
  if (node.kind === 'primitive') return node.type;
  if (node.kind === 'record') return 'RECORD';
  return 'ARRAY';
}

function resolveHardConflict(
  left: InferredNode,
  right: InferredNode,
  path: string,
  conflictResolution: NonNullable<JsonToBigQueryOptions['conflictResolution']>,
  conflicts: BigQueryConflict[],
): InferredNode {
  conflicts.push({
    fieldPath: path || '(root)',
    existingKind: nodeKindName(left),
    incomingKind: nodeKindName(right),
    message: `Field '${path || '(root)'}' has conflicting types (${nodeKindName(left)} vs ${nodeKindName(right)}).`,
  });
  if (conflictResolution === 'keep_record_ignore_invalid') {
    if (left.kind === 'record') return left;
    if (right.kind === 'record') return right;
  }
  return { kind: 'primitive', type: 'STRING' };
}

function mergeNullableNodes(
  left: InferredNode | null,
  right: InferredNode | null,
  path: string,
  warnings: string[],
  conflictResolution: NonNullable<JsonToBigQueryOptions['conflictResolution']>,
  conflicts: BigQueryConflict[],
): InferredNode | null {
  if (!left) return right;
  if (!right) return left;
  if (left.kind === 'primitive' && right.kind === 'primitive') {
    return { kind: 'primitive', type: mergePrimitiveTypes(left.type, right.type, path, warnings) };
  }
  if (left.kind === 'record' && right.kind === 'record') {
    const merged = new Map<string, FieldAccumulator>();
    const keys = new Set([...left.fields.keys(), ...right.fields.keys()]);
    for (const key of keys) {
      const l = left.fields.get(key);
      const r = right.fields.get(key);
      if (!l && r) {
        merged.set(key, { ...r });
        continue;
      }
      if (l && !r) {
        merged.set(key, { ...l });
        continue;
      }
      const childPath = path ? `${path}.${key}` : key;
      merged.set(key, {
        seen: l!.seen + r!.seen,
        nulls: l!.nulls + r!.nulls,
        node: mergeNullableNodes(l!.node, r!.node, childPath, warnings, conflictResolution, conflicts),
      });
    }
    return { kind: 'record', fields: merged };
  }
  if (left.kind === 'array' && right.kind === 'array') {
    return {
      kind: 'array',
      element: mergeNullableNodes(left.element, right.element, `${path}[]`, warnings, conflictResolution, conflicts),
    };
  }
  return resolveHardConflict(left, right, path, conflictResolution, conflicts);
}

function inferNode(
  value: unknown,
  warnings: string[],
  conflictResolution: NonNullable<JsonToBigQueryOptions['conflictResolution']>,
  conflicts: BigQueryConflict[],
): InferredNode | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    let element: InferredNode | null = null;
    for (const item of value) {
      const inferred = inferNode(item, warnings, conflictResolution, conflicts);
      element = mergeNullableNodes(element, inferred, '[]', warnings, conflictResolution, conflicts);
    }
    return { kind: 'array', element };
  }
  if (typeof value === 'object') {
    const fields = new Map<string, FieldAccumulator>();
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      fields.set(k, {
        seen: 1,
        nulls: v == null ? 1 : 0,
        node: inferNode(v, warnings, conflictResolution, conflicts),
      });
    }
    return { kind: 'record', fields };
  }
  return { kind: 'primitive', type: inferPrimitiveType(value as string | number | boolean) };
}

function parseInputRecords(jsonString: string): Record<string, unknown>[] {
  const trimmed = jsonString.trim();
  if (!trimmed) throw new Error('Input is empty');
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      if (!parsed.length) throw new Error('Input array is empty');
      if (!parsed.every((item) => item && typeof item === 'object' && !Array.isArray(item))) {
        throw new Error('Input array must contain only JSON objects');
      }
      return parsed as Record<string, unknown>[];
    }
    if (parsed && typeof parsed === 'object') return [parsed as Record<string, unknown>];
    throw new Error('Input must be a JSON object, JSON array of objects, or JSONL');
  } catch {
    const lines = trimmed.split('\n').map((line) => line.trim()).filter(Boolean);
    if (!lines.length) throw new Error('Invalid JSON/JSONL input');
    const records: Record<string, unknown>[] = [];
    for (let i = 0; i < lines.length; i++) {
      try {
        const row = JSON.parse(lines[i]);
        if (!row || typeof row !== 'object' || Array.isArray(row)) {
          throw new Error(`Line ${i + 1} is not a JSON object`);
        }
        records.push(row as Record<string, unknown>);
      } catch (e) {
        throw new Error(`Invalid JSONL at line ${i + 1}: ${(e as Error).message}`);
      }
    }
    return records;
  }
}

function mapRecordToFields(
  map: Map<string, FieldAccumulator>,
  totalRecords: number,
  opts: JsonToBigQueryOptions,
): BigQueryField[] {
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, acc]) => {
      let mode: BigQueryField['mode'] = 'NULLABLE';
      let type: BigQueryType = 'STRING';
      let fields: BigQueryField[] | undefined;

      if (acc.node?.kind === 'array') {
        mode = 'REPEATED';
        const element = acc.node.element;
        if (!element) {
          type = 'STRING';
        } else if (element.kind === 'primitive') {
          type = element.type;
        } else if (element.kind === 'record') {
          type = 'RECORD';
          fields = mapRecordToFields(element.fields, acc.seen, opts);
        } else {
          type = 'STRING';
        }
      } else if (acc.node?.kind === 'record') {
        type = 'RECORD';
        fields = mapRecordToFields(acc.node.fields, acc.seen, opts);
        if (opts.strictNulls && acc.seen === totalRecords && acc.nulls === 0) mode = 'REQUIRED';
      } else if (acc.node?.kind === 'primitive') {
        type = acc.node.type;
        if (opts.strictNulls && acc.seen === totalRecords && acc.nulls === 0) mode = 'REQUIRED';
      }

      const field: BigQueryField = { name, type, mode };
      if (fields) field.fields = fields;
      if (opts.includeDescriptions) field.description = `Field ${name} of type ${type}`;
      return field;
    });
}

export function analyzeJsonToBigQuerySchema(
  jsonString: string,
  opts: JsonToBigQueryOptions = {},
): JsonToBigQueryAnalysis {
  const records = parseInputRecords(jsonString);
  const warnings: string[] = [];
  const conflicts: BigQueryConflict[] = [];
  const conflictResolution = opts.conflictResolution ?? 'cast_to_string';
  const root = new Map<string, FieldAccumulator>();

  for (const record of records) {
    const keys = new Set([...Object.keys(record), ...root.keys()]);
    for (const key of keys) {
      const hasKey = Object.prototype.hasOwnProperty.call(record, key);
      const value = hasKey ? record[key] : undefined;
      const acc = root.get(key) ?? { seen: 0, nulls: 0, node: null };
      if (hasKey) acc.seen += 1;
      if (!hasKey || value == null) acc.nulls += 1;
      const inferred = inferNode(value, warnings, conflictResolution, conflicts);
      acc.node = mergeNullableNodes(acc.node, inferred, key, warnings, conflictResolution, conflicts);
      root.set(key, acc);
    }
  }

  return {
    schema: mapRecordToFields(root, records.length, opts),
    warnings,
    recordCount: records.length,
    conflicts,
  };
}

export function jsonToBigQuerySchema(jsonString: string, opts: JsonToBigQueryOptions = {}): string {
  const analysis = analyzeJsonToBigQuerySchema(jsonString, opts);
  if (analysis.conflicts.length > 0 && !opts.conflictResolution) {
    throw new BigQueryConflictError(analysis.conflicts);
  }
  return JSON.stringify(analysis.schema, null, 2);
}