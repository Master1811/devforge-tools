import type { Metadata } from "next";
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

export default function Page() {
  return <CurlConverterPage />;
}

