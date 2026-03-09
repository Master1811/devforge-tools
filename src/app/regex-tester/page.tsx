import type { Metadata } from "next";
import RegexTesterPage from "@/page-components/RegexTester";

export const metadata: Metadata = {
  title: "RegEx Tester & Debugger Online",
  description: "Test regular expressions in real-time. See matches, groups, and test strings with JavaScript regex support.",
  keywords: ["regex tester", "regular expression tester", "regex debugger", "regex online"],
  openGraph: {
    title: "RegEx Tester & Debugger Online | DevForge",
    description: "Test regular expressions in real-time. Free online regex tester.",
    url: "https://devforge.tools/regex-tester",
  },
  alternates: {
    canonical: "https://devforge.tools/regex-tester",
  },
};

export default function Page() {
  return <RegexTesterPage />;
}

