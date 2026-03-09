import Link from "next/link";

const tools = [
  { name: "JWT Decoder", path: "/jwt-decoder" },
  { name: "JSON to TypeScript", path: "/json-to-typescript" },
  { name: "SQL Formatter", path: "/sql-formatter" },
  { name: "Cron Visualizer", path: "/cron-visualizer" },
  { name: "RegEx Tester", path: "/regex-tester" },
  { name: "Base64 Encoder", path: "/base64-encoder" },
  { name: "cURL Converter", path: "/curl-converter" },
  { name: "YAML ↔ JSON", path: "/yaml-json-converter" },
  { name: "Markdown Previewer", path: "/markdown-previewer" },
  { name: "Password Generator", path: "/password-generator" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-sm py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {tools.map(t => (
            <Link
              key={t.path}
              href={t.path}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 py-0.5"
            >
              {t.name}
            </Link>
          ))}
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="heading-display text-base">
            Dev<span className="text-primary">Forge</span>
          </span>
          <p className="text-[11px] text-muted-foreground/60 font-mono tracking-wide">
            Built for developers · Free forever · No tracking
          </p>
        </div>
      </div>
    </footer>
  );
}
