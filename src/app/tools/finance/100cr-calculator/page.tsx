import { Suspense } from "react";
import type { Metadata } from "next";
import HundredCrCalculatorPage from "@/page-components/finance/HundredCrCalculator";

export const metadata: Metadata = {
  title: "₹100Cr ARR Journey Calculator — Free Startup Finance Tool | DevForge",
  description:
    "Calculate your startup's timeline to ₹100 Crore ARR. Get burn rate, runway, T2D3 benchmark comparisons, and actionable insights — fully client-side, no signup.",
  keywords: [
    "100 crore ARR calculator",
    "startup runway calculator India",
    "SaaS growth rate calculator",
    "burn rate calculator India",
    "ARR projection tool",
    "default alive calculator",
    "T2D3 growth model",
    "Indian startup finance tools",
    "SaaS metrics calculator",
    "startup burn multiple",
  ],
  openGraph: {
    title: "₹100Cr ARR Journey Calculator",
    description:
      "Map your startup's path to ₹100Cr ARR with real-time projections and benchmark-driven insights.",
    type: "website",
    url: "https://devforge.tools/tools/finance/100cr-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "₹100Cr ARR Journey Calculator",
    description: "Free startup finance tool — burn rate, runway, T2D3 benchmarks, shareable scenarios.",
  },
  alternates: {
    canonical: "https://devforge.tools/tools/finance/100cr-calculator",
  },
};

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoading />}>
      <HundredCrCalculatorPage />
    </Suspense>
  );
}
