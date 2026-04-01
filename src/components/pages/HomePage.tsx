"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import ToolCard from "@/components/shared/ToolCard";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Zap, Globe, Shield } from "lucide-react";
import { TOOLS } from "@/lib/tools/registry";

const stats = [
  { value: String(TOOLS.length), label: "Tools" },
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

export default function HomePage() {
  const [shimmerReady, setShimmerReady] = useState(false);
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.01 }}
            className="heading-display text-4xl sm:text-6xl lg:text-7xl mb-5 overflow-hidden"
          >
            {"Every tool a developer needs.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0, rotateX: 40 }}
                animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                transition={{
                  delay: 0.15 + i * 0.07,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.28em]"
                style={{ perspective: 400 }}
              >
                {word}
              </motion.span>
            ))}
            <br className="hidden sm:block" />
            <span className={shimmerReady ? "text-shimmer inline" : "text-primary inline"}>
              {"Free. Forever.".split(" ").map((word, i) => (
                <motion.span
                  key={`accent-${i}`}
                  initial={{ y: "110%", opacity: 0, rotateX: 40 }}
                  animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                  transition={{
                    delay: 0.15 + 5 * 0.07 + i * 0.09,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onAnimationComplete={i === 1 ? () => setShimmerReady(true) : undefined}
                  className="inline-block mr-[0.28em]"
                  style={{
                    perspective: 400,
                    filter: "drop-shadow(0 0 40px hsl(var(--primary) / 0.25))",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
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
          {TOOLS.map((tool, i) => (
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

