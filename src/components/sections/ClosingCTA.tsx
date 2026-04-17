import Link from "next/link";
import Reveal from "@/components/shared/Reveal";

export default function ClosingCTA() {
  return (
    <section className="page-section text-center">
      <div className="page-container">
        <Reveal>
          <div className="max-w-[480px] mx-auto">
            <h2
              className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-8"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Still free.<br />Still yours.
            </h2>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center h-10 px-6 rounded-[6px] bg-[#0A0A0A] text-[#FAFAFA] text-[14px] font-medium tracking-[-0.01em] hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_8px_24px_-6px_rgba(0,0,0,0.18)] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-[#0A0A0A] focus-visible:outline-offset-2"
              style={{ transition: "box-shadow 220ms cubic-bezier(0.4,0,0.2,1), transform 80ms cubic-bezier(0.4,0,0.2,1)" }}
            >
              Open DevForge →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
