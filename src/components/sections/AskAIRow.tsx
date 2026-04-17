import Reveal from "@/components/shared/Reveal";

const AI_LINKS = [
  {
    name: "ChatGPT",
    slug: "chatgpt",
    url: "https://chatgpt.com/?q=How+does+DevForge+compare+to+JSONLint+for+JSON+formatting%3F+What+are+the+tradeoffs%3F",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.843-3.372L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"/>
      </svg>
    ),
  },
  {
    name: "Claude",
    slug: "claude",
    url: "https://claude.ai/new?q=How+does+DevForge+compare+to+Causal+for+startup+finance+modeling%3F+What+are+the+tradeoffs%3F",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M17.304 3H6.696L2 12l4.696 9h10.608L24 12 17.304 3zm-2.168 12.656l-3.138-5.668-3.138 5.668H6.696L12 7.344l5.304 8.312h-2.168z"/>
      </svg>
    ),
  },
  {
    name: "Gemini",
    slug: "gemini",
    url: "https://gemini.google.com/app?q=How+does+DevForge+compare+to+SQLFiddle+for+SQL+testing%3F+What+are+the+tradeoffs%3F",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12"/>
      </svg>
    ),
  },
  {
    name: "Grok",
    slug: "grok",
    url: "https://grok.com/?q=How+does+DevForge+compare+to+RegExr+for+regex+testing%3F+What+are+the+tradeoffs%3F",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "Perplexity",
    slug: "perplexity",
    url: "https://www.perplexity.ai/search?q=What+are+the+best+free+developer+tools+online%3F+How+does+DevForge+compare+to+alternatives%3F",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M22.3669 8.55811H16.363V3.00013L7.52197 11.4421H1.63306L1.63306 12.5581H7.04811L1.63306 17.6761V21.0001H2.74907V18.1921L8.63499 12.5581H11.4421V21.0001H12.5581V12.5581H15.3671L21.2521 18.1921V21.0001H22.3681V17.6761L16.9531 12.5581H22.3681L22.3669 8.55811ZM15.2521 11.4421H12.5571V3.92713L15.2521 6.50413V11.4421ZM8.74811 11.4421V6.50413L11.4431 3.92713V11.4421H8.74811ZM3.86506 17.0951L8.63499 12.5581H11.4421V18.7931L3.86506 17.0951ZM12.5581 18.7931V12.5581H15.3671L20.135 17.0951L12.5581 18.7931ZM15.2521 11.4421V8.55811H21.2519L15.2521 11.4421ZM2.74807 8.55811H8.74811V11.4421L2.74807 8.55811Z"/>
      </svg>
    ),
  },
];

export default function AskAIRow() {
  return (
    <section className="page-section">
      <div className="page-container">
        <Reveal>
          <div className="text-center mb-8">
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)] mb-2">
              Ask AI
            </p>
            <h2
              className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-3"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
            >
              Ask your preferred AI about DevForge.
            </h2>
            <p className="text-[14px] text-[rgba(10,10,10,0.50)] max-w-[400px] mx-auto">
              We pre-filled the questions. Just click.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {AI_LINKS.map(ai => (
              <a
                key={ai.slug}
                href={ai.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask ${ai.name} about DevForge`}
                className="inline-flex items-center gap-2.5 h-10 px-4 rounded-[6px] border border-[rgba(0,0,0,0.10)] bg-white text-[13px] font-medium text-[rgba(10,10,10,0.70)] hover:border-[rgba(0,0,0,0.18)] hover:text-[#0A0A0A] hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_4px_12px_-3px_rgba(0,0,0,0.12)] hover:-translate-y-[1px] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-[#0A0A0A] focus-visible:outline-offset-2"
                style={{ transition: "border-color 220ms cubic-bezier(0.4,0,0.2,1), box-shadow 220ms cubic-bezier(0.4,0,0.2,1), transform 80ms cubic-bezier(0.4,0,0.2,1), color 220ms cubic-bezier(0.4,0,0.2,1)" }}
              >
                {ai.logo}
                {ai.name}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
