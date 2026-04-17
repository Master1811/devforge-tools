"use client";

import Link from "next/link";
import { Github, Twitter, ArrowUpRight } from "lucide-react";

const devTools = [
  { name: "JWT Decoder",         path: "/jwt-decoder" },
  { name: "JSON → TypeScript",   path: "/json-to-typescript" },
  { name: "SQL Formatter",       path: "/sql-formatter" },
  { name: "Cron Visualizer",     path: "/cron-visualizer" },
  { name: "RegEx Tester",        path: "/regex-tester" },
  { name: "Base64 Encoder",      path: "/base64-encoder" },
  { name: "cURL Converter",      path: "/curl-converter" },
  { name: "YAML ↔ JSON",         path: "/yaml-json-converter" },
  { name: "Markdown Previewer",  path: "/markdown-previewer" },
  { name: "Password Generator",  path: "/password-generator" },
];

const financeTools = [
  { name: "ARR / MRR Calculator",      path: "/tools/finance/arr-calculator" },
  { name: "Runway Calculator",          path: "/tools/finance/runway-calculator" },
  { name: "Burn Rate Calculator",       path: "/tools/finance/burn-rate-calculator" },
  { name: "Growth Rate Calculator",     path: "/tools/finance/growth-rate-calculator" },
  { name: "₹100Cr Journey Calculator",  path: "/tools/finance/100cr-calculator" },
];

const resources = [
  { name: "All Tools",   path: "/tools" },
  { name: "Docs",        path: "/docs" },
  { name: "Examples",    path: "/examples" },
  { name: "Changelog",   path: "/fixes" },
];

const legal = [
  { name: "Privacy Policy", path: "#" },
  { name: "Terms of Use",   path: "#" },
  { name: "Open Source",    path: "https://github.com", external: true },
];

function FooterLink({ name, path, external }: { name: string; path: string; external?: boolean }) {
  const cls = "group inline-flex items-center gap-1 text-[13px] text-[rgba(10,10,10,0.48)] hover:text-[#0A0A0A] transition-colors duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] relative";
  const inner = (
    <>
      <span className="relative">
        {name}
        <span className="absolute -bottom-px left-0 h-px w-0 bg-[rgba(0,0,0,0.50)] group-hover:w-full transition-[width] duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </span>
      {external && <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />}
    </>
  );
  if (external) return <a href={path} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  return <Link href={path} className={cls}>{inner}</Link>;
}

function FooterColumn({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-mono tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)] mb-4">
        {heading}
      </h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-t border-[rgba(0,0,0,0.08)]">
      <div className="max-w-[1200px] mx-auto px-6 py-14">

        {/* ── 4-column grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-12">

          {/* Brand + tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-[16px] font-semibold text-[#0A0A0A] tracking-[-0.02em] block mb-3">
              DevForge
            </Link>
            <p className="text-[13px] text-[rgba(10,10,10,0.45)] leading-relaxed max-w-[200px]">
              Developer tools that run entirely in your browser. Free forever. No signup.
            </p>
          </div>

          {/* Dev Tools */}
          <FooterColumn heading="Dev Tools">
            {devTools.map(t => (
              <li key={t.path}><FooterLink {...t} /></li>
            ))}
          </FooterColumn>

          {/* Finance + Resources */}
          <div className="space-y-8">
            <FooterColumn heading="Finance Tools">
              {financeTools.map(t => (
                <li key={t.path}><FooterLink {...t} /></li>
              ))}
            </FooterColumn>
            <FooterColumn heading="Resources">
              {resources.map(t => (
                <li key={t.path}><FooterLink {...t} /></li>
              ))}
            </FooterColumn>
          </div>

          {/* Legal */}
          <FooterColumn heading="Legal">
            {legal.map(t => (
              <li key={t.name}><FooterLink {...t} /></li>
            ))}
          </FooterColumn>
        </div>

        {/* ── Bottom strip ── */}
        <div className="h-px bg-[rgba(0,0,0,0.08)] mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-[rgba(10,10,10,0.30)]">
            © 2026 DevForge. All tools run client-side — your data never leaves your machine.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(10,10,10,0.30)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              All systems operational
            </div>
            <div className="h-3 w-px bg-[rgba(0,0,0,0.12)]" />
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-[rgba(10,10,10,0.35)] hover:text-[#0A0A0A] transition-colors duration-[160ms]"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-[rgba(10,10,10,0.35)] hover:text-[#0A0A0A] transition-colors duration-[160ms]"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
