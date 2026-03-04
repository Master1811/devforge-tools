import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import AdSlot from "./AdSlot";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Shield } from "lucide-react";

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

export default function ToolLayout({ title, slug, description, howToUse, whatIs, faqs, relatedTools, children, jsonLd }: ToolLayoutProps) {
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
          {/* Breadcrumb */}
          <nav className="text-xs font-mono text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title}</span>
          </nav>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="heading-display text-3xl sm:text-4xl mb-2">{title}</h1>
            <p className="text-muted-foreground mb-3">{description}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-muted-foreground">
              <Shield className="w-3 h-3 text-accent" />
              100% client-side • No data leaves your browser
            </div>
          </motion.div>

          <AdSlot size="leaderboard" position="top" />

          {/* Tool UI */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 mb-12">
            {children}
          </motion.div>

          {/* SEO Content */}
          <div className="max-w-4xl space-y-10 mt-12">
            <section>
              <h2 className="heading-display text-2xl mb-4">How to Use {title}</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                {howToUse.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </section>

            <section>
              <h2 className="heading-display text-2xl mb-4">{whatIs.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{whatIs.content}</p>
            </section>

            <section>
              <h2 className="heading-display text-2xl mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="group border border-border rounded-lg bg-surface">
                    <summary className="px-4 py-3 cursor-pointer font-medium hover:text-primary transition-colors">{faq.q}</summary>
                    <p className="px-4 pb-4 text-muted-foreground text-sm">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section>
              <h2 className="heading-display text-2xl mb-4">Related Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map(t => (
                  <Link key={t.path} to={t.path} className="block p-4 border border-border rounded-lg bg-surface hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold mb-1">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12">
            <AdSlot size="banner" position="bottom" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
