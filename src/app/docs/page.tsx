import type { Metadata } from "next";
import DocsPage from "@/page-components/Docs";

export const metadata: Metadata = {
  title: "Documentation & Guides | DevForge Tools",
  description: "Comprehensive documentation and guides for developer tools. Learn how to use JWT decoder, regex tester, SQL formatter, and more with examples and best practices.",
  keywords: ["documentation", "guides", "tutorials", "jwt", "regex", "sql", "api", "developer tools"],
  openGraph: {
    title: "Documentation & Guides | DevForge Tools",
    description: "Comprehensive documentation and guides for developer tools.",
    url: "https://devforge.tools/docs",
  },
  alternates: {
    canonical: "https://devforge.tools/docs",
  },
};

export default function Page() {
  return <DocsPage />;
}