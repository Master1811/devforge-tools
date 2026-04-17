import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getProblem, PROBLEM_SLUGS, type ProblemPage } from "@/lib/seo/problems";

/* ── SSG: pre-generate all problem pages at build time ────────────────── */
export function generateStaticParams() {
  return PROBLEM_SLUGS.map(slug => ({ slug }));
}

/* ── Per-slug metadata ─────────────────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return { title: "Not Found" };

  const { seo } = problem;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: `https://devforge.tools/problems/${slug}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
      url: `https://devforge.tools/problems/${slug}`,
      siteName: "DevForge",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
    },
  };
}

/* ── Page component ────────────────────────────────────────────────────── */
export default async function ProblemPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const { seo, canonical, intro, sections, conclusion, faqs } = problem;

  /* JSON-LD: Article + FAQ */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo.h1,
    description: seo.description,
    url: `https://devforge.tools/problems/${slug}`,
    publisher: { "@type": "Organization", name: "DevForge", url: "https://devforge.tools" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://devforge.tools" },
      { "@type": "ListItem", position: 2, name: "Problems", item: "https://devforge.tools/problems" },
      { "@type": "ListItem", position: 3, name: seo.h1, item: `https://devforge.tools/problems/${slug}` },
    ],
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="pt-20 bg-[#FAFAFA]">
        {/* ── Hero ── */}
        <div className="border-b border-[rgba(0,0,0,0.08)] bg-white">
          <div className="max-w-[860px] mx-auto px-6 py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(10,10,10,0.40)] mb-8">
              <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/problems" className="hover:text-[#0A0A0A] transition-colors">Problems</Link>
              <span>/</span>
              <span className="text-[rgba(10,10,10,0.65)]">{slug.replace(/-/g, " ")}</span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(0,0,0,0.10)] bg-[rgba(0,0,0,0.03)] text-[11px] font-mono text-[rgba(10,10,10,0.50)] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              Free tool · No signup · Instant results
            </div>

            {/* H1 */}
            <h1 className="font-display font-bold tracking-[-0.03em] text-[#0A0A0A] leading-[1.07] mb-5"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}>
              {seo.h1}
            </h1>

            <p className="text-[16px] text-[rgba(10,10,10,0.58)] leading-[1.70] mb-8 max-w-[640px]">
              {seo.description}
            </p>

            {/* Primary CTA */}
            <Link
              href={canonical.path}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-lg bg-[#0A0A0A] text-[#FAFAFA] text-[15px] font-semibold
                         transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                         hover:bg-black hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)]
                         active:scale-[0.97]"
            >
              {canonical.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Article ── */}
        <article className="max-w-[860px] mx-auto px-6 py-14">

          {/* Intro */}
          <div className="mb-10">
            {intro.split("\n\n").map((para, i) => (
              <p key={i} className="text-[16px] text-[rgba(10,10,10,0.72)] leading-[1.80] mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display font-bold text-[22px] text-[#0A0A0A] tracking-[-0.02em] mb-4">
                  {section.heading}
                </h2>
                {section.body.split("\n\n").map((para, j) => (
                  <p key={j} className="text-[15px] text-[rgba(10,10,10,0.68)] leading-[1.80] mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-10 pt-10 border-t border-[rgba(0,0,0,0.08)]">
            <p className="text-[16px] text-[rgba(10,10,10,0.72)] leading-[1.80]">
              {conclusion}
            </p>
          </div>

          {/* Inline CTA */}
          <div className="mt-10 p-7 rounded-2xl bg-[#0A0A0A] text-center">
            <p className="font-display font-bold text-[18px] text-[#FAFAFA] tracking-[-0.02em] mb-2">
              {canonical.name} — Free, instant, no signup
            </p>
            <p className="text-[14px] text-[rgba(250,250,250,0.60)] mb-5">
              100% client-side. Your data never leaves your browser.
            </p>
            <Link
              href={canonical.path}
              className="inline-flex items-center gap-2 h-11 px-7 rounded-lg bg-white text-[#0A0A0A] text-[14px] font-semibold
                         transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                         hover:bg-[#F4F4F4] hover:shadow-[0_4px_20px_rgba(255,255,255,0.20)]
                         active:scale-[0.97]"
            >
              {canonical.cta}
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>

        {/* ── FAQs ── */}
        <section className="max-w-[860px] mx-auto px-6 pb-14">
          <h2 className="font-display font-bold text-[22px] text-[#0A0A0A] tracking-[-0.02em] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-[rgba(0,0,0,0.10)] rounded-xl bg-white overflow-hidden transition-all duration-200 hover:border-[rgba(0,0,0,0.18)]"
              >
                <summary className="px-5 py-4 cursor-pointer font-display font-medium text-[15px] text-[#0A0A0A] hover:text-[rgba(10,10,10,0.80)] transition-colors duration-200 list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-[rgba(10,10,10,0.35)] group-open:rotate-45 transition-transform duration-200 text-lg leading-none ml-3 flex-shrink-0">+</span>
                </summary>
                <p className="px-5 pb-5 text-[14px] text-[rgba(10,10,10,0.60)] leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Back link ── */}
        <div className="max-w-[860px] mx-auto px-6 pb-14">
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 text-[13px] font-mono text-[rgba(10,10,10,0.45)] hover:text-[#0A0A0A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All problem solutions
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
