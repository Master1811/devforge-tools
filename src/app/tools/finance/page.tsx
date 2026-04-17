import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Target, Flame, TrendingUp, Calculator, BarChart3, ArrowRight, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Finance & Founder Tools — Free SaaS Calculators | DevForge",
  description: "Free startup finance tools: ARR calculator, runway calculator, burn rate analysis, growth rate, SaaS metrics. Client-side, instant, no signup.",
  alternates: { canonical: "https://devforge.tools/tools/finance" },
};

const CATEGORIES = [
  {
    label: "Core Metrics",
    tools: [
      {
        name: "₹100Cr Journey Calculator",
        description: "Map your path to ₹100 Crore ARR. T2D3 benchmarks, runway analysis, burn multiple, milestone timeline.",
        path: "/tools/finance/100cr-calculator",
        icon: Target,
        tag: "Flagship",
        tagColor: "text-primary bg-primary/10 border-primary/20",
        available: true,
      },
      {
        name: "ARR / MRR Calculator",
        description: "Decompose MRR into new logos, expansion, and churn. Calculate ARR, Quick Ratio, and net new MRR.",
        path: "/tools/finance/arr-calculator",
        icon: TrendingUp,
        tag: "Live",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        available: true,
      },
      {
        name: "Growth Rate Calculator",
        description: "Calculate MoM growth, YoY, CAGR, and doubling time. Compare against T2D3 phases.",
        path: "/tools/finance/growth-rate-calculator",
        icon: BarChart3,
        tag: "Live",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        available: true,
      },
    ],
  },
  {
    label: "Cash & Burn",
    tools: [
      {
        name: "Runway Calculator",
        description: "Calculate exact cash runway with MRR growth projections. See break-even month and default-alive status.",
        path: "/tools/finance/runway-calculator",
        icon: Flame,
        tag: "Live",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        available: true,
      },
      {
        name: "Burn Rate Calculator",
        description: "Break down monthly burn by category. Get net burn, burn multiple, and path to profitability.",
        path: "/tools/finance/burn-rate-calculator",
        icon: Calculator,
        tag: "Live",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        available: true,
      },
    ],
  },
  {
    label: "SaaS Metrics (Coming Soon)",
    tools: [
      {
        name: "LTV / CAC Calculator",
        description: "Model customer lifetime value, acquisition cost, and payback period across segments.",
        path: "/tools/finance/ltv-cac",
        icon: Zap,
        tag: "Coming soon",
        tagColor: "text-muted-foreground/50 bg-white/5 border-white/10",
        available: false,
      },
      {
        name: "SaaS Metrics Simulator",
        description: "Full-stack SaaS model: LTV, CAC, magic number, Rule of 40, and cohort retention.",
        path: "/tools/finance/saas-metrics",
        icon: BarChart3,
        tag: "Coming soon",
        tagColor: "text-muted-foreground/50 bg-white/5 border-white/10",
        available: false,
      },
      {
        name: "Fundraising Readiness Score",
        description: "Score your startup across 12 VC-relevant metrics. Get a go/no-go signal with improvement roadmap.",
        path: "/tools/finance/fundraising-readiness",
        icon: Target,
        tag: "Coming soon",
        tagColor: "text-muted-foreground/50 bg-white/5 border-white/10",
        available: false,
      },
    ],
  },
];

function ToolCard({ tool }: { tool: (typeof CATEGORIES)[0]["tools"][0] }) {
  const Icon = tool.icon;
  const card = (
    <div
      className={`group relative flex flex-col h-full rounded-2xl border bg-surface/60 backdrop-blur-sm p-5 transition-all duration-300 ${
        tool.available
          ? "border-border hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
          : "border-border/40 opacity-50"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border ${tool.tagColor}`}>
          {tool.tag}
        </span>
      </div>

      <h3 className="font-semibold text-[15px] mb-2 group-hover:text-primary transition-colors duration-200">
        {tool.name}
      </h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed flex-1 mb-4">
        {tool.description}
      </p>

      {tool.available && (
        <div className="flex items-center gap-1 text-[12px] text-primary font-medium mt-auto">
          Open tool
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      )}
    </div>
  );

  return tool.available ? <Link href={tool.path}>{card}</Link> : <div>{card}</div>;
}

export default function FinanceToolsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="page-container max-w-5xl">
          {/* Breadcrumb */}
          <nav className="text-[11px] font-mono text-muted-foreground/60 mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2 text-muted-foreground/30">/</span>
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span className="mx-2 text-muted-foreground/30">/</span>
            <span className="text-foreground/80">Finance</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              5 tools live · 3 coming soon
            </div>
            <h1 className="heading-display text-3xl sm:text-4xl mb-3">Finance & Founder Tools</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl">
              Free, instant calculators for SaaS founders and startup operators. No accounts. No data leaves your browser.
              Built for the Indian startup ecosystem — with ₹ natively, benchmarks from real Indian SaaS companies.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-10">
            {CATEGORIES.map((cat) => (
              <section key={cat.label}>
                <h2 className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-4">
                  {cat.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.path} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Internal link bridge to Dev tools */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="heading-display text-lg mb-1">Also need Dev tools?</h2>
              <p className="text-muted-foreground text-[14px]">
                JWT decoder, SQL optimizer, Regex tester, Base64, cURL converter — 12 tools live.
              </p>
            </div>
            <Link
              href="/tools"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-[13px] font-semibold hover:bg-primary/30 transition-colors whitespace-nowrap"
            >
              Browse dev tools
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
