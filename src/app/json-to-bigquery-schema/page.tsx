import type { Metadata } from "next";
import JsonToBigQueryPage from "@/page-components/JsonToBigQuery";

export const metadata: Metadata = {
  title: "JSON to BigQuery Schema Generator",
  description: "Generate BigQuery table schemas from JSON data instantly. Handles nested objects, arrays, and correct data type inference. Free online tool.",
  keywords: ["json to bigquery schema", "bigquery schema generator", "json to bq schema online", "generate bigquery table schema"],
  openGraph: {
    title: "JSON to BigQuery Schema Generator | DevForge",
    description: "Generate BigQuery table schemas from JSON data instantly. Free online tool.",
    url: "https://devforge.tools/json-to-bigquery-schema",
  },
  alternates: {
    canonical: "https://devforge.tools/json-to-bigquery-schema",
  },
};

export default function Page() {
  return <JsonToBigQueryPage />;
}

