import type { Metadata } from "next";
import MarkdownPreviewerPage from "@/page-components/MarkdownPreviewer";

export const metadata: Metadata = {
  title: "Markdown Previewer & Editor Online",
  description: "Live markdown editor with instant preview. Supports GFM, tables, code blocks, and more. Free online tool.",
  keywords: ["markdown previewer", "markdown editor", "markdown to html", "gfm preview"],
  openGraph: {
    title: "Markdown Previewer & Editor Online | DevForge",
    description: "Live markdown editor with instant preview. Free online tool.",
    url: "https://devforge.tools/markdown-previewer",
  },
  alternates: {
    canonical: "https://devforge.tools/markdown-previewer",
  },
};

export default function Page() {
  return <MarkdownPreviewerPage />;
}

