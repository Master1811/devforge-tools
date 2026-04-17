"use client";

import { Shield, Wifi, Code2, Zap, Lock } from "lucide-react";
import Reveal from "@/components/shared/Reveal";

const features = [
  {
    label: "NO LOGIN",
    heading: "Open and start working immediately",
    desc: "No account creation, no email verification, no onboarding wizard. The tool is the first thing you see.",
    icon: Lock,
    wide: false,
  },
  {
    label: "NO BACKEND",
    heading: "Everything runs in your browser tab",
    desc: "Parsing, formatting, calculating — it all happens locally. There is no server receiving your data.",
    icon: Code2,
    wide: false,
  },
  {
    label: "NO TRACKING",
    heading: "Your data goes nowhere",
    desc: "No analytics on your inputs, no session recording, no third-party scripts watching what you paste in.",
    icon: Shield,
    wide: false,
  },
  {
    label: "NO LIMITS",
    heading: "Paste a 50MB JSON. It'll handle it.",
    desc: "Rate limits, request size caps, daily quotas — these concepts don't exist here. Browser memory is your only limit.",
    icon: Zap,
    wide: true,
  },
  {
    label: "WORKS OFFLINE",
    heading: "No Wi-Fi? Still works.",
    desc: "Once loaded, every tool functions without a network connection. Cached by the service worker automatically.",
    icon: Wifi,
    wide: true,
  },
];

export default function FeatureCards() {
  return (
    <section className="page-section bg-[#F2F2F2]">
      <div className="page-container">
        <Reveal>
          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)] mb-2">Why DevForge</p>
            <h2
              className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              Built like a tool should be.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First 3 in single-wide cards */}
          {features.slice(0, 3).map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.label} delay={i * 0.06}>
                <div className="rounded-[16px] border border-[rgba(0,0,0,0.10)] bg-white p-6 h-full flex flex-col gap-3 group transition-[transform,border-color,box-shadow] duration-[220ms] ease-sharp hover:-translate-y-[1px] hover:border-[rgba(0,0,0,0.18)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_8px_24px_-6px_rgba(0,0,0,0.18)]">
                  <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)]">{f.label}</p>
                  <Icon className="w-5 h-5 text-[rgba(10,10,10,0.55)]" />
                  <h3 className="font-display font-semibold text-[15px] tracking-[-0.01em] text-[#0A0A0A]">{f.heading}</h3>
                  <p className="text-[13px] leading-relaxed text-[rgba(10,10,10,0.55)]">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}

          {/* Last 2 span 1.5 columns each (roughly) — in a 3-col grid, use 1 col each but wider on md */}
          {features.slice(3).map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.label} delay={(i + 3) * 0.06} className="md:col-span-1 lg:col-span-1">
                <div className="rounded-[16px] border border-[rgba(0,0,0,0.10)] bg-white p-6 h-full flex flex-col gap-3 group transition-[transform,border-color,box-shadow] duration-[220ms] ease-sharp hover:-translate-y-[1px] hover:border-[rgba(0,0,0,0.18)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_8px_24px_-6px_rgba(0,0,0,0.18)]">
                  <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)]">{f.label}</p>
                  <Icon className="w-5 h-5 text-[rgba(10,10,10,0.55)]" />
                  <h3 className="font-display font-semibold text-[15px] tracking-[-0.01em] text-[#0A0A0A]">{f.heading}</h3>
                  <p className="text-[13px] leading-relaxed text-[rgba(10,10,10,0.55)]">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
