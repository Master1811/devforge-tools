"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import AdContainer from "../ads/AdContainer";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Shield } from "lucide-react";
import { useShell } from "@/components/Shell";
import { cn } from "@/lib/utils";

interface FAQ { q: string; a: string; }
interface RelatedTool { name: string; path: string; description: string; }

interface ToolLayoutProps {
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  howToUse: string[];
  whatIs: { title: string; content: string };
  faqs: FAQ[];
  relatedTools: RelatedTool[];
  children: ReactNode;
  jsonLd?: object;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function ToolLayout({ title, slug, description, howToUse, whatIs, faqs, relatedTools, children, jsonLd }: ToolLayoutProps) {
  const shell = useShell();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: `https://devforge.tools/${slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...jsonLd,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://devforge.tools" },
      { "@type": "ListItem", position: 2, name: title, item: `https://devforge.tools/${slug}` },
    ],
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="pt-20 pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Leaderboard ad */}
          <div className="mb-4 relative z-20">
            <AdContainer placement="leaderboard" />
          </div>

          {/* Breadcrumb */}
          <nav className="text-[11px] font-mono text-muted-foreground/60 mb-5">
            <Link href="/" className="hover:text-foreground transition-colors duration-200">Home</Link>
            <span className="mx-2 text-muted-foreground/30">/</span>
            <span className="text-foreground/80">{title}</span>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-6"
          >
            <h1 className="heading-display text-3xl sm:text-4xl mb-2">{title}</h1>
            <p className="text-muted-foreground text-[15px] mb-3 leading-relaxed">{description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs font-mono text-muted-foreground/70">
                <Shield className="w-3 h-3 text-accent" />
                100% client-side · No data leaves your browser
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground/40">
                <kbd className="bg-surface2 border border-border px-1 py-0.5 rounded text-[10px] leading-none">⌘K</kbd>
                <span>search</span>
                <span className="mx-1">·</span>
                <kbd className="bg-surface2 border border-border px-1 py-0.5 rounded text-[10px] leading-none">?</kbd>
                <span>shortcuts</span>
              </div>
            </div>
          </motion.div>

          {/* Tool UI + Sidebar ad */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            className="mt-6 mb-4"
          >
            <div className="rounded-2xl border border-border bg-surface/30 backdrop-blur-sm p-1">
              <div className="flex gap-6">
                <div className="w-full lg:w-[calc(100%-320px)] min-w-0">
                  {children}

                  {/* Success banner ad */}
                  {shell?.showSuccessAd && (
                    <div className="mt-4 relative z-20">
                      <AdContainer placement="success-banner" show={shell.showSuccessAd} />
                    </div>
                  )}

                  <div className="mt-6 relative z-20">
                    <AdContainer placement="in-flow" />
                  </div>
                </div>

                {/* Desktop sidebar ad */}
                <aside className="hidden lg:block w-[300px] flex-shrink-0 relative z-20">
                  <div className="sticky top-20">
                    <AdContainer placement="sidebar" className="!flex" />
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>

          {/* Mobile sidebar ad */}
          <div className="lg:hidden mb-6 relative z-20">
            <AdContainer placement="leaderboard" className="!flex mx-auto" />
          </div>

          {/* SEO Content */}
          <div className="max-w-4xl space-y-12 mt-14">
            <section>
              <h2 className="heading-display text-2xl mb-5">How to Use {title}</h2>
              <ol className="list-decimal list-inside space-y-2.5 text-muted-foreground text-[15px] leading-relaxed">
                {howToUse.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </section>

            <section>
              <h2 className="heading-display text-2xl mb-5">{whatIs.title}</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{whatIs.content}</p>
            </section>

            <section>
              <h2 className="heading-display text-2xl mb-5">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className={cn(
                      "group border border-border rounded-xl bg-surface/60 backdrop-blur-sm",
                      "transition-all duration-200 ease-out-expo",
                      "hover:border-muted-foreground/20"
                    )}
                  >
                    <summary className="px-4 py-3.5 cursor-pointer font-medium text-[15px] hover:text-primary transition-colors duration-200 list-none flex items-center justify-between">
                      {faq.q}
                      <span className="text-muted-foreground/40 group-open:rotate-45 transition-transform duration-200 ease-out-expo text-lg leading-none ml-3">+</span>
                    </summary>
                    <p className="px-4 pb-4 text-muted-foreground text-[14px] leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section>
              <h2 className="heading-display text-2xl mb-5">Related Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedTools.map(t => (
                  <Link
                    key={t.path}
                    href={t.path}
                    className={cn(
                      "group block p-4 border border-border rounded-xl bg-surface/60 backdrop-blur-sm",
                      "transition-all duration-300 ease-out-expo",
                      "hover:border-primary/30 hover:shadow-[var(--shadow-glow)]",
                      "hover:-translate-y-0.5 active:translate-y-0"
                    )}
                  >
                    <h3 className="font-semibold text-[15px] mb-1 group-hover:text-primary transition-colors duration-200">{t.name}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{t.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom banner ad */}
          <div className="mt-14 relative z-20">
            <AdContainer placement="leaderboard" className="hidden md:flex" />
          </div>
        </div>
      </main>

      {/* Mobile sticky anchor ad */}
      <div className="relative z-20">
        <AdContainer placement="mobile-sticky" />
      </div>

      <Footer />
    </>
  );
}
