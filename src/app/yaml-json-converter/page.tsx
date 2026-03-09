import type { Metadata } from "next";
import YamlJsonConverterPage from "@/page-components/YamlJsonConverter";

export const metadata: Metadata = {
  title: "YAML to JSON Converter Online",
  description: "Convert between YAML and JSON formats instantly. Supports multi-document YAML, anchors, and aliases.",
  keywords: ["yaml to json", "json to yaml", "yaml converter", "yaml parser online"],
  openGraph: {
    title: "YAML to JSON Converter Online | DevForge",
    description: "Convert between YAML and JSON formats instantly. Free online tool.",
    url: "https://devforge.tools/yaml-json-converter",
  },
  alternates: {
    canonical: "https://devforge.tools/yaml-json-converter",
  },
};

export default function Page() {
  return <YamlJsonConverterPage />;
}

