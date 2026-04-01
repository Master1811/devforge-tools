import type { Metadata } from "next";
import SQLOptimizerPage from "@/page-components/SQLOptimizer";

export const metadata: Metadata = {
  title: "Snowflake / Databricks SQL Optimizer",
  description: "Analyze SQL queries for performance issues specific to Snowflake and Databricks warehouses. Detect full table scans, inefficient joins, missing partitions, and warehouse-specific optimizations.",
  keywords: ["sql optimizer", "snowflake sql optimization", "databricks sql performance", "sql query analysis", "warehouse optimization"],
  openGraph: {
    title: "Snowflake / Databricks SQL Optimizer | DevForge",
    description: "Analyze SQL queries for performance issues specific to Snowflake and Databricks warehouses. Free online tool.",
    url: "https://devforge.tools/sql-optimizer",
  },
  alternates: {
    canonical: "https://devforge.tools/sql-optimizer",
  },
};

export default function Page() {
  return <SQLOptimizerPage />;
}

