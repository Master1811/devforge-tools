import {
  KeyRound,
  Braces,
  Database,
  Clock,
  Regex,
  Binary,
  Terminal,
  FileJson,
  FileText,
  Lock,
  Shield,
  Code,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ToolEntry {
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
  /** Primary tag (used by HomePage card) */
  tag: string;
  /** All tags (used by Tools directory for filtering) */
  tags: string[];
  /** Search keywords */
  keywords: string[];
}

export const TOOLS: ToolEntry[] = [
  {
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration — no signup required.",
    path: "/jwt-decoder",
    icon: KeyRound,
    tag: "auth",
    tags: ["auth", "security", "debugging"],
    keywords: ["jwt", "token", "decode", "inspect", "header", "payload", "signature", "expiration"],
  },
  {
    name: "JSON to BigQuery Schema",
    description: "Generate BigQuery table schemas from JSON data. Handles nested objects, arrays, and automatic type inference.",
    path: "/json-to-bigquery-schema",
    icon: Braces,
    tag: "bigquery",
    tags: ["bigquery", "json", "schema", "database"],
    keywords: ["json", "bigquery", "schema", "bq", "table", "type", "inference", "nested"],
  },
  {
    name: "JSON to TypeScript",
    description: "Convert JSON data to TypeScript interfaces, types, Zod schemas, or Yup validation schemas with automatic type inference.",
    path: "/json-to-typescript",
    icon: Code,
    tag: "types",
    tags: ["typescript", "json", "schema", "types"],
    keywords: ["json", "typescript", "interface", "type", "zod", "yup", "schema", "inference"],
  },
  {
    name: "SQL Optimizer",
    description: "Analyze SQL queries for performance issues in Snowflake and Databricks. Detect optimization opportunities.",
    path: "/sql-optimizer",
    icon: Database,
    tag: "database",
    tags: ["database", "sql", "optimization", "performance"],
    keywords: ["sql", "optimizer", "snowflake", "databricks", "performance", "query", "analysis"],
  },
  {
    name: "Cron Visualizer",
    description: "Human-readable cron expressions. See when your scheduled tasks will run next.",
    path: "/cron-visualizer",
    icon: Clock,
    tag: "scheduling",
    tags: ["scheduling", "cron", "automation", "time"],
    keywords: ["cron", "scheduler", "expression", "schedule", "automation", "timing"],
  },
  {
    name: "RegEx Tester",
    description: "Test regular expressions in real-time. See matches highlighted with capture groups and performance profiling.",
    path: "/regex-tester",
    icon: Regex,
    tag: "patterns",
    tags: ["regex", "patterns", "validation", "text"],
    keywords: ["regex", "regular expression", "pattern", "test", "match", "capture", "validation"],
  },
  {
    name: "Base64 Encoder",
    description: "Encode and decode Base64 strings and files. Detect content types automatically.",
    path: "/base64-encoder",
    icon: Binary,
    tag: "encoding",
    tags: ["encoding", "base64", "files", "data"],
    keywords: ["base64", "encode", "decode", "binary", "file", "data", "encoding"],
  },
  {
    name: "cURL Converter",
    description: "Convert curl commands to any language. Generate fetch, axios, requests, and more.",
    path: "/curl-converter",
    icon: Terminal,
    tag: "api",
    tags: ["api", "curl", "http", "conversion"],
    keywords: ["curl", "converter", "api", "http", "fetch", "axios", "requests", "python"],
  },
  {
    name: "YAML ↔ JSON",
    description: "Convert between YAML and JSON formats. Bidirectional conversion with validation.",
    path: "/yaml-json-converter",
    icon: FileJson,
    tag: "config",
    tags: ["yaml", "json", "config", "conversion"],
    keywords: ["yaml", "json", "converter", "config", "configuration", "format"],
  },
  {
    name: "Markdown Previewer",
    description: "Live markdown editor with instant preview. Write documentation with real-time rendering.",
    path: "/markdown-previewer",
    icon: FileText,
    tag: "docs",
    tags: ["markdown", "docs", "writing", "preview"],
    keywords: ["markdown", "preview", "editor", "documentation", "writing", "render"],
  },
  {
    name: "Password Generator",
    description: "Cryptographically secure password generation.",
    path: "/password-generator",
    icon: Lock,
    tag: "security",
    tags: ["security", "password", "generation"],
    keywords: ["password", "generator", "secure", "random", "cryptographic"],
  },
  {
    name: "Password Policy Auditor",
    description: "Validate passwords against enterprise security policies including NIST, OWASP, and corporate standards.",
    path: "/password-policy-auditor",
    icon: Shield,
    tag: "security",
    tags: ["security", "password", "policy", "enterprise"],
    keywords: ["password", "policy", "auditor", "nist", "owasp", "corporate", "security", "compliance"],
  },
];
