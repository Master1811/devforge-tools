import type { Metadata } from "next";
import SQLFormatterPage from "@/page-components/SQLFormatter";

export const metadata: Metadata = {
  title: "SQL Formatter & Beautifier Online",
  description: "Format and beautify SQL queries instantly. Supports multiple SQL dialects including MySQL, PostgreSQL, and SQLite.",
  keywords: ["sql formatter", "sql beautifier", "format sql online", "sql pretty print"],
  openGraph: {
    title: "SQL Formatter & Beautifier Online | DevForge",
    description: "Format and beautify SQL queries instantly. Free online tool.",
    url: "https://devforge.tools/sql-formatter",
  },
  alternates: {
    canonical: "https://devforge.tools/sql-formatter",
  },
};

export default function Page() {
  return <SQLFormatterPage />;
}

