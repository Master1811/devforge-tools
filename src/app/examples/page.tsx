import type { Metadata } from "next";
import ExamplesPage from "@/page-components/Examples";

export const metadata: Metadata = {
  title: "Tool Examples & Use Cases | DevForge Tools",
  description: "Real-world examples and use cases for developer tools. See JWT decoding, regex patterns, SQL formatting, and API conversion in action with practical examples.",
  keywords: ["examples", "use cases", "jwt examples", "regex examples", "sql examples", "api examples", "tutorials"],
  openGraph: {
    title: "Tool Examples & Use Cases | DevForge Tools",
    description: "Real-world examples and use cases for developer tools.",
    url: "https://devforge.tools/examples",
  },
  alternates: {
    canonical: "https://devforge.tools/examples",
  },
};

export default function Page() {
  return <ExamplesPage />;
}