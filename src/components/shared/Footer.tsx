import Link from "next/link";
import { motion } from "framer-motion";

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

const ease = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-sm py-12 mt-20 relative overflow-hidden">
      {/* Subtle background gradient accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 
                      bg-primary/4 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Tool links — staggered reveal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1.5 mb-10">
          {tools.map((t, i) => (
            <motion.div
              key={t.path}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.04, duration: 0.45, ease }}
            >
              <Link
                href={t.path}
                className="group relative text-[13px] text-muted-foreground hover:text-foreground
                           transition-colors duration-200 py-0.5 inline-flex items-center gap-1.5"
              >
                {/* Animated underline */}
                <span className="relative">
                  {t.name}
                  <span className="absolute -bottom-px left-0 h-px w-0 bg-primary/50 
                                   group-hover:w-full transition-[width] duration-300 ease-out" />
                </span>
                {/* Arrow micro-interaction */}
                <motion.span
                  className="text-primary/0 group-hover:text-primary/60 text-[10px] 
                             transition-[color,transform] duration-200 -translate-x-1 group-hover:translate-x-0"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Wordmark */}
          <motion.span
            className="heading-display text-base select-none"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            Dev<span className="text-primary">Forge</span>
          </motion.span>

          {/* Tagline with staggered character glow on hover */}
          <p className="text-[11px] text-muted-foreground/50 font-mono tracking-wide">
            Built for developers · Free forever · No tracking
          </p>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            All systems operational
          </div>
        </motion.div>
      </div>
    </footer>
  );
}