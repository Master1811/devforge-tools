import type { Metadata } from "next";
import { Suspense } from "react";
import CurlConverterPage from "@/page-components/CurlConverter";

export const metadata: Metadata = {
  title: "cURL to Code Converter Online",
  description: "Convert cURL commands to JavaScript, Python, Go, and more. Support for headers, data, and authentication.",
  keywords: ["curl converter", "curl to code", "curl to fetch", "curl to python"],
  openGraph: {
    title: "cURL to Code Converter Online | DevForge",
    description: "Convert cURL commands to JavaScript, Python, Go, and more. Free online tool.",
    url: "https://devforge.tools/curl-converter",
  },
  alternates: {
    canonical: "https://devforge.tools/curl-converter",
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
      <CurlConverterPage />
    </Suspense>
  );
}

