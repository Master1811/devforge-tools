import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ArrowLeft, Globe2 } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";

export default function OGPreviewPage() {
  return (
    <>
      <Navbar />

      <main className="relative pt-24 pb-20 min-h-screen overflow-hidden">
        <BackgroundPaths fadeBottom={false} />

        <div className="relative z-[1] max-w-2xl mx-auto px-6 text-center">
          <nav className="text-[11px] font-mono text-[rgba(10,10,10,0.40)] mb-10 flex items-center justify-center gap-2">
            <Link href="/tools/interactive" className="hover:text-[#0A0A0A] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Interactive
            </Link>
            <span className="text-[rgba(10,10,10,0.20)]">/</span>
            <span className="text-[rgba(10,10,10,0.65)]">Open Graph Preview</span>
          </nav>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border mx-auto mb-6"
            style={{ background: "rgba(139,92,246,0.10)", borderColor: "rgba(139,92,246,0.18)" }}
          >
            <Globe2 className="w-6 h-6 text-violet-600" />
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono mb-4"
            style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.08)", color: "#7C3AED" }}
          >
            Coming soon
          </div>

          <h1 className="font-display font-bold text-[28px] text-[#0A0A0A] tracking-[-0.03em] mb-3">
            Open Graph Preview
          </h1>
          <p className="text-[15px] text-[rgba(10,10,10,0.55)] leading-relaxed mb-8">
            Preview how your URLs appear on Twitter, LinkedIn, and Slack. Edit OG tags and see
            live card renders across all platforms side-by-side before you ship.
          </p>

          <Link
            href="/tools/interactive"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[13px] font-semibold transition-colors"
            style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.08)", color: "#7C3AED" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Interactive Tools
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
