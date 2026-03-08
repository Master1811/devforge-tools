import { motion } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
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
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0"><ShaderAnimation /></div>
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="heading-display text-5xl sm:text-7xl lg:text-8xl mb-6"
          >
            Every tool a developer{"\n"}needs. <span className="text-primary">Free. Forever.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 font-mono"
          >
            10 tools. No signup. No subscription. Just use it.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto"
          >
            {stats.map(s => (
              <div key={s.label} className="p-3 rounded-lg border border-border bg-surface/50 backdrop-blur">
                <p className="heading-display text-2xl text-primary">{s.value}</p>
                <p className="text-xs font-mono text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-muted-foreground animate-pulse-glow" />
          </div>
        </motion.div>
      </section>

      {/* Container Scroll — Platform Showcase */}
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="heading-display text-3xl sm:text-4xl text-muted-foreground mb-2">
              The Platform
            </h2>
            <p className="heading-display text-4xl sm:text-5xl lg:text-6xl">
              All 10 tools.{" "}
              <span className="text-primary">One place.</span>
            </p>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1400&h=900&fit=crop&q=80"
          alt="DevForge platform preview showing developer tools dashboard"
          className="w-full h-full object-cover object-left-top rounded-lg"
          loading="lazy"
          draggable={false}
        />
      </ContainerScroll>

      {/* Tool Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-display text-3xl sm:text-4xl text-center mb-12"
        >
          Explore the Tools
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tools.map((tool, i) => (
            <ToolCard key={tool.path} {...tool} index={i} />
          ))}
        </div>
      </section>

      {/* Why DevForge */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-surface text-center"
            >
              <f.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
