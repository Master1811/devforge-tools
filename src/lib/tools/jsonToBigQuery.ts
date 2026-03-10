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
}

function inferBigQueryType(value: unknown): BigQueryType {
  if (value === null || value === undefined) return 'STRING'; // Default to STRING for nulls
  if (typeof value === 'string') {
    // Check if it's a timestamp/date
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'TIMESTAMP';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'DATE';
    if (/^\d{2}:\d{2}:\d{2}/.test(value)) return 'TIME';
    return 'STRING';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'INTEGER' : 'FLOAT';
  }
  if (typeof value === 'boolean') return 'BOOLEAN';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'STRING'; // Default for empty arrays
    // For arrays, the type is inferred from the first non-null element
    const firstNonNull = value.find(v => v !== null && v !== undefined);
    return firstNonNull ? inferBigQueryType(firstNonNull) : 'STRING';
  }
  if (typeof value === 'object') return 'RECORD';
  return 'STRING'; // Fallback
}

function isNullable(values: unknown[]): boolean {
  return values.some(v => v === null || v === undefined);
}

function generateBigQuerySchema(
  obj: Record<string, unknown>,
  name: string,
  opts: JsonToBigQueryOptions
): BigQueryField[] {
  const fields: BigQueryField[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const field: BigQueryField = {
      name: key,
      type: inferBigQueryType(value),
      mode: 'NULLABLE',
    };

    if (Array.isArray(value)) {
      if (value.length > 0) {
        const firstNonNull = value.find(v => v !== null && v !== undefined);
        if (firstNonNull && typeof firstNonNull === 'object' && !Array.isArray(firstNonNull)) {
          // Array of records
          field.type = 'RECORD';
          field.mode = 'REPEATED';
          field.fields = generateBigQuerySchema(firstNonNull as Record<string, unknown>, `${name}_${key}`, opts);
        } else {
          // Array of primitives
          field.mode = 'REPEATED';
          field.type = inferBigQueryType(firstNonNull);
        }
      } else {
        field.mode = 'REPEATED';
        field.type = 'STRING'; // Default for empty arrays
      }
      if (!isNullable(value) && opts.strictNulls) {
        field.mode = 'REQUIRED';
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested object
      field.type = 'RECORD';
      field.fields = generateBigQuerySchema(value as Record<string, unknown>, `${name}_${key}`, opts);
      if (opts.strictNulls) {
        field.mode = 'REQUIRED';
      }
    } else {
      // Primitive
      if (value !== null && value !== undefined && opts.strictNulls) {
        field.mode = 'REQUIRED';
      }
    }

    if (opts.includeDescriptions) {
      field.description = `Field ${key} of type ${field.type}`;
    }

    fields.push(field);
  }

  return fields;
}

export function jsonToBigQuerySchema(jsonString: string, opts: JsonToBigQueryOptions = {}): string {
  try {
    const obj = JSON.parse(jsonString);
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      throw new Error('Input must be a JSON object');
    }
    const schema = generateBigQuerySchema(obj as Record<string, unknown>, 'Root', opts);
    return JSON.stringify(schema, null, 2);
  } catch (e) {
    throw new Error('Invalid JSON: ' + (e as Error).message);
  }
}