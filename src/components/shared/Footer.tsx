import { Link } from "react-router-dom";

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
    <footer className="border-t border-border bg-surface py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {tools.map(t => (
            <Link key={t.path} to={t.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t.name}
            </Link>
          ))}
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="heading-display text-lg">Dev<span className="text-primary">Forge</span></span>
          <p className="text-xs text-muted-foreground font-mono">Built for developers. Free forever. No tracking.</p>
        </div>
      </div>
    </footer>
  );
}
