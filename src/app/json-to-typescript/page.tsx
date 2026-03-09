import type { Metadata } from "next";
import JsonToTypescriptPage from "@/page-components/JsonToTypescript";

export const metadata: Metadata = {
  title: "JSON to TypeScript Converter",
  description: "Generate TypeScript interfaces from JSON instantly. Supports nested objects, arrays, and optional fields. Free online tool.",
  keywords: ["json to typescript", "json to ts", "typescript interface generator", "json to type"],
  openGraph: {
    title: "JSON to TypeScript Converter | DevForge",
    description: "Generate TypeScript interfaces from JSON instantly. Free online tool.",
    url: "https://devforge.tools/json-to-typescript",
  },
  alternates: {
    canonical: "https://devforge.tools/json-to-typescript",
  },
};

export default function Page() {
  return <JsonToTypescriptPage />;
}

