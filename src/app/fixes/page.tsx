import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { fixPages } from "@/lib/content/fixPages";

export const metadata: Metadata = {
  title: "SQL & BigQuery Fix Guides",
  description:
    "Programmatic troubleshooting pages for common BigQuery, Snowflake, and Databricks errors, each linked to a DevForge automated tool workflow.",
  alternates: {
    canonical: "https://devforge.tools/fixes",
  },
};

export default function FixesIndexPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <p className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-mono text-primary mb-3">
              100% Client-Side: Your Enterprise SQL/Data Never Leaves Your Browser.
            </p>
            <h1 className="heading-display text-3xl sm:text-4xl mb-2">SQL & BigQuery Fix Library</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              Lightweight troubleshooting pages for high-intent queries. Each guide explains the fix, then routes you to a DevForge tool to automate the workflow.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fixPages.map((page) => (
              <Link
                key={page.slug}
                href={`/fixes/${page.slug}`}
                className="rounded-xl border border-border bg-surface/40 p-4 hover:border-primary/30 hover:bg-surface/60 transition-colors"
              >
                <h2 className="font-semibold mb-2">{page.title}</h2>
                <p className="text-sm text-muted-foreground">{page.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
