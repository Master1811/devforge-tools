import { Suspense } from "react";
import type { Metadata } from "next";
import GrowthRateCalculatorPage from "@/page-components/finance/GrowthRateCalculator";

export const metadata: Metadata = {
  title: "Growth Rate Calculator — MoM, CAGR, T2D3 Benchmarks | DevForge",
  description: "Calculate MoM growth, YoY, CAGR, and doubling time from any two ARR data points. Compare against T2D3 benchmarks — free, instant, no signup.",
  keywords: ["growth rate calculator India", "SaaS MoM growth calculator", "CAGR startup", "T2D3 growth model", "ARR growth rate", "doubling time"],
  openGraph: {
    title: "SaaS Growth Rate Calculator",
    description: "Calculate MoM, CAGR, and doubling time. See where you sit on T2D3.",
    url: "https://devforge.tools/tools/finance/growth-rate-calculator",
  },
  alternates: { canonical: "https://devforge.tools/tools/finance/growth-rate-calculator" },
};

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen" />}><GrowthRateCalculatorPage /></Suspense>;
}
