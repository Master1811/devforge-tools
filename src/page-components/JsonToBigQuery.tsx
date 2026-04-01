"use client";

import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import {
  BigQueryConflictError,
  JsonToBigQueryOptions,
  analyzeJsonToBigQuerySchema,
} from "@/lib/tools/jsonToBigQuery";

export default function JsonToBigQueryPage() {
  const [input, setInput] = useLocalStorage("devforge-json-bq-input", "");
  const [strictNulls, setStrictNulls] = useState(false);
  const [includeDescriptions, setIncludeDescriptions] = useState(false);
  const [conflictResolution, setConflictResolution] = useState<JsonToBigQueryOptions["conflictResolution"]>();
  const debounced = useDebounce(input, 200);

  let output = "";
  let error = "";
  let conflictMessage = "";
  let warnings: string[] = [];
  if (debounced.trim()) {
    try {
      const opts: JsonToBigQueryOptions = { strictNulls, includeDescriptions, conflictResolution };
      const analysis = analyzeJsonToBigQuerySchema(debounced, opts);
      warnings = analysis.warnings;
      if (analysis.conflicts.length > 0 && !conflictResolution) {
        throw new BigQueryConflictError(analysis.conflicts);
      }
      output = JSON.stringify(analysis.schema, null, 2);
    } catch (e) {
      if (e instanceof BigQueryConflictError) {
        error = "Type conflict detected. Choose how to resolve before generating schema.";
        const first = e.conflicts[0];
        conflictMessage = first
          ? `Field '${first.fieldPath}' has conflicting types (${first.existingKind} vs ${first.incomingKind}). Should we cast to STRING or keep as RECORD and ignore invalid entries?`
          : "Type conflict detected. Choose a conflict-resolution strategy.";
      } else {
        error = "Invalid JSON: " + (e as Error).message;
      }
    }
  }

  return (
    <ToolLayout
      title="JSON to BigQuery Schema Generator"
      slug="json-to-bigquery-schema"
      description="Generate BigQuery table schemas from JSON data instantly. Handles nested objects, repeated fields, and automatic data type inference. Free online tool."
      keywords={["json to bigquery schema", "bigquery schema generator", "json to bq schema online", "generate bigquery table schema from json"]}
      howToUse={[
        "Paste your JSON object into the input panel.",
        "BigQuery schema is generated automatically in real-time.",
        "Toggle options for strict null handling and field descriptions.",
        "Copy the generated schema for use in BigQuery table creation."
      ]}
      whatIs={{
        title: "What is BigQuery Schema Generation?",
        content: "BigQuery requires a specific JSON schema format to define table structures. This tool analyzes your JSON data and generates the correct BigQuery schema with proper data types (STRING, INTEGER, FLOAT, BOOLEAN, TIMESTAMP, RECORD), field modes (NULLABLE, REQUIRED, REPEATED), and nested structures. It handles complex JSON with nested objects and arrays, automatically inferring whether arrays contain primitives or records. The generated schema can be directly used in BigQuery DDL statements or API calls. All processing happens in your browser — your JSON data is never sent to any server."
      }}
      faqs={[
        {
          q: "What BigQuery data types are supported?",
          a: "The generator supports all BigQuery types: STRING, INTEGER, FLOAT, BOOLEAN, TIMESTAMP, DATE, TIME, BYTES, and RECORD for nested objects. Data types are automatically inferred from JSON values."
        },
        {
          q: "How does it handle nested objects and arrays?",
          a: "Nested objects become RECORD type fields with their own fields array. Arrays of primitives use REPEATED mode. Arrays of objects become RECORD type with REPEATED mode and nested fields."
        },
        {
          q: "What's the difference between NULLABLE and REQUIRED?",
          a: "NULLABLE allows null values, REQUIRED disallows them. With strict nulls enabled, fields that never contain null in your sample data are marked REQUIRED."
        },
        {
          q: "Can I use this for BigQuery streaming inserts?",
          a: "Yes! The generated schema works for both batch loads and streaming inserts. Make sure your JSON data matches the schema structure."
        },
        {
          q: "What if my JSON has inconsistent types?",
          a: "The generator uses the first non-null value to determine type. For production use, ensure your JSON sample represents all possible data variations."
        },
      ]}
      relatedTools={[
        {
          name: "YAML ↔ JSON Converter",
          path: "/yaml-json-converter",
          description: "Convert YAML configs to JSON before generating BigQuery schemas."
        },
        {
          name: "JWT Decoder",
          path: "/jwt-decoder",
          description: "Decode JWT payloads and generate schemas for their claims."
        },
        {
          name: "cURL Converter",
          path: "/curl-converter",
          description: "Convert API calls to code, then generate schemas for responses."
        },
      ]}
    >
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={strictNulls}
            onChange={e => setStrictNulls(e.target.checked)}
            className="accent-primary"
          />
          Strict nulls (mark non-null fields as REQUIRED)
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={includeDescriptions}
            onChange={e => setIncludeDescriptions(e.target.checked)}
            className="accent-primary"
          />
          Include field descriptions
        </label>
      </div>

      {conflictMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-lg)]">
            <p className="text-sm font-semibold text-yellow-300 mb-2">Decision Required: Type Conflict</p>
            <p className="text-sm text-muted-foreground mb-4">{conflictMessage}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setConflictResolution("cast_to_string")}
                className="px-3 py-1.5 rounded-md text-xs font-semibold border bg-primary text-primary-foreground border-primary"
              >
                Cast to STRING
              </button>
              <button
                type="button"
                onClick={() => setConflictResolution("keep_record_ignore_invalid")}
                className="px-3 py-1.5 rounded-md text-xs font-semibold border bg-surface2 border-border hover:bg-surface"
              >
                Keep as RECORD and ignore invalid entries
              </button>
            </div>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mb-4 rounded-xl border border-blue-400/30 bg-blue-500/10 p-4">
          <p className="text-xs font-semibold text-blue-300 mb-2">Schema Warnings</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {warnings.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel
          value={input}
          onChange={setInput}
          label="JSON Input"
          placeholder='{"name": "John", "age": 30, "tags": ["developer", "admin"], "profile": {"city": "NYC", "active": true}}'
        />
        <CodePanel
          value={error || output}
          readOnly
          label="BigQuery Schema Output"
        />
      </div>
    </ToolLayout>
  );
}
