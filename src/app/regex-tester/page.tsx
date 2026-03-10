import type { Metadata } from "next";
import { Suspense } from "react";
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

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoading />}>
      <RegexTesterPage />
    </Suspense>
  );
}

