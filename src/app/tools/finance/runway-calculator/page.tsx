import { Suspense } from "react";
import type { Metadata } from "next";
import RunwayCalculatorPage from "@/page-components/finance/RunwayCalculator";

export const metadata: Metadata = {
  title: "Startup Runway Calculator — Free Cash Runway Tool | DevForge",
  description: "Calculate your startup's exact cash runway. See break-even month, net vs gross burn, and default-alive status — fully client-side, no signup required.",
  keywords: ["startup runway calculator", "cash runway calculator India", "net burn calculator", "default alive", "break-even calculator"],
  openGraph: {
    title: "Startup Runway Calculator",
    description: "Know exactly how long your cash lasts. Free, instant, client-side.",
    url: "https://devforge.tools/tools/finance/runway-calculator",
  },
  alternates: { canonical: "https://devforge.tools/tools/finance/runway-calculator" },
};

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen" />}><RunwayCalculatorPage /></Suspense>;
}
