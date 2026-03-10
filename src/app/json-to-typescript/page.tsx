import type { Metadata } from "next";
import JsonToTypescriptPage from "@/page-components/JsonToTypescript";

export const metadata: Metadata = {
  title: "JSON to TypeScript Converter",
  description: "Convert JSON data to TypeScript interfaces, types, Zod schemas, or Yup validation schemas. Supports nested objects, arrays, and automatic type inference. Free online tool.",
  keywords: ["json to typescript", "typescript interface generator", "json schema", "type inference", "zod schema", "yup validation"],
  openGraph: {
    title: "JSON to TypeScript Converter | DevForge",
    description: "Convert JSON data to TypeScript interfaces, types, Zod schemas, or Yup validation schemas. Free online tool.",
    url: "https://devforge.tools/json-to-typescript",
  },
  alternates: {
    canonical: "https://devforge.tools/json-to-typescript",
  },
};

export default function Page() {
  return <JsonToTypescriptPage />;
}

