import { Suspense } from "react";
import type { Metadata } from "next";
import ArrCalculatorPage from "@/page-components/finance/ArrCalculator";

export const metadata: Metadata = {
  title: "ARR / MRR Calculator — SaaS Revenue Decomposition | DevForge",
  description: "Calculate ARR, decompose MRR into new, expansion, and churned revenue. Get Quick Ratio and benchmark against top SaaS — instant, no signup.",
  keywords: ["ARR calculator India", "MRR calculator", "SaaS quick ratio", "net new MRR", "annual recurring revenue"],
  openGraph: {
    title: "ARR / MRR Calculator",
    description: "Decompose MRR, calculate Quick Ratio, benchmark against top SaaS.",
    url: "https://devforge.tools/tools/finance/arr-calculator",
  },
  alternates: { canonical: "https://devforge.tools/tools/finance/arr-calculator" },
};

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen" />}><ArrCalculatorPage /></Suspense>;
}
