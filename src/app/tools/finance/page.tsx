import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ArrowRight } from "lucide-react";
import { FINANCE_HUB_SECTIONS, FINANCE_TOOLS } from "@/lib/tools/finance/journey";
import { FinanceHubCard } from "@/components/finance/FinanceHubCard";

export const metadata: Metadata = {
  title: "Finance & Founder Tools — Free SaaS Calculators | DevForge",
  description: "Free startup finance tools: ARR calculator, runway calculator, burn rate analysis, growth rate, SaaS metrics. Client-side, instant, no signup.",
  alternates: { canonical: "https://devforge.tools/tools/finance" },
};

export default function FinanceToolsPage() {
  const liveCount = FINANCE_TOOLS.filter((t) => t.status === "live").length;
  const comingSoonCount = FINANCE_TOOLS.filter((t) => t.status === "coming_soon").length;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="page-container max-w-5xl">
          <nav className="text-[11px] font-mono text-muted-foreground/60 mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2 text-muted-foreground/30">/</span>
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span className="mx-2 text-muted-foreground/30">/</span>
            <span className="text-foreground/80">Finance</span>
          </nav>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {liveCount} tools live · {comingSoonCount} in preview
            </div>
            <h1 className="heading-display text-3xl sm:text-4xl mb-3">Finance & Founder Tools</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl">
              Free, instant calculators for SaaS founders and startup operators. No accounts. No data leaves your browser.
              Built for the Indian startup ecosystem — with ₹ natively, benchmarks from real Indian SaaS companies.
            </p>
          </div>

          <div className="space-y-10">
            {FINANCE_HUB_SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-2">
                  {section.title}
                </h2>
                <p className="text-[13px] text-muted-foreground mb-4">{section.subtitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FINANCE_TOOLS.filter((tool) => tool.stage === section.stage).map(({ icon: _icon, ...tool }) => (
                    <FinanceHubCard key={tool.path} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>

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
