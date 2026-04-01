export interface FixPageContent {
  slug: string;
  title: string;
  query: string;
  summary: string;
  whyItHappens: string;
  quickFix: string[];
  toolPath: "/json-to-bigquery-schema" | "/sql-optimizer";
  toolName: "JSON to BigQuery Schema Generator" | "Snowflake / Databricks SQL Optimizer";
}

const bigQueryFixes: FixPageContent[] = [
  {
    slug: "how-to-fix-bigquery-field-name-contains-invalid-characters",
    title: "Fix BigQuery: Field name contains invalid characters",
    query: "How to fix BigQuery 'Field name contains invalid characters'",
    summary: "BigQuery only accepts letters, numbers, and underscores in field names.",
    whyItHappens: "Source JSON often includes keys like 'user-id', 'first name', or '$meta', which violate BigQuery naming rules.",
    quickFix: [
      "Rename fields to snake_case using only letters, numbers, and underscores.",
      "Ensure field names do not start with a number.",
      "Regenerate your schema before creating/loading the table.",
    ],
    toolPath: "/json-to-bigquery-schema",
    toolName: "JSON to BigQuery Schema Generator",
  },
  {
    slug: "how-to-fix-bigquery-no-such-field",
    title: "Fix BigQuery: No such field in query",
    query: "How to fix BigQuery 'No such field'",
    summary: "The query references a field that is missing or named differently in the table schema.",
    whyItHappens: "Schema drift or nested RECORD fields are commonly mis-referenced.",
    quickFix: [
      "Inspect the latest schema and verify exact field names and nesting.",
      "Use dot notation for nested RECORD fields.",
      "Regenerate schema from representative JSON samples.",
    ],
    toolPath: "/json-to-bigquery-schema",
    toolName: "JSON to BigQuery Schema Generator",
  },
  {
    slug: "how-to-fix-bigquery-cannot-access-field-on-array",
    title: "Fix BigQuery: Cannot access field on ARRAY",
    query: "How to fix BigQuery cannot access field on ARRAY",
    summary: "You are reading array fields as if they were plain objects.",
    whyItHappens: "Nested arrays require UNNEST or proper repeated-field handling.",
    quickFix: [
      "Use UNNEST on repeated fields before field access.",
      "Confirm whether the source JSON key is array vs object.",
      "Rebuild schema so repeated fields are marked correctly.",
    ],
    toolPath: "/json-to-bigquery-schema",
    toolName: "JSON to BigQuery Schema Generator",
  },
];

const bqErrorSeeds = [
  "invalid date format",
  "invalid timestamp format",
  "cannot parse integer value",
  "cannot parse floating point value",
  "schema mismatch during load job",
  "provided schema does not match table",
  "unexpected NULL in REQUIRED field",
  "duplicate field name",
  "unsupported top-level array input",
  "nested RECORD field missing",
  "array element type mismatch",
  "cannot cast STRING to DATE",
  "cannot cast STRING to TIMESTAMP",
  "json key contains spaces",
  "json key starts with number",
  "trailing commas in json input",
  "invalid json object root",
  "required field not present",
  "inconsistent types across rows",
  "bytes field invalid base64",
  "unknown field during load",
  "partition field type mismatch",
  "clustering column not in schema",
  "repeated field mode incorrect",
  "record field type conflict",
  "schema evolution failed",
  "cannot read nested repeated records",
  "json parse error at position",
];

const sqlSnowflakeSeeds = [
  "snowflake query slow with many joins",
  "snowflake query full table scan",
  "snowflake slow LIKE with leading wildcard",
  "snowflake count over slow",
  "snowflake flatten too expensive",
  "snowflake union performance issue",
  "snowflake select star performance",
  "snowflake missing partition pruning",
  "snowflake nested subquery slow",
  "snowflake query without limit slow",
  "snowflake join cardinality explosion",
  "snowflake heavy sort order by slow",
  "snowflake cte performance troubleshooting",
  "snowflake compute cost too high",
];

const sqlDatabricksSeeds = [
  "databricks query slow with many joins",
  "databricks merge into slow",
  "databricks vacuum impact on performance",
  "databricks full table scan in delta",
  "databricks select star cost issue",
  "databricks nested subquery slow",
  "databricks union distinct overhead",
  "databricks missing data pruning",
  "databricks no limit development query",
  "databricks expensive join predicates",
  "databricks sql cost reduction patterns",
  "databricks optimize query checklist",
  "databricks warehouse query tuning basics",
  "databricks query latency troubleshooting",
];

function toSlug(prefix: string, text: string): string {
  return `${prefix}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function createBigQuerySeedPages(): FixPageContent[] {
  return bqErrorSeeds.map((seed) => ({
    slug: toSlug("fix-bigquery", seed),
    title: `Fix BigQuery: ${seed}`,
    query: `How to fix BigQuery ${seed}`,
    summary: "This error usually points to schema/data misalignment between incoming JSON and BigQuery field definitions.",
    whyItHappens: "BigQuery enforces strict typing and field naming. Small JSON shape differences can break ingestion or query execution.",
    quickFix: [
      "Validate JSON shape against your intended table schema.",
      "Normalize field names and nested structures before load/query.",
      "Regenerate schema from realistic sample payloads and retry.",
    ],
    toolPath: "/json-to-bigquery-schema",
    toolName: "JSON to BigQuery Schema Generator",
  }));
}

function createSqlSeedPages(
  seeds: string[],
  warehouse: "Snowflake" | "Databricks",
): FixPageContent[] {
  return seeds.map((seed) => ({
    slug: toSlug(`fix-${warehouse.toLowerCase()}`, seed),
    title: `Fix ${warehouse}: ${seed}`,
    query: `How to fix ${seed}`,
    summary: "This usually indicates avoidable scan, join, or compute overhead in the current SQL shape.",
    whyItHappens: `Complex join graphs, broad SELECTs, and low-selectivity predicates can drive high cost in ${warehouse}.`,
    quickFix: [
      "Reduce scanned data early with targeted filters and explicit columns.",
      "Review join predicates and remove unnecessary DISTINCT/UNION operations.",
      "Run an automated lint pass to catch anti-patterns quickly.",
    ],
    toolPath: "/sql-optimizer",
    toolName: "Snowflake / Databricks SQL Optimizer",
  }));
}

export const fixPages: FixPageContent[] = [
  ...bigQueryFixes,
  ...createBigQuerySeedPages(),
  ...createSqlSeedPages(sqlSnowflakeSeeds, "Snowflake"),
  ...createSqlSeedPages(sqlDatabricksSeeds, "Databricks"),
];

export function getFixPage(slug: string): FixPageContent | undefined {
  return fixPages.find((page) => page.slug === slug);
}
