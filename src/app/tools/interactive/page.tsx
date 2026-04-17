import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import {
  INTERACTIVE_HUB_SECTIONS,
  INTERACTIVE_TOOLS,
} from "@/lib/tools/interactive/journey";
import { InteractiveHubCard } from "@/components/interactive/InteractiveHubCard";

export const metadata: Metadata = {
  title: "Interactive Tools — Visual Playground | DevForge",
  description:
    "Visual tools you can't replace with ChatGPT. Real-time simulators with sliders, live charts, and spatial interaction. Cap table simulator, growth scenario modeler, glassmorphism playground.",
  alternates: { canonical: "https://devforge.tools/tools/interactive" },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function InteractiveToolsPage() {
  const liveCount = INTERACTIVE_TOOLS.filter((t) => t.status === "live").length;
  const comingSoonCount = INTERACTIVE_TOOLS.filter((t) => t.status === "coming_soon").length;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">

          {/* ── Header region with animated background ──────────────────────
               BackgroundPaths is clipped to this relative container.
               The bottom fade (fadeColor matches page bg) blends it into
               the tool-card sections below, keeping those areas clean.
          ───────────────────────────────────────────────────────────────── */}
          <div className="relative overflow-hidden rounded-2xl -mx-4 px-4 pb-2 mb-14">
            <BackgroundPaths fadeBottom fadeColor="#FAFAFA" />

            {/* All header content sits above the background */}
            <div className="relative z-[1]">

          {/* Breadcrumb */}
          <nav className="text-[11px] font-mono text-[rgba(10,10,10,0.38)] mb-8 pt-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
            <span className="text-[rgba(10,10,10,0.18)]">/</span>
            <Link href="/tools" className="hover:text-[#0A0A0A] transition-colors">Tools</Link>
            <span className="text-[rgba(10,10,10,0.18)]">/</span>
            <span className="text-[rgba(10,10,10,0.60)]">Interactive</span>
          </nav>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono mb-5"
              style={{
                borderColor: "rgba(139,92,246,0.22)",
                background: "rgba(139,92,246,0.07)",
                color: "#7C3AED",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              {liveCount} live · {comingSoonCount} coming soon
            </div>

            <h1
              className="font-display font-bold text-[#0A0A0A] tracking-[-0.03em] mb-3"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
            >
              Interactive Playground
            </h1>
            <p className="text-[15px] text-[rgba(10,10,10,0.52)] leading-relaxed max-w-2xl mb-6">
              Tools that require a human hand. Every tool here is built around sliders, toggles,
              and real-time visual output — spatial understanding a text model fundamentally cannot provide.
            </p>

            {/* AI-defensibility callout */}
            <div
              className="flex items-start gap-3 px-4 py-3.5 rounded-xl border max-w-2xl"
              style={{
                borderColor: "rgba(139,92,246,0.18)",
                background: "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(124,58,237,0.02) 100%)",
              }}
            >
              <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <p className="text-[12.5px] text-[rgba(10,10,10,0.57)] leading-relaxed">
                <span className="font-semibold text-[#0A0A0A]">Rule of this section:</span>{" "}
                No tool belongs here unless it has mandatory sliders or toggles, produces real-time
                chart output, and would be useless as a static text form. These are not utilities —
                they are experiences.
              </p>
            </div>
          </div>{/* end header inner */}
            </div>{/* end relative z-[1] */}
          </div>{/* end BackgroundPaths container */}

          {/* ── Tool Sections ───────────────────────────────────────────────── */}
          <div className="space-y-14">
            {INTERACTIVE_HUB_SECTIONS.map((section) => {
              const sectionTools = INTERACTIVE_TOOLS.filter((t) => t.stage === section.stage);
              if (sectionTools.length === 0) return null;
              return (
                <section key={section.id}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: section.accentColor }} />
                    <h2 className="text-[11px] font-mono text-[rgba(10,10,10,0.40)] uppercase tracking-widest">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-[13px] text-[rgba(10,10,10,0.48)] mb-5 pl-4">{section.subtitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionTools.map(({ icon: _icon, ...tool }) => (
                      <InteractiveHubCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* ── Finance Funnel ─────────────────────────────────────────────────
               Interactive is the hook. Finance is the depth.
               This panel drives users from simulation → structured analysis.
          ─────────────────────────────────────────────────────────────────── */}
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(10,10,10,0.35)]">
                Go deeper
              </p>
            </div>
            <h2 className="font-display font-bold text-[18px] text-[#0A0A0A] tracking-[-0.02em] mb-1">
              Turn insight into action
            </h2>
            <p className="text-[13.5px] text-[rgba(10,10,10,0.50)] mb-5 max-w-lg">
              The simulators above give you a feel for the numbers. These Finance tools give you the exact analysis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  href: "/tools/finance/runway-calculator",
                  title: "Runway Calculator",
                  description: "Exact cash runway, break-even month, default-alive status.",
                  from: "After Cap Table Simulator",
                },
                {
                  href: "/tools/finance/arr-calculator",
                  title: "ARR / MRR Calculator",
                  description: "Decompose MRR into new, expansion, and churned revenue.",
                  from: "After Growth Simulator",
                },
                {
                  href: "/tools/finance/100cr-calculator",
                  title: "₹100Cr Journey",
                  description: "T2D3 benchmarks and milestone scoring on your path to ₹100Cr.",
                  from: "After Growth Simulator",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border border-[rgba(0,0,0,0.09)] bg-white p-5
                             [transition:transform_220ms_cubic-bezier(0.22,1,0.36,1),border-color_220ms_cubic-bezier(0.22,1,0.36,1),box-shadow_280ms_cubic-bezier(0.22,1,0.36,1),background-color_180ms_cubic-bezier(0.22,1,0.36,1)]
                             hover:border-[rgba(16,185,129,0.28)] hover:shadow-[0_6px_24px_rgba(16,185,129,0.08)]
                             hover:-translate-y-px"
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider">{item.from}</span>
                  </div>
                  <h3 className="font-semibold text-[14px] text-[#0A0A0A] mb-1.5 group-hover:text-emerald-700 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] text-[rgba(10,10,10,0.48)] leading-relaxed flex-1 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 mt-auto">
                    Open
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/tools/finance"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[13px] font-semibold transition-all duration-200 hover:shadow-sm"
                style={{
                  borderColor: "rgba(16,185,129,0.22)",
                  background: "rgba(16,185,129,0.06)",
                  color: "#059669",
                }}
              >
                Browse all Finance Tools
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ── Dev Tools cross-link ── */}
          <div
            className="mt-10 rounded-2xl border px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderColor: "rgba(6,182,212,0.18)", background: "rgba(6,182,212,0.03)" }}
          >
            <div>
              <h3 className="font-display font-semibold text-[14px] text-[#0A0A0A] mb-0.5">Developer Tools</h3>
              <p className="text-[13px] text-[rgba(10,10,10,0.48)]">
                JWT decoder, SQL optimizer, Regex tester, Base64, cURL converter — fast utilities for devs.
              </p>
            </div>
            <Link
              href="/tools"
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold transition-colors whitespace-nowrap"
              style={{ borderColor: "rgba(6,182,212,0.22)", background: "rgba(6,182,212,0.07)", color: "#0891B2" }}
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
