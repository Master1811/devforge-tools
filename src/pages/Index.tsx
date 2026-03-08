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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs font-mono text-muted-foreground mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Open source · Client-side · Zero tracking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="heading-display text-4xl sm:text-6xl lg:text-7xl mb-5 leading-[1.05]"
          >
            Every tool a developer needs.{" "}
            <span className="text-primary">Free. Forever.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-base sm:text-lg text-muted-foreground mb-8 font-mono max-w-xl mx-auto"
          >
            10 tools. No signup. No subscription. Just use it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={scrollToTools}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Explore Tools
              <ArrowDown className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="grid grid-cols-4 gap-2 max-w-sm mx-auto mt-10"
          >
            {stats.map(s => (
              <div key={s.label} className="p-2.5 rounded-lg border border-border bg-surface/40 backdrop-blur">
                <p className="heading-display text-lg sm:text-xl text-primary">{s.value}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/40"
        >
          <div className="w-5 h-8 rounded-full border-2 border-current flex justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-current" />
          </div>
        </motion.div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-3xl sm:text-4xl mb-3">
            All 10 tools. <span className="text-primary">One place.</span>
          </h2>
          <p className="text-sm text-muted-foreground font-mono max-w-md mx-auto">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-display text-2xl sm:text-3xl text-center mb-10"
        >
          Why DevForge?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl border border-border bg-surface text-center"
            >
              <f.icon className="w-7 h-7 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-base mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
