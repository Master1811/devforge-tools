import { Suspense } from "react";
import type { Metadata } from "next";
import BurnRateCalculatorPage from "@/page-components/finance/BurnRateCalculator";

export const metadata: Metadata = {
  title: "Burn Rate Calculator — Startup Cost Breakdown | DevForge",
  description: "Break down your monthly burn by category. Calculate net burn, runway, burn multiple, and get actionable insights on capital efficiency — free, client-side.",
  keywords: ["burn rate calculator India", "startup burn rate", "net burn gross burn", "burn multiple", "startup cost breakdown"],
  openGraph: {
    title: "Burn Rate Calculator",
    description: "Break down where your money goes. Calculate burn multiple and runway.",
    url: "https://devforge.tools/tools/finance/burn-rate-calculator",
  },
  alternates: { canonical: "https://devforge.tools/tools/finance/burn-rate-calculator" },
};

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen" />}><BurnRateCalculatorPage /></Suspense>;
}
