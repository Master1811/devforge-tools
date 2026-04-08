"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import ToolCard from "@/components/shared/ToolCard";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Zap, Globe, Shield } from "lucide-react";
import { TOOLS } from "@/lib/tools/registry";
import ParallaxLayer from "@/components/shared/ParallaxLayer";
import Reveal from "@/components/shared/Reveal";
import { motionEase } from "@/lib/motion";

/* ─── constants ─── */
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

/* ─── Loader ─── */
function SiteLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 1400;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 220);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Rotating ring */}
      <div className="relative w-20 h-20 mb-8">
        <motion.div
          className="absolute inset-0 rounded-full border-[1.5px] border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-t-[1.5px] border-primary"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        <div className="absolute inset-[6px] rounded-full border border-border flex items-center justify-center">
          <span className="font-mono text-[10px] text-primary tabular-nums">
            {progress}%
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="w-40 h-px bg-border relative overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/50 mt-4 tracking-widest uppercase">
        Dev<span className="text-primary">Forge</span>
      </p>
    </motion.div>
  );
}

/* ─── Magnetic wrapper ─── */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 22 });
  const y = useSpring(0, { stiffness: 180, damping: 22 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.28);
    y.set((e.clientY - cy) * 0.28);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}

/* ─── 3D stat card ─── */
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotY.set(((e.clientX - cx) / rect.width) * 18);
    rotX.set(-((e.clientY - cy) / rect.height) * 18);
  };

  const reset = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: "preserve-3d",
        perspective: 600,
      }}
      className="p-2.5 rounded-lg border border-border bg-surface/30 backdrop-blur-sm cursor-default select-none
                 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.12)] transition-[border-color,box-shadow] duration-300"
    >
      <p className="heading-display text-lg sm:text-xl text-primary tabular-nums" style={{ transform: "translateZ(12px)" }}>
        {value}
      </p>
      <p className="text-[10px] font-mono text-muted-foreground/60" style={{ transform: "translateZ(6px)" }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Feature card ─── */
function FeatureCard({ icon: Icon, title, description, index }: { icon: typeof Shield; title: string; description: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Spring motion values for 3D tilt (kept separate from whileInView entrance)
  const rotX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotY = useSpring(0, { stiffness: 180, damping: 22 });

  // Spotlight position (hoisted — hooks must not be called inside JSX)
  const gX = useMotionValue(50);
  const gY = useMotionValue(50);
  const spotlightBg = useTransform(
    [gX, gY],
    ([x, y]: number[]) =>
      `radial-gradient(160px circle at ${x}% ${y}%, hsl(var(--primary)/0.1), transparent 70%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    rotY.set((nx - 0.5) * 16);
    rotX.set(-(ny - 0.5) * 16);
    gX.set(nx * 100);
    gY.set(ny * 100);
  };

  const reset = () => {
    rotX.set(0); rotY.set(0);
    gX.set(50); gY.set(50);
  };

  return (
    // Outer div: handles whileInView entrance only (no rotateX/Y here)
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Inner div: handles 3D tilt via spring motion values */}
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 800 }}
        className="group relative p-6 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-center
                   hover:border-primary/25 transition-[border-color] duration-300 overflow-hidden cursor-default"
      >
        {/* Spotlight glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        <div
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4
                     group-hover:bg-primary/18 group-hover:scale-110 transition-all duration-300"
          style={{ transform: "translateZ(14px)" }}
        >
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display font-bold text-[15px] mb-1.5 tracking-tight" style={{ transform: "translateZ(10px)" }}>
          {title}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed" style={{ transform: "translateZ(6px)" }}>
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main page ─── */
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [shimmerReady, setShimmerReady] = useState(false);
  const reducedMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], reducedMotion ? ["0%", "0%"] : ["0%", "28%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], reducedMotion ? [1, 1] : [1, 0]);
  const heroGridY = useTransform(heroScroll, [0, 1], reducedMotion ? ["0%", "0%"] : ["0%", "14%"]);

  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {!loaded && <SiteLoader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      >
        {/* Parallax shader bg */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <ShaderAnimation />
        </motion.div>
        <div className="absolute inset-0 bg-background/70" />

        {/* Floating grid lines (parallax decorative) */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ y: heroGridY }}
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={loaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border
                       bg-surface/50 backdrop-blur-sm text-xs font-mono text-muted-foreground mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Open source · Client-side · Zero tracking
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 0.05, duration: 0.01 }}
            className="heading-display text-4xl sm:text-6xl lg:text-7xl mb-5 overflow-hidden"
          >
            {"Every tool a developer needs.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0, rotateX: 50 }}
                animate={loaded ? { y: "0%", opacity: 1, rotateX: 0 } : {}}
                transition={{
                  delay: 0.12 + i * 0.07,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.28em]"
                style={{ perspective: 500, transformOrigin: "50% 100%" }}
              >
                {word}
              </motion.span>
            ))}
            <br className="hidden sm:block" />
            <span className={shimmerReady ? "text-shimmer inline" : "text-primary inline"}>
              {"Free. Forever.".split(" ").map((word, i) => (
                <motion.span
                  key={`accent-${i}`}
                  initial={{ y: "110%", opacity: 0, rotateX: 50 }}
                  animate={loaded ? { y: "0%", opacity: 1, rotateX: 0 } : {}}
                  transition={{
                    delay: 0.12 + 5 * 0.07 + i * 0.1,
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onAnimationComplete={i === 1 ? () => setShimmerReady(true) : undefined}
                  className="inline-block mr-[0.28em]"
                  style={{
                    perspective: 500,
                    transformOrigin: "50% 100%",
                    filter: "drop-shadow(0 0 40px hsl(var(--primary) / 0.3))",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.6, ease: motionEase }}
            className="text-base sm:text-lg text-muted-foreground mb-8 font-mono max-w-xl mx-auto leading-relaxed"
          >
            {TOOLS.length} tools. No signup. No subscription. Just use it.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={loaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.65, duration: 0.6, ease: motionEase }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Magnetic>
              <InteractiveHoverButton text="Explore Tools" onClick={scrollToTools} />
            </Magnetic>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mt-10">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={loaded ? 0.7 + i * 0.07 : 999} />
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/30"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <div className="w-5 h-8 rounded-full border-2 border-current flex justify-center pt-1.5">
              <motion.div
                className="w-1 h-1.5 rounded-full bg-current"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Tool Grid ── */}
      <section id="tools" className="page-section page-container">
        <ParallaxLayer offset={30}>
          <Reveal className="text-center mb-14">
            <h2 className="heading-display text-3xl sm:text-4xl mb-3">
              All {TOOLS.length} tools.{" "}
              <motion.span
                className="text-primary inline-block"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5, ease: motionEase }}
              >
                One place.
              </motion.span>
            </h2>
            <p className="text-[13px] text-muted-foreground font-mono max-w-md mx-auto">
              Click any tool to start — everything runs locally in your browser.
            </p>
          </Reveal>
        </ParallaxLayer>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.path} {...tool} index={i} />
          ))}
        </div>
      </section>

      {/* ── Why DevForge ── */}
      <section className="page-section page-container max-w-4xl">
        <ParallaxLayer offset={20}>
          <Reveal>
            <h2 className="heading-display text-2xl sm:text-3xl text-center mb-12">
            Why DevForge?
            </h2>
          </Reveal>
        </ParallaxLayer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
