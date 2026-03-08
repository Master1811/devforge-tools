import { motion } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import ToolCard from "@/components/shared/ToolCard";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { KeyRound, Braces, Database, Clock, Regex, Binary, Terminal, FileJson, FileText, Lock, Zap, Globe, Shield } from "lucide-react";

const tools = [
  { name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens instantly", path: "/jwt-decoder", icon: KeyRound, tag: "auth" },
  { name: "JSON to TypeScript", description: "Generate TypeScript interfaces from JSON", path: "/json-to-typescript", icon: Braces, tag: "types" },
  { name: "SQL Formatter", description: "Beautify and format SQL queries", path: "/sql-formatter", icon: Database, tag: "database" },
  { name: "Cron Visualizer", description: "Human-readable cron expressions", path: "/cron-visualizer", icon: Clock, tag: "scheduling" },
  { name: "RegEx Tester", description: "Test regular expressions in real-time", path: "/regex-tester", icon: Regex, tag: "patterns" },
  { name: "Base64 Encoder", description: "Encode and decode Base64 strings and files", path: "/base64-encoder", icon: Binary, tag: "encoding" },
  { name: "cURL Converter", description: "Convert curl commands to any language", path: "/curl-converter", icon: Terminal, tag: "api" },
  { name: "YAML ↔ JSON", description: "Convert between YAML and JSON formats", path: "/yaml-json-converter", icon: FileJson, tag: "config" },
  { name: "Markdown Previewer", description: "Live markdown editor with instant preview", path: "/markdown-previewer", icon: FileText, tag: "docs" },
  { name: "Password Generator", description: "Cryptographically secure password generation", path: "/password-generator", icon: Lock, tag: "security" },
];

const stats = [
  { value: "10", label: "Tools" },
  { value: "100%", label: "Free" },
  { value: "No", label: "Signup" },
  { value: "$0", label: "Infrastructure" },
];

const features = [
  { icon: Shield, title: "No Login Required", description: "Use every tool instantly. No accounts, no emails, no friction." },
  { icon: Globe, title: "Runs in Your Browser", description: "All processing happens locally. Your data never leaves your machine." },
  { icon: Zap, title: "Built for Speed", description: "Zero server calls. Sub-millisecond processing. No loading spinners." },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Index() {
  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0"><ShaderAnimation /></div>
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs font-mono text-muted-foreground mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Open source · Client-side · Zero tracking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease }}
            className="heading-display text-4xl sm:text-6xl lg:text-7xl mb-5"
          >
            Every tool a developer needs.{" "}
            <span className="text-primary">Free. Forever.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
            className="text-base sm:text-lg text-muted-foreground mb-8 font-mono max-w-xl mx-auto leading-relaxed"
          >
            10 tools. No signup. No subscription. Just use it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <InteractiveHoverButton
              text="Explore Tools"
              onClick={scrollToTools}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease }}
            className="grid grid-cols-4 gap-2 max-w-sm mx-auto mt-10"
          >
            {stats.map(s => (
              <div key={s.label} className="p-2.5 rounded-lg border border-border bg-surface/30 backdrop-blur-sm">
                <p className="heading-display text-lg sm:text-xl text-primary tabular-nums">{s.value}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/30"
        >
          <div className="w-5 h-8 rounded-full border-2 border-current flex justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-current" />
          </div>
        </motion.div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-14"
        >
          <h2 className="heading-display text-3xl sm:text-4xl mb-3">
            All 10 tools. <span className="text-primary">One place.</span>
          </h2>
          <p className="text-[13px] text-muted-foreground font-mono max-w-md mx-auto">
            Click any tool to start — everything runs locally in your browser.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {tools.map((tool, i) => (
            <ToolCard key={tool.path} {...tool} index={i} />
          ))}
        </div>
      </section>

      {/* Why DevForge */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="heading-display text-2xl sm:text-3xl text-center mb-12"
        >
          Why DevForge?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4, ease }}
              className="group p-6 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-center transition-all duration-300 ease-out-expo hover:border-primary/20 hover:shadow-[var(--shadow-sm)]"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-colors duration-300 group-hover:bg-primary/15">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-[15px] mb-1.5 tracking-tight">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
