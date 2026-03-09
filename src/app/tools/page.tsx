import type { Metadata } from "next";
import ToolsPage from "@/page-components/Tools";

export const metadata: Metadata = {
  title: "Developer Tools Directory | DevForge Tools",
  description: "Complete directory of free developer tools for JWT decoding, regex testing, SQL formatting, API conversion, and more. All tools run client-side with zero data transmission.",
  keywords: ["developer tools", "programming tools", "jwt decoder", "regex tester", "sql formatter", "curl converter", "json tools", "base64 encoder", "password generator"],
  openGraph: {
    title: "Developer Tools Directory | DevForge Tools",
    description: "Complete directory of free developer tools for JWT decoding, regex testing, SQL formatting, API conversion, and more.",
    url: "https://devforge.tools/tools",
  },
  alternates: {
    canonical: "https://devforge.tools/tools",
  },
};

export default function Page() {
  return <ToolsPage />;
}