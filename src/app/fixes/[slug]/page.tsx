import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { fixPages, getFixPage } from "@/lib/content/fixPages";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return fixPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getFixPage(slug);

  if (!page) {
    return { title: "Fix Not Found | DevForge" };
  }

  return {
    title: `${page.query} | DevForge`,
    description: `${page.summary} Follow a quick remediation checklist and use DevForge for an automated fix workflow.`,
    keywords: [page.query, page.toolName, "developer troubleshooting", "sql optimization", "bigquery schema fixes"],
    alternates: {
      canonical: `https://devforge.tools/fixes/${page.slug}`,
    },
    openGraph: {
      title: `${page.query} | DevForge`,
      description: page.summary,
      url: `https://devforge.tools/fixes/${page.slug}`,
    },
  };
}

export default async function FixPage({ params }: Props) {
  const { slug } = await params;
  const page = getFixPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-10 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="space-y-8">
            <header className="space-y-3">
              <p className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
                100% Client-Side: Your Enterprise SQL/Data Never Leaves Your Browser.
              </p>
              <h1 className="heading-display text-3xl sm:text-4xl">{page.title}</h1>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{page.summary}</p>
            </header>

            <section className="rounded-xl border border-border bg-surface/40 p-5">
              <h2 className="heading-display text-2xl mb-3">Why this happens</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{page.whyItHappens}</p>
            </section>

            <section className="rounded-xl border border-border bg-surface/40 p-5">
              <h2 className="heading-display text-2xl mb-3">How to fix it</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-[15px] leading-relaxed">
                {page.quickFix.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="rounded-xl border border-primary/40 bg-primary/10 p-5">
              <h2 className="heading-display text-2xl mb-2">Automate this with DevForge</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed mb-4">
                Instead of repeating manual checks, run this through the DevForge
                {" "}
                {page.toolName}
                {" "}
                to validate and fix faster.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={page.toolPath}
                  className="inline-flex items-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-95 transition-opacity"
                >
                  Open {page.toolName}
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-surface2 transition-colors"
                >
                  Browse All Tools
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
