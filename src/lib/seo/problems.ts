export interface ProblemSection {
  heading: string;
  body: string; // multi-paragraph — split on \n\n for rendering
}

export interface ProblemFaq {
  q: string;
  a: string;
}

export interface ProblemPage {
  slug: string;
  canonical: {
    name: string;
    path: string;
    cta: string;
  };
  seo: {
    title: string;
    h1: string;
    description: string;
    keywords: string[];
  };
  intro: string;
  sections: ProblemSection[];
  conclusion: string;
  faqs: ProblemFaq[];
}

/* ── Data ──────────────────────────────────────────────────────────────── */
export const PROBLEMS: ProblemPage[] = [

  /* ─── Finance ─────────────────────────────────────────────── */

  {
    slug: "startup-runway-calculator",
    canonical: { name: "Runway Calculator", path: "/tools/finance/runway-calculator", cta: "Calculate Your Runway Free →" },
    seo: {
      title: "Startup Runway Calculator — How Long Will Your Money Last?",
      h1: "Startup Runway Calculator: Know Exactly How Long Your Money Lasts",
      description: "Free startup runway calculator. Enter your cash balance and monthly burn rate to see your exact runway, break-even month, and whether you're default alive.",
      keywords: ["startup runway calculator", "how long will my money last startup", "cash runway calculator", "startup survival calculator"],
    },
    intro: `Runway is the single most important number a startup founder needs to know. It tells you exactly how many months you have before your bank account hits zero — assuming no new revenue and no changes to spending. Understanding your runway isn't pessimism; it's the foundation of every strategic decision you make.\n\nMost founders underestimate burn because they focus on the headline expense — usually salaries — and forget the long tail of SaaS subscriptions, cloud costs, contractor invoices, and office overhead. A runway calculator forces you to be honest about what you actually spend every month.`,
    sections: [
      {
        heading: "How to Calculate Startup Runway",
        body: `The formula is simple: Runway (months) = Current Cash Balance ÷ Monthly Net Burn Rate. Net burn is gross expenses minus revenue. If you have ₹50 lakh in the bank and spend ₹5 lakh more per month than you earn, you have 10 months of runway.\n\nGross burn is your total monthly spend. Net burn subtracts your current MRR. As you grow, your net burn shrinks even if gross burn stays flat — this is the healthy trajectory every investor wants to see. The distinction between gross and net burn matters most in your Series A conversations.`,
      },
      {
        heading: "What Is a Good Startup Runway?",
        body: `The industry standard is 18–24 months. Anything below 12 months puts you in constant fundraising mode, leaving you no time to actually build the company. The best founders raise when they don't need to — closing a round with 18+ months of runway, then using that runway to hit the milestones that justify the next round at a higher valuation.\n\nPost-2022, the fundraising environment tightened significantly. What took 3 months in 2021 often takes 9–12 months today. This means your minimum safe runway is higher — plan for 6–9 months of active fundraising on top of the time you need to run the business. If your runway is under 12 months, you're already too late to start.`,
      },
      {
        heading: "Default Alive vs Default Dead",
        body: `Paul Graham's "Default Alive or Default Dead" framework is the most important mental model for runway management. Default alive means: if you keep growing at your current rate and spending at your current rate, will you reach profitability before you run out of money? Default dead means the opposite.\n\nMost early-stage startups are default dead — they need either more revenue growth or an external capital injection to survive. Knowing which camp you're in determines your entire strategic posture. Default dead startups must fundraise or cut costs. Default alive startups have the luxury of being selective about investors and terms.`,
      },
      {
        heading: "How to Extend Your Runway",
        body: `The three levers are: raise revenue, cut costs, and raise capital. In that order of preference. Revenue is the most durable solution — every rupee of new MRR permanently extends your runway. Cost cuts are powerful but have a floor; you can't cut your way to a great company.\n\nThe tactical moves: renegotiate annual SaaS contracts (most vendors offer 20–30% discounts for annual prepay), convert monthly contractors to equity-heavy full-time roles, and audit your cloud spend (most startups overprovision by 2–3×). A focused 30-day cost audit often finds 10–15% of spend that can be eliminated with zero impact on growth.`,
      },
    ],
    conclusion: `Runway isn't just a financial metric — it's your strategic time budget. Every feature you build, every hire you make, every partnership you pursue should be evaluated against the question: "Does this use my runway efficiently?" Use the calculator below to get your exact numbers, then build a plan around them.`,
    faqs: [
      { q: "What is a startup runway?", a: "Runway is the number of months a startup can operate before running out of cash, calculated by dividing current cash by monthly net burn rate." },
      { q: "What's the difference between gross burn and net burn?", a: "Gross burn is your total monthly expenses. Net burn subtracts monthly revenue. Net burn is what actually depletes your cash balance." },
      { q: "How much runway should I have before fundraising?", a: "Start fundraising when you have 9–12 months of runway remaining. The process typically takes 3–6 months, and you want to close with at least 6 months of buffer post-closing." },
      { q: "What does 'default alive' mean?", a: "A startup is 'default alive' if it will reach profitability before running out of money at its current growth and burn rates. 'Default dead' means it needs external capital or major changes to survive." },
    ],
  },

  {
    slug: "saas-burn-rate-formula",
    canonical: { name: "Burn Rate Calculator", path: "/tools/finance/burn-rate-calculator", cta: "Calculate Your Burn Rate Free →" },
    seo: {
      title: "SaaS Burn Rate Formula — Calculate Monthly Gross & Net Burn",
      h1: "SaaS Burn Rate Formula: Calculate Your Gross and Net Monthly Burn",
      description: "Understand the SaaS burn rate formula. Calculate gross burn, net burn, and burn multiple. Free calculator with category breakdown and capital efficiency insights.",
      keywords: ["saas burn rate formula", "monthly burn rate calculator", "startup burn rate", "gross burn net burn calculator"],
    },
    intro: `Burn rate is the speed at which a startup consumes its cash. For SaaS companies especially, understanding burn rate is existential — it determines how long you have to find product-market fit, how efficiently you're deploying capital, and what story you're telling investors. Investors don't just look at your burn; they look at what you're getting for it.`,
    sections: [
      {
        heading: "The Burn Rate Formula",
        body: `Gross Burn = Total Monthly Expenses. This includes everything: payroll, cloud infrastructure, marketing, office, SaaS tools, contractor fees, and legal. Nothing is excluded.\n\nNet Burn = Gross Burn − Monthly Revenue (MRR). Net burn is the actual cash you're losing every month. It's the number that drives your runway calculation. A company with ₹20 lakh in gross burn and ₹8 lakh in MRR has ₹12 lakh in net burn — and that's the number that matters for survival.`,
      },
      {
        heading: "The Burn Multiple: Capital Efficiency",
        body: `The Burn Multiple, coined by David Sacks, measures how many rupees of burn it takes to generate one rupee of net new ARR. Formula: Burn Multiple = Net Burn ÷ Net New ARR.\n\nBenchmarks: Under 1× is exceptional. 1–1.5× is good. 1.5–2× is acceptable early stage. Above 2× is a warning sign. Above 3× is a crisis. In the current environment, investors scrutinize this metric heavily. High burn multiples don't just mean you're inefficient — they mean your growth is fragile and likely to collapse when spending slows.`,
      },
      {
        heading: "Category Breakdown: Where Does Startup Money Actually Go?",
        body: `Typical SaaS startup burn breakdown: Personnel 60–70% (salaries, benefits, equity). Infrastructure 8–15% (cloud, CDN, databases). Sales & Marketing 10–20% (ads, tools, events, SDR cost). G&A 5–10% (legal, accounting, office, insurance). R&D tooling 2–5% (licenses, dev tools).\n\nThe personnel percentage is why layoffs are the fastest path to extending runway. But cuts have compounding costs: reduced morale, slower execution, potential customer impact. The best operators find 15–20% savings through vendor renegotiations, infrastructure optimization, and marketing channel efficiency before touching headcount.`,
      },
      {
        heading: "Burn Rate Benchmarks by Stage",
        body: `Pre-seed (< $1M raised): ₹5–15 lakh/month net burn. Anything above ₹20 lakh at this stage is a red flag unless you have strong revenue traction.\n\nSeed ($1–3M raised): ₹15–50 lakh/month. You're hiring your founding team and establishing go-to-market. Spending should be producing measurable outputs: user growth, early revenue, product milestones.\n\nSeries A ($5–15M raised): ₹50–2 crore/month. You've found product-market fit and you're scaling what works. High burn is acceptable if the burn multiple is under 1.5× and your ARR growth rate is 100%+.`,
      },
    ],
    conclusion: `Burn rate isn't just a financial input — it's a signal about your strategic clarity. Teams with focused, efficient burn have usually made hard choices about what not to do. Use the burn rate calculator to break down your spending by category, calculate your burn multiple, and identify where your biggest efficiency opportunities lie.`,
    faqs: [
      { q: "What is a good monthly burn rate for a startup?", a: "It depends on stage and revenue. A pre-seed startup burning ₹10 lakh/month with zero revenue is very different from a Series A company burning ₹1 crore/month at 150% YoY growth." },
      { q: "How is burn multiple calculated?", a: "Burn Multiple = Net Burn ÷ Net New ARR. Under 1× is exceptional. A burn multiple above 2× means you're burning more than you're generating in new revenue." },
      { q: "What's the difference between gross burn and net burn?", a: "Gross burn is total monthly spending. Net burn is gross burn minus monthly revenue. Net burn is what actually reduces your cash balance." },
      { q: "How do I reduce my burn rate quickly?", a: "The fastest levers: renegotiate annual SaaS contracts, audit cloud spend (most startups overspend by 2-3×), defer non-critical hires, and convert one-time projects to smaller scoped work." },
    ],
  },

  {
    slug: "arr-mrr-calculator",
    canonical: { name: "ARR / MRR Calculator", path: "/tools/finance/arr-calculator", cta: "Calculate ARR / MRR Free →" },
    seo: {
      title: "ARR vs MRR Calculator — Track SaaS Revenue Metrics",
      h1: "ARR vs MRR Calculator: Understand Your SaaS Revenue",
      description: "Free ARR and MRR calculator. Decompose revenue into new, expansion, and churned MRR. Calculate Quick Ratio and benchmark against top SaaS companies.",
      keywords: ["arr calculator saas", "mrr calculator", "arr vs mrr", "saas revenue metrics calculator", "quick ratio saas"],
    },
    intro: `Annual Recurring Revenue (ARR) and Monthly Recurring Revenue (MRR) are the two most fundamental metrics for any SaaS business. They're not just vanity metrics — they're the inputs to every other business calculation: valuation multiples, growth rates, payback periods, and efficiency ratios. Getting them right matters.`,
    sections: [
      {
        heading: "ARR vs MRR: The Core Definitions",
        body: `MRR (Monthly Recurring Revenue) is the predictable, normalized revenue you earn from subscriptions every month. The key word is normalized — a customer who pays ₹60,000 annually contributes ₹5,000/month to MRR, not ₹60,000 in January and zero for the rest of the year.\n\nARR (Annual Recurring Revenue) = MRR × 12. Simple. ARR is used as the primary SaaS valuation benchmark: early-stage SaaS companies trade at 5–15× ARR, growth-stage at 10–30× ARR, and exceptional companies (Snowflake, Figma in their early days) commanded 40–60× ARR at their peaks.`,
      },
      {
        heading: "MRR Decomposition: The Four Components",
        body: `New MRR: Revenue from customers who didn't exist last month. This is your acquisition engine.\n\nExpansion MRR: Additional revenue from existing customers (upsells, seat expansion, add-ons). This is your monetization engine and the healthiest form of growth.\n\nContraction MRR: Revenue lost from customers who downgraded.\n\nChurned MRR: Revenue lost from customers who cancelled entirely.\n\nNet New MRR = New + Expansion − Contraction − Churned. This is the number that drives ARR growth. If your net new MRR is positive but small relative to your gross new MRR, you have a retention problem that will eventually cap your growth.`,
      },
      {
        heading: "SaaS Quick Ratio: Growth Quality Score",
        body: `The Quick Ratio = (New MRR + Expansion MRR) ÷ (Churned MRR + Contraction MRR). It measures the quality and sustainability of your growth.\n\nBenchmarks: Quick Ratio > 4 is exceptional (you're growing much faster than you're losing). QR 2–4 is healthy growth. QR 1–2 is surviving but not thriving. QR < 1 means you're shrinking. For enterprise SaaS, QR > 2 is typically the bar for Series A. For consumer SaaS with inherently higher churn, investors look at absolute growth rate instead.`,
      },
      {
        heading: "Net Revenue Retention: The Retention Flywheel",
        body: `Net Revenue Retention (NRR) = (Beginning MRR + Expansion − Contraction − Churn) ÷ Beginning MRR × 100. Companies with NRR > 120% grow ARR from existing customers alone — new customer acquisition is pure acceleration.\n\nThe best SaaS companies have NRR > 130%: Snowflake (168%), Twilio (155%), and Datadog (130%) at their peaks. This means they could stop acquiring new customers entirely and still grow 30%+ annually. For early-stage companies, getting NRR above 100% is the most important milestone before scaling sales.`,
      },
    ],
    conclusion: `ARR and MRR aren't just accounting entries — they're the score of your business. Understanding their components (new, expansion, churn) tells you exactly where your business is healthy and where it needs work. Use the calculator to decompose your current revenue, calculate your Quick Ratio, and identify whether your growth is sustainable.`,
    faqs: [
      { q: "What is ARR in SaaS?", a: "ARR (Annual Recurring Revenue) is MRR × 12. It represents the annualized value of your recurring subscription revenue and is the primary metric for SaaS valuation." },
      { q: "What is a good SaaS Quick Ratio?", a: "Quick Ratio > 4 is exceptional. 2-4 is healthy. Below 1 means you're shrinking. For Series A fundraising, most investors want to see QR > 2." },
      { q: "How is expansion MRR different from new MRR?", a: "New MRR comes from customers who didn't subscribe before. Expansion MRR comes from existing customers paying more (upsells, seat growth, add-ons). Expansion is healthier because it has no acquisition cost." },
      { q: "What NRR should I target?", a: "Target NRR > 100% as the minimum, meaning expansion offsets churn. Best-in-class SaaS companies have NRR > 120-130%, meaning they grow revenue from existing customers alone." },
    ],
  },

  {
    slug: "saas-growth-rate-calculator",
    canonical: { name: "Growth Rate Calculator", path: "/tools/finance/growth-rate-calculator", cta: "Calculate Growth Rate Free →" },
    seo: {
      title: "SaaS Growth Rate Calculator — MoM, YoY, CAGR & T2D3",
      h1: "SaaS Growth Rate Calculator: MoM, YoY, CAGR, and T2D3 Benchmarks",
      description: "Free SaaS growth rate calculator. Calculate month-over-month, year-over-year, and CAGR. Compare against T2D3 growth benchmarks for Series A, B, and C.",
      keywords: ["saas growth rate calculator", "startup growth rate", "t2d3 calculator", "cagr calculator saas", "mrr growth rate"],
    },
    intro: `Growth rate is the most watched metric in venture capital. It determines your valuation multiple, your fundraising leverage, and ultimately whether your startup has the trajectory to become a category-defining company. Understanding how to calculate it — and what the right benchmarks are — is non-negotiable for serious founders.`,
    sections: [
      {
        heading: "Month-over-Month vs Year-over-Year Growth",
        body: `Month-over-month (MoM) growth = (Current MRR − Previous MRR) ÷ Previous MRR × 100. This is the most granular signal and the most volatile. A single great month can spike MoM; a single bad month can crater it. Use a 3-month rolling average to filter out noise.\n\nYear-over-year (YoY) growth = (Current ARR − ARR 12 months ago) ÷ ARR 12 months ago × 100. This is what institutional investors focus on. It captures seasonal effects, smooths volatility, and is the standard benchmark for Series A and beyond. A 100% YoY growth rate — doubling ARR annually — is typically the Series A bar for B2B SaaS.`,
      },
      {
        heading: "CAGR: The Multi-Year View",
        body: `Compound Annual Growth Rate (CAGR) = (Ending Value ÷ Beginning Value)^(1/years) − 1. CAGR is the most honest way to compare growth across companies at different stages because it accounts for compounding.\n\nA company that grew from ₹10 lakh to ₹1.6 crore ARR in 3 years has a 150% CAGR — which sounds extreme but is actually the trajectory for elite SaaS companies. For context, Salesforce grew at ~55% CAGR for its first decade. Zoom grew at >100% CAGR for 4 years before its IPO. The metric that matters is sustainability of that CAGR, not just the number itself.`,
      },
      {
        heading: "T2D3: The Growth Model for Series A to IPO",
        body: `T2D3 (Triple, Triple, Double, Double, Double) is the growth model developed by Neeraj Agrawal at Battery Ventures that describes the trajectory of companies from $2M to $100M ARR:\n\nYear 1: $2M ARR. Year 2: $6M (3×). Year 3: $18M (3×). Year 4: $36M (2×). Year 5: $72M (2×). Year 6: $144M (2×).\n\nThis isn't a prescription — it's a description of what the best software companies actually did. Not every company needs to hit T2D3 exactly, but understanding where you are relative to this model tells you whether you're tracking toward category leadership or toward a slower, more capital-efficient path.`,
      },
      {
        heading: "Doubling Time: The Instinctive Growth Metric",
        body: `Doubling time answers the question every founder actually wants answered: "How long until I'm twice as big?" Formula: Doubling Time = 70 ÷ Monthly Growth Rate (%). This uses the Rule of 70 approximation.\n\nAt 15% MoM growth, you double every 4.7 months. At 10% MoM, you double every 7 months. At 5% MoM, you double every 14 months. The difference between 10% and 15% MoM seems small but compounds into massive valuation differences. At 10% MoM for 2 years, you grow 9.8×. At 15% MoM, you grow 22.6×. Pick your growth rate carefully — the difference is enormous.`,
      },
    ],
    conclusion: `Growth rate is not just a metric you report to investors — it's a forcing function for strategic clarity. When you know your exact MoM and understand where you should be on the T2D3 curve, every decision becomes clearer. Use the calculator to get your growth numbers, then plot them against the benchmarks to understand your fundraising position.`,
    faqs: [
      { q: "What is a good MoM growth rate for a SaaS startup?", a: "5-7% MoM is considered good for an early-stage SaaS. 10%+ is excellent. 15%+ puts you in the top 10% of startups. Below 3% suggests you need to revisit your growth levers." },
      { q: "What is T2D3 growth?", a: "T2D3 (Triple, Triple, Double, Double, Double) describes the ARR trajectory from $2M to $100M: triple for two years, then double for three years. It's a benchmark for top-tier venture-backed SaaS." },
      { q: "How do I calculate CAGR?", a: "CAGR = (Ending Value ÷ Starting Value)^(1/Number of Years) − 1. Multiply by 100 for percentage. A company going from ₹1Cr to ₹8Cr ARR in 3 years has a 100% CAGR." },
      { q: "Is YoY or MoM growth more important?", a: "MoM gives you faster feedback; YoY is what investors benchmark. Use MoM to manage and adjust your business, and YoY to set fundraising expectations." },
    ],
  },

  {
    slug: "default-alive-calculator",
    canonical: { name: "Runway Calculator", path: "/tools/finance/runway-calculator", cta: "Check Your Default Alive Status →" },
    seo: {
      title: "Default Alive Calculator — Is Your Startup Surviving Without Funding?",
      h1: "Default Alive or Default Dead? Calculate Your Startup's Survival Status",
      description: "Check if your startup is default alive — able to reach profitability without raising more money. Free calculator using Paul Graham's framework.",
      keywords: ["default alive calculator", "default alive or dead startup", "startup profitability calculator", "paul graham default alive"],
    },
    intro: `Paul Graham's 2015 essay "Default Alive or Default Dead?" is one of the most important frameworks in startup finance. The question is simple but profound: if you keep growing at your current rate and spending at your current rate, will you reach profitability before you run out of money? Your answer to this question determines your entire strategic posture.`,
    sections: [
      {
        heading: "The Default Alive Formula",
        body: `Default alive status requires solving: Time to profitability < Runway. Both sides of this equation are calculable with the numbers you have today.\n\nRunway = Current Cash ÷ Net Monthly Burn. Time to profitability = the number of months until revenue exceeds expenses, given your current growth rate. If revenue grows at 10% per month and you're currently at ₹8 lakh MRR against ₹12 lakh gross burn, you'll reach break-even in roughly 4–5 months.\n\nThe danger: most founders who calculate this discover they're default dead. That's not a failure — it's information. Information that should immediately change your decision-making.`,
      },
      {
        heading: "Default Dead ≠ Doomed",
        body: `Being default dead just means your current trajectory requires external capital. The vast majority of VC-backed startups are default dead by design — they raise capital specifically to accelerate growth faster than organic cash flow allows.\n\nThe problem isn't being default dead. The problem is being default dead without knowing it, and therefore not taking the actions that would change that status. Founders who discover they're default dead with 6 months of runway are in a very different position than those who discover it with 18 months.`,
      },
      {
        heading: "How to Become Default Alive",
        body: `The levers are growth acceleration and cost reduction, and ideally both simultaneously. For most SaaS companies, the most powerful lever is growth — because revenue not only improves your break-even timeline, it also extends your runway (lower net burn) and makes future fundraising easier.\n\nA company that goes from default dead to default alive through revenue growth has proved something profound: the business works on its own terms. This massively improves your fundraising position. Investors know they're buying optionality — you don't need their money, which means you'll be a better steward of it.`,
      },
    ],
    conclusion: `Run this calculation every month. Your default alive status can change quickly — a few good months of growth can flip you from dead to alive. But it can also deteriorate: a customer churn spike, a key hire, a failed marketing channel. Keep this number on your dashboard alongside ARR and runway.`,
    faqs: [
      { q: "What does 'default alive' mean?", a: "A startup is default alive if, at its current growth and burn rates, it will reach profitability before running out of cash. Default dead means it needs external capital or major changes to survive." },
      { q: "Who coined the term 'default alive'?", a: "Paul Graham of Y Combinator, in his 2015 essay 'Default Alive or Default Dead?' It's required reading for early-stage founders." },
      { q: "How do I calculate default alive status?", a: "Compare your time-to-profitability (based on current growth rate) against your runway (cash ÷ net burn). If time to profitability < runway, you're default alive." },
    ],
  },

  {
    slug: "india-startup-100cr-path",
    canonical: { name: "₹100Cr Journey Calculator", path: "/tools/finance/100cr-calculator", cta: "Map Your ₹100Cr Path →" },
    seo: {
      title: "₹100 Crore ARR Startup Calculator — Plan Your India Growth Journey",
      h1: "How Indian Startups Reach ₹100 Crore ARR: The Complete Framework",
      description: "Calculate the path from your current ARR to ₹100 Crore. Understand T2D3 milestones, runway needs, and team size benchmarks for Indian SaaS startups.",
      keywords: ["100 crore startup calculator", "india saas arr calculator", "startup revenue calculator india", "path to 100cr arr"],
    },
    intro: `₹100 Crore ARR ($12M ARR at current exchange rates) is the milestone that separates India's venture-scale startups from the rest. It's the number that typically triggers Series B conversations, enables profitable unit economics at scale, and puts a company on the radar of global SaaS investors. Most Indian SaaS founders target this milestone within 5–7 years of founding.`,
    sections: [
      {
        heading: "The Indian SaaS T2D3 Trajectory",
        body: `While global T2D3 typically begins at $2M ARR (~₹17Cr), many Indian SaaS companies operate at slightly different scales due to India-specific pricing. The adapted trajectory:\n\nYear 1-2 (₹2-5Cr ARR): Achieve product-market fit in a defined segment. Customer acquisition is mostly founder-led. Revenue comes from 10-30 paying customers.\n\nYear 3-4 (₹10-25Cr ARR): First dedicated sales team. Processes are being established. Churn is the primary risk. This is the hardest phase — you're no longer a scrappy startup but not yet a machine.\n\nYear 5-6 (₹50-100Cr ARR): Repeatable go-to-market. Multiple channels working. NRR > 110%. The business is compounding on itself.`,
      },
      {
        heading: "Capital Efficiency in Indian SaaS",
        body: `Indian SaaS companies tend to be more capital-efficient than their US counterparts — lower engineering salaries (though rapidly converging), smaller office costs, and India-first go-to-market before US expansion. This means the typical path to ₹100Cr ARR can be achieved on $10-15M in total capital raised, compared to $25-40M for a US-only SaaS company.\n\nThe ones who fail to reach ₹100Cr typically have one of three problems: they solve a small problem (TAM < ₹1,000Cr addressable market), they have high churn that caps growth, or they expand to the US before achieving dominance in India — spreading thin before building depth.`,
      },
      {
        heading: "Team Building to ₹100Cr",
        body: `The team size benchmarks for Indian SaaS: ₹5Cr ARR: 15-25 employees. ₹25Cr ARR: 50-80 employees. ₹100Cr ARR: 150-250 employees. Revenue per employee at ₹100Cr ARR: ₹40-70 lakh/year/employee — a strong efficiency metric.\n\nThe common hiring mistake: building the US sales team too early. US GTM requires US-market expertise, US customer relationships, and US office presence. Companies that crack India first to ₹50Cr ARR and then land a strong US VP of Sales typically have a more capital-efficient US expansion than those who start with US customers from day one.`,
      },
    ],
    conclusion: `₹100Cr ARR isn't a fantasy — it's a math problem. The inputs are your current ARR, growth rate, burn efficiency, and the clarity of your go-to-market. Use the calculator to model your specific trajectory, stress-test your assumptions, and build the roadmap that takes you there.`,
    faqs: [
      { q: "How long does it take an Indian startup to reach ₹100Cr ARR?", a: "Typically 5-8 years from founding for SaaS companies. The fastest (like Zoho, Freshworks early divisions) hit similar milestones in 4-5 years, but these are outliers." },
      { q: "What funding is needed to reach ₹100Cr ARR?", a: "Capital-efficient Indian SaaS companies have reached ₹100Cr ARR on $8-15M total raised. Those with enterprise go-to-market or US expansion typically need $20-40M." },
      { q: "What is the T2D3 model?", a: "Triple, Triple, Double, Double, Double — a description of how top SaaS companies grow from $2M to $100M ARR over ~6 years. Originally described by Battery Ventures partner Neeraj Agrawal." },
    ],
  },

  /* ─── Developer Tools ───────────────────────────────────────── */

  {
    slug: "decode-jwt-token-online",
    canonical: { name: "JWT Decoder", path: "/jwt-decoder", cta: "Decode Your JWT Token →" },
    seo: {
      title: "JWT Token Decoder Online — Decode JSON Web Tokens Instantly",
      h1: "How to Decode a JWT Token Online (No Secret Required)",
      description: "Free online JWT decoder. Paste any JSON Web Token to instantly see the header, payload, and expiration. Explains HS256, RS256, and ES256 signing algorithms.",
      keywords: ["jwt decoder online", "decode jwt token", "json web token decoder", "jwt payload viewer", "jwt inspector"],
    },
    intro: `JSON Web Tokens (JWTs) are the backbone of modern authentication. They're in your Authorization headers, your cookies, your OAuth responses. Every developer who works with APIs needs to understand what a JWT contains — and decoding one is the fastest path to debugging auth issues, understanding expiration behavior, and verifying that your backend is generating the right claims.`,
    sections: [
      {
        heading: "JWT Structure: The Three Parts",
        body: `A JWT is three Base64URL-encoded strings separated by dots: Header.Payload.Signature. The header specifies the algorithm (alg) and token type (typ). The payload contains the claims — standardized fields like sub (subject), exp (expiration), iat (issued at), and any custom claims your app defines. The signature verifies that the header and payload weren't tampered with.\n\nDecoding a JWT doesn't require the signing secret. The header and payload are just Base64URL-encoded JSON — any tool (or a single line of JavaScript) can decode them. What requires the secret is verification — confirming the signature is valid. For debugging purposes, decoding without verification is often exactly what you need.`,
      },
      {
        heading: "Common JWT Claims and What They Mean",
        body: `sub (Subject): The unique identifier for the user or entity the token represents. Often a user ID. iss (Issuer): Who created the token — your auth service, Auth0, Firebase, etc. aud (Audience): Who the token is intended for. exp (Expiration): Unix timestamp after which the token is invalid. iat (Issued At): Unix timestamp when the token was created. jti (JWT ID): A unique identifier for this specific token, used to prevent replay attacks.\n\nCustom claims are anything else your application adds: roles, permissions, plan tier, tenant ID. These live in the payload alongside the standard claims and are readable by any client that holds the token.`,
      },
      {
        heading: "JWT Debugging: The Most Common Issues",
        body: `"Token expired" errors: The exp claim is in the past. Check the difference between exp and iat to understand the intended token lifetime, and compare exp to your system clock (timezone issues are a common culprit).\n\n"Invalid signature" errors: The token was modified after signing, or you're using the wrong secret/key. Decode the header to confirm the algorithm, then verify you're using the matching key.\n\n"Token not yet valid" errors: Some JWTs include an nbf (Not Before) claim. If the issuing server's clock is ahead of yours, you'll get this error on tokens that are technically valid. NTP sync issues cause this in containerized environments.`,
      },
      {
        heading: "HS256 vs RS256 vs ES256",
        body: `HS256 (HMAC-SHA256) is symmetric — the same secret signs and verifies the token. Simple but requires every service that verifies the token to know the secret. Best for monolithic applications.\n\nRS256 (RSA-SHA256) is asymmetric — a private key signs, a public key verifies. Services can verify JWTs without knowing the signing secret. Best for distributed systems and when exposing verification to third parties.\n\nES256 (ECDSA with P-256) is asymmetric like RS256 but uses elliptic curve cryptography for smaller key sizes and faster operations. Increasingly popular for mobile and IoT use cases.`,
      },
    ],
    conclusion: `JWT debugging is a daily activity for any developer building authentication. Having a fast, trustworthy decoder in your toolkit saves hours of frustration. Paste your token into the decoder to instantly inspect headers, payload claims, expiration times, and algorithm details.`,
    faqs: [
      { q: "Is it safe to decode a JWT online?", a: "Decoding (reading) a JWT is safe — the payload is just Base64 encoded, not encrypted. Never share your JWT signing secrets online. The token value itself can be decoded by anyone who holds it." },
      { q: "What does a JWT payload contain?", a: "Standard fields: sub (user ID), exp (expiration time), iat (issued at), iss (issuer), aud (audience). Plus any custom claims your application adds like roles, permissions, or plan tier." },
      { q: "Can I decode a JWT without the secret?", a: "Yes. The header and payload are Base64URL-encoded, not encrypted. You can decode them without the signing secret. Verification (confirming the signature is valid) requires the secret." },
      { q: "What is the difference between HS256 and RS256?", a: "HS256 uses a shared symmetric secret for both signing and verification. RS256 uses RSA asymmetric keys — a private key signs, and a public key (shareable) verifies. RS256 is better for distributed systems." },
    ],
  },

  {
    slug: "json-to-typescript-interface",
    canonical: { name: "JSON to TypeScript", path: "/json-to-typescript", cta: "Generate TypeScript Types →" },
    seo: {
      title: "JSON to TypeScript Interface Generator — Free Online Tool",
      h1: "JSON to TypeScript Interface Generator: Auto-Generate Types from JSON",
      description: "Instantly convert JSON to TypeScript interfaces, types, Zod schemas, or Yup validators. Free, instant, handles nested objects and arrays.",
      keywords: ["json to typescript interface", "json to ts generator", "typescript interface from json", "generate typescript types", "json to zod schema"],
    },
    intro: `TypeScript's type system is only as good as your type definitions. Writing interfaces by hand for complex API responses is tedious and error-prone. A JSON to TypeScript generator automates this completely — paste a JSON response, get correctly typed interfaces in seconds. It's one of the most time-saving tools in a TypeScript developer's workflow.`,
    sections: [
      {
        heading: "Why Auto-Generate TypeScript Types?",
        body: `API responses change. Type definitions don't update themselves. The gap between your TypeScript types and the actual API response is where runtime errors live. Auto-generating types from real API responses closes this gap and ensures your types accurately reflect the data you're actually working with.\n\nMore practically: writing types by hand for a deeply nested JSON object (think Stripe webhook payloads, GitHub API responses, Salesforce objects) takes 30–60 minutes and introduces typos. A generator takes 10 seconds and produces identical output. The cognitive load savings compound across a codebase.`,
      },
      {
        heading: "Interface vs Type Alias in TypeScript",
        body: `Both interface and type alias can describe object shapes, but they have meaningful differences. Interfaces support declaration merging — you can extend them with additional properties in separate declarations. This makes interfaces the preferred choice for library authors and SDK types that consumers might want to augment.\n\nType aliases are more flexible — they can describe unions, intersections, mapped types, and conditional types that interfaces can't. For application code describing API responses, either works; the convention is to prefer interface for object types and type for everything else.`,
      },
      {
        heading: "Zod and Yup: Runtime Validation from JSON",
        body: `TypeScript types only exist at compile time. At runtime, you're back to JavaScript, and any validation against external data must be done explicitly. Zod and Yup are the two dominant runtime validation libraries that let you define schemas with TypeScript types built in.\n\nZod is the modern choice: it generates TypeScript types from schemas (rather than the other way around), has excellent error messages, and integrates well with tRPC and Next.js. Yup has a larger installed base and is tightly coupled with Formik in the form validation world. Auto-generating Zod schemas from JSON is the fastest path to validated, typed API responses.`,
      },
      {
        heading: "Handling Edge Cases in Type Generation",
        body: `Arrays with mixed types: When a JSON array contains multiple types (["foo", 1, true]), the generator produces (string | number | boolean)[]. This is technically correct but often a sign that the API is returning inconsistent data. Nullable fields: null values produce type | null. Optional fields: missing in some samples produce type | undefined. Nested objects: produce nested interfaces, which you might want to extract into named types for reuse.`,
      },
    ],
    conclusion: `Auto-generating TypeScript types from JSON is one of the highest-leverage activities in TypeScript development. Every API integration you build starts with the types. Getting them right, fast, sets up everything else. Use the generator to convert any JSON payload to fully typed interfaces in seconds.`,
    faqs: [
      { q: "Can I generate Zod schemas from JSON?", a: "Yes. The tool generates Zod schemas, Yup validators, TypeScript interfaces, and type aliases from any valid JSON input." },
      { q: "How does the tool handle null values?", a: "Null values produce `type | null` in the generated interface. You can choose to make all fields optional by adding `?` to every property." },
      { q: "What's the difference between TypeScript interface and type?", a: "Interfaces support declaration merging (useful for extending library types). Type aliases support unions, intersections, and complex type operations. For API responses, either works — interface is the convention for object types." },
    ],
  },

  {
    slug: "online-regex-tester",
    canonical: { name: "RegEx Tester", path: "/regex-tester", cta: "Test Your Regex Pattern →" },
    seo: {
      title: "Online Regex Tester — Test Regular Expressions in Real-Time",
      h1: "Online Regex Tester: Test, Debug, and Explain Regular Expressions",
      description: "Free online regex tester for JavaScript. Real-time match highlighting, capture group visualization, and performance profiling. No install required.",
      keywords: ["online regex tester", "test regex javascript", "regex pattern tester", "regular expression tester", "regex debugger online"],
    },
    intro: `Regular expressions are powerful but notoriously difficult to debug. A regex that "should work" often doesn't, and figuring out why requires seeing exactly what the engine is matching. An online regex tester gives you immediate visual feedback on what your pattern matches, where it fails, and what your capture groups contain.`,
    sections: [
      {
        heading: "JavaScript Regex Flags: The Essential Reference",
        body: `g (global): Find all matches, not just the first. Without this flag, /pattern/.test() stops after the first match.\n\ni (case insensitive): /hello/i matches "Hello", "HELLO", "hElLo".\n\nm (multiline): Makes ^ match the start of each line (not just the string) and $ match the end of each line.\n\ns (dotAll): Makes . match newline characters too. Without this, . matches everything except \\n.\n\nd (indices): Populates the indices property of the match result with start and end positions for each match and capture group.`,
      },
      {
        heading: "Capture Groups vs Non-Capturing Groups",
        body: `Capture groups (x) capture the matched text and make it available via match[1], match[2], etc. They're the primary way to extract parts of a match.\n\nNamed capture groups (?<name>x) give your captures readable names: match.groups.name instead of match[1]. Dramatically improves readability for complex patterns.\n\nNon-capturing groups (?:x) group without capturing. Use these when you need the grouping for alternation or quantification but don't need the captured value — it avoids polluting your capture group index array.\n\nLookaheads (?=x) and lookbehinds (?<=x) match positions without consuming characters. They're powerful for assertions that don't appear in the final match.`,
      },
      {
        heading: "Performance: The Catastrophic Backtracking Problem",
        body: `Certain regex patterns cause exponential backtracking — the engine tries so many combinations that it takes seconds or even minutes to return a result on certain inputs. This is called "Catastrophic Backtracking" and it's a real denial-of-service vector in production systems.\n\nThe patterns to watch: nested quantifiers like (a+)+ on strings with many 'a' characters. The classic example: /^(a+)+$/ against "aaaaaaaaaaaaaaaaX" triggers exponential backtracking in most engines. Use possessive quantifiers (a++)+ or atomic groups in engines that support them. For JavaScript, rewrite to eliminate nested variable-length quantifiers.`,
      },
    ],
    conclusion: `Debugging a regex by staring at it rarely works. You need to see what it's actually matching. Use the tester to paste your pattern and test string, watch matches highlight in real time, inspect capture groups, and profile performance on your specific input.`,
    faqs: [
      { q: "Does the regex tester use JavaScript regex?", a: "Yes. The engine is JavaScript's native RegExp, so the behavior matches exactly what you'll get in Node.js and modern browsers." },
      { q: "What is a capture group in regex?", a: "Parentheses (x) create a capture group that stores the matched text. You access it via match[1], match[2], etc. Named groups (?<name>x) use match.groups.name." },
      { q: "What is catastrophic backtracking?", a: "When certain patterns on certain inputs cause the regex engine to try exponentially many paths before failing. Can cause near-infinite computation. Avoid nested quantifiers like (a+)+." },
    ],
  },

  {
    slug: "format-sql-query-online",
    canonical: { name: "SQL Formatter", path: "/sql-formatter", cta: "Format Your SQL Query →" },
    seo: {
      title: "SQL Query Formatter Online — Beautify SQL for MySQL, PostgreSQL, BigQuery",
      h1: "Online SQL Formatter: Beautify SQL Queries for Any Dialect",
      description: "Free online SQL formatter. Instantly format messy SQL queries for MySQL, PostgreSQL, BigQuery, Snowflake, and more. Copy clean, readable SQL in seconds.",
      keywords: ["sql formatter online", "format sql query", "sql beautifier", "sql pretty printer", "online sql formatter postgresql"],
    },
    intro: `Unformatted SQL is nearly unreadable. A single-line query that's a hundred words long might be perfectly valid but completely unmaintainable. SQL formatting isn't cosmetic — it's functional. Well-formatted SQL is faster to review, easier to debug, and less likely to harbor subtle bugs that hide in dense, unspaced text.`,
    sections: [
      {
        heading: "SQL Formatting Standards",
        body: `There's no ISO standard for SQL formatting, but industry conventions have emerged. The most common style: uppercase keywords (SELECT, FROM, WHERE, JOIN, GROUP BY), each clause on a new line, indented subqueries, and aligned aliases.\n\nThe consistent principle: visual hierarchy should reflect logical hierarchy. A WHERE clause with five conditions should be visually structured so you can see each condition independently. JOINs should be indented to show the table relationships. Subqueries should be further indented to show nesting depth.`,
      },
      {
        heading: "SQL Dialects: Where They Differ",
        body: `Standard SQL (SQL-92, SQL-99, SQL:2003) provides the core syntax. Every database extends it in incompatible ways.\n\nMySQL / MariaDB: backtick identifiers, GROUP BY requires all SELECT columns (unless using ANY_VALUE). PostgreSQL: double-quote identifiers, richer set of data types, window functions with extensive syntax. BigQuery: Standard SQL mode with some extensions, array/struct types, UNNEST for flattening. Snowflake: close to standard SQL with proprietary functions like FLATTEN, LATERAL FLATTEN for semi-structured data. Understanding which dialect you're writing for affects both syntax and formatting choices.`,
      },
      {
        heading: "CTEs vs Subqueries: Readability Matters",
        body: `Common Table Expressions (CTEs) — defined with WITH clause — dramatically improve readability for complex queries. A query with three nested subqueries is hard to follow. The same logic expressed as three sequential CTEs reads like prose.\n\nThe formatter's job with CTEs: each CTE name is aligned with the WITH keyword, the AS ( keyword starts a new line, the CTE body is indented. The final SELECT from the CTEs reads cleanly. This pattern makes even 200-line SQL queries reviewable.`,
      },
    ],
    conclusion: `Formatted SQL isn't just easier to read — it's faster to write, easier to diff in code review, and more likely to reveal logical errors before they reach production. Format before every commit.`,
    faqs: [
      { q: "Does the formatter support PostgreSQL, MySQL, and BigQuery?", a: "Yes. The formatter auto-detects common dialects and can be configured for specific ones. Syntax differences between dialects are preserved." },
      { q: "Why uppercase SQL keywords?", a: "Convention and readability. Uppercase keywords visually separate SQL syntax from user-defined identifiers (table names, column names). It's not required — SQL is case-insensitive for keywords." },
      { q: "Does formatting SQL affect performance?", a: "No. SQL formatting only affects readability. The database parser ignores whitespace and formatting entirely." },
    ],
  },

  {
    slug: "base64-encode-decode-online",
    canonical: { name: "Base64 Encoder", path: "/base64-encoder", cta: "Encode / Decode Base64 →" },
    seo: {
      title: "Base64 Encode & Decode Online — Free String and File Encoder",
      h1: "Base64 Encode and Decode Online: Strings, Files, and Data URIs",
      description: "Free Base64 encoder and decoder. Encode text, JSON, files, and images. Decode any Base64 string with automatic content type detection.",
      keywords: ["base64 encode online", "base64 decode online", "base64 encoder decoder", "encode base64 string", "decode base64"],
    },
    intro: `Base64 is everywhere in web development — email attachments, data URIs, Basic Auth headers, JSON Web Token payloads, binary data in REST APIs. Understanding Base64 encoding and having a reliable tool to encode and decode it is table stakes for any backend or full-stack developer.`,
    sections: [
      {
        heading: "What Is Base64 Encoding?",
        body: `Base64 encodes binary data into a string of 64 printable ASCII characters: A–Z, a–z, 0–9, +, /. The name comes from the 64-character alphabet. Every 3 bytes of input becomes 4 characters of output, increasing the size by approximately 33%.\n\nThe reason Base64 exists: many protocols (email SMTP, HTTP headers, XML, JSON) are designed for text and can't reliably transmit arbitrary binary data. Base64 converts binary into text that can safely pass through any text-based protocol.`,
      },
      {
        heading: "Base64 vs URL-Safe Base64",
        body: `Standard Base64 uses + and / which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _. This matters when embedding Base64 in query parameters or JWT tokens (JWTs use URL-safe Base64 for their header and payload sections).\n\nThe padding character = is also sometimes omitted in URL-safe contexts. Most decoders handle both padded and unpadded input, but if you're passing Base64 in a URL parameter, always use the URL-safe variant without padding.`,
      },
      {
        heading: "Common Base64 Use Cases in Web Development",
        body: `Data URIs: Embed small images directly in HTML or CSS: data:image/png;base64,iVBOR... eliminates a network request. Best for icons under 2KB; larger images are more efficiently served as separate files.\n\nBasic Authentication: HTTP Basic Auth sends credentials as Base64: Authorization: Basic base64(username:password). Note: Base64 is encoding, not encryption. The credentials are trivially recoverable. Always use HTTPS.\n\nAPI payloads: Some APIs accept binary files as Base64 strings in JSON payloads — simpler than multipart/form-data for small files, though less efficient.`,
      },
    ],
    conclusion: `Base64 is one of those fundamental encoding schemes that every developer encounters repeatedly. Having a reliable, fast tool for encoding and decoding — one that also handles files, detects content types, and handles both standard and URL-safe variants — saves real time during API debugging and development.`,
    faqs: [
      { q: "Is Base64 encoding secure?", a: "No. Base64 is encoding, not encryption. Anyone can decode Base64 back to the original data trivially. Never use Base64 to 'hide' sensitive information." },
      { q: "What is the difference between Base64 and URL-safe Base64?", a: "Standard Base64 uses + and / which break in URLs. URL-safe Base64 replaces + with - and / with _. JWTs and most web APIs use URL-safe Base64." },
      { q: "Why does Base64 increase file size?", a: "Every 3 bytes of input becomes 4 Base64 characters, plus optional padding. This is a ~33% size increase. For images embedded in HTML, this tradeoff eliminates a network round-trip." },
    ],
  },

  {
    slug: "cron-expression-tester",
    canonical: { name: "Cron Visualizer", path: "/cron-visualizer", cta: "Test Your Cron Expression →" },
    seo: {
      title: "Cron Expression Tester — Visualize Scheduled Job Timing Online",
      h1: "Cron Expression Tester: Understand and Debug Your Scheduled Tasks",
      description: "Free online cron expression parser and tester. See exactly when your scheduled tasks will run next. Supports 5-field and 6-field cron syntax.",
      keywords: ["cron expression tester", "cron job tester online", "cron schedule visualizer", "cron parser online", "test cron expression"],
    },
    intro: `Cron expressions are the lingua franca of task scheduling — they power everything from nightly data pipelines to hourly reports to database maintenance jobs. But the syntax is notoriously cryptic, and a one-character error can shift a daily job to run once a month instead. A cron tester makes the timing visible before you deploy.`,
    sections: [
      {
        heading: "Cron Syntax: The Five (and Six) Fields",
        body: `Standard 5-field cron: minute hour day-of-month month day-of-week. Each field accepts: a specific value (5), a range (1-5), a list (1,3,5), a step value (*/15 = every 15), or wildcard (*). Example: 0 9 * * 1-5 = "At 9:00 AM every weekday."\n\nMany modern schedulers (AWS CloudWatch Events, Quartz, Kubernetes CronJobs) add a 6th field for seconds: second minute hour day-of-month month day-of-week. Some add a 7th for year. Always confirm which variant your platform uses — the defaults differ between systems.`,
      },
      {
        heading: "Common Cron Patterns",
        body: `*/5 * * * *  — Every 5 minutes\n0 * * * *    — Every hour at the top of the hour\n0 0 * * *    — Daily at midnight\n0 9 * * 1-5  — Weekdays at 9 AM\n0 0 1 * *    — First of every month at midnight\n0 0 * * 0    — Every Sunday at midnight\n\nThe step value (*/n) is the most commonly misunderstood: */15 in the minute field doesn't mean "every 15 minutes starting from now" — it means "at minutes 0, 15, 30, 45 of every hour, unconditionally." This distinction matters if you're scheduling jobs relative to each other.`,
      },
      {
        heading: "Timezone Gotchas in Cron Scheduling",
        body: `Most cron systems default to UTC. If your job "runs at 9 AM" and your server is in UTC+5:30 (India), you need to set the cron to 3:30 AM UTC (09:00 - 05:30). Failing to account for timezone offsets is the #1 cause of "why is my report running at the wrong time" debugging sessions.\n\nDaylight Saving Time (DST) adds complexity for any cron job targeting a local time. A job scheduled for 2:30 AM doesn't exist on the spring-forward night, and runs twice on the fall-back night. In UTC or timezones without DST (India Standard Time is fixed), this problem doesn't exist.`,
      },
    ],
    conclusion: `Never deploy a cron job without testing the expression first. What looks like "every 5 minutes" might actually be "never" or "once per hour" depending on a misplaced wildcard. The visualizer shows you the next 10 run times so there are no surprises in production.`,
    faqs: [
      { q: "What timezone does cron use?", a: "Most systems default to UTC. Configure your scheduler to use the correct timezone explicitly rather than relying on the server's local time, which can change." },
      { q: "What does */15 mean in a cron expression?", a: "In the minute field, */15 means 'every 15 minutes' — specifically at minutes 0, 15, 30, and 45. The */ syntax means 'every nth value of the range'." },
      { q: "What is the difference between 5-field and 6-field cron?", a: "5-field cron starts with minute. 6-field adds a seconds field at the beginning (second minute hour day month weekday). AWS, Quartz, and Kubernetes use 6-field variants." },
    ],
  },

  {
    slug: "convert-curl-to-javascript",
    canonical: { name: "cURL Converter", path: "/curl-converter", cta: "Convert Your cURL Command →" },
    seo: {
      title: "Convert cURL to JavaScript, Python, Go & More — Free Online Tool",
      h1: "cURL Converter: Generate API Code from cURL Commands",
      description: "Free online cURL converter. Paste any curl command and get working code in JavaScript fetch, Python requests, Go, Ruby, PHP, and more.",
      keywords: ["curl to javascript converter", "curl to python", "curl to fetch", "convert curl command", "curl to code generator"],
    },
    intro: `cURL commands are the universal language of API documentation. Every API — Stripe, Twilio, GitHub, AWS — shows examples as curl commands. But most developers aren't using curl in production code. Converting those examples to your language of choice is a constant, repetitive task that a converter eliminates entirely.`,
    sections: [
      {
        heading: "Understanding cURL Command Anatomy",
        body: `-X METHOD: Specifies the HTTP method. -X POST, -X PUT, -X DELETE. GET is the default if omitted.\n\n-H "Header: Value": Adds a request header. Most common: -H "Authorization: Bearer token", -H "Content-Type: application/json".\n\n-d 'data': Sets the request body. For JSON APIs: -d '{"key":"value"}'. Use single quotes to avoid shell escaping issues.\n\n--data-urlencode: URL-encodes the data before sending — essential for form submissions.\n\n-u username:password: HTTP Basic Auth. Equivalent to setting the Authorization header manually.`,
      },
      {
        heading: "JavaScript: fetch vs axios",
        body: `The fetch API is built into modern browsers and Node.js 18+. No dependencies required. Error handling is verbose — fetch doesn't throw on non-2xx responses; you must check response.ok explicitly.\n\nAxios is a library that wraps fetch/XHR with better ergonomics: throws on non-2xx, automatic JSON parsing, request interceptors for adding auth headers globally, and better TypeScript support. For new projects, fetch with async/await is usually sufficient. For complex API clients with many endpoints, axios's interceptor system pays off.`,
      },
      {
        heading: "Python requests: The Gold Standard",
        body: `The requests library is the canonical Python HTTP client. Curl -X POST https://api.example.com -H "Authorization: Bearer token" -d '{"key":"value"}' -H "Content-Type: application/json" translates to:\n\nimport requests\nresponse = requests.post("https://api.example.com", headers={"Authorization": "Bearer token"}, json={"key": "value"})\n\nThe json= parameter automatically sets Content-Type: application/json and serializes the dict — cleaner than manually handling the body.`,
      },
    ],
    conclusion: `Every API integration starts with a curl example from the documentation. Converting it to your actual production language used to mean reading the docs for each HTTP client. The converter does it in one click, handling headers, authentication, and request bodies correctly for each target language.`,
    faqs: [
      { q: "What languages does the cURL converter support?", a: "JavaScript (fetch and axios), Python (requests), Go (net/http), Ruby (Net::HTTP), PHP (cURL), and more." },
      { q: "How does the converter handle authentication headers?", a: "Authorization headers (-H 'Authorization: Bearer token') are converted to the appropriate pattern for each language — headers dict in Python, headers object in JavaScript." },
      { q: "Does it handle multipart form data?", a: "Yes. curl -F field=value commands are converted to multipart/form-data requests in each target language." },
    ],
  },

  {
    slug: "yaml-to-json-converter",
    canonical: { name: "YAML ↔ JSON", path: "/yaml-json-converter", cta: "Convert YAML ↔ JSON →" },
    seo: {
      title: "YAML to JSON Converter Online — Bidirectional Format Conversion",
      h1: "YAML to JSON Converter: Instant Bidirectional Format Conversion",
      description: "Free online YAML to JSON and JSON to YAML converter. Handles nested objects, arrays, anchors, and multi-document YAML. Validates on conversion.",
      keywords: ["yaml to json converter online", "json to yaml converter", "yaml json conversion", "convert yaml to json", "yaml parser online"],
    },
    intro: `YAML and JSON are the two dominant serialization formats for configuration files, API payloads, and data exchange. YAML is human-readable and preferred for configuration (Kubernetes, GitHub Actions, Docker Compose, Ansible). JSON is machine-friendly and the universal API format. Converting between them is a daily occurrence for infrastructure engineers and backend developers.`,
    sections: [
      {
        heading: "YAML vs JSON: When to Use Which",
        body: `YAML for configuration: indentation-based structure, comments, multi-line strings, and aliases (anchors) make YAML ideal for files humans write and maintain. Any time you're configuring a system rather than transmitting data between services, YAML is the better choice.\n\nJSON for APIs: JSON's strict syntax (no comments, always quoted keys, no trailing commas) makes it predictable for machines. Every programming language can parse JSON without a specialized library. JSON is the default for REST APIs, GraphQL responses, and database documents.\n\nThe practical rule: if people write it, YAML. If programs generate and consume it, JSON.`,
      },
      {
        heading: "YAML Features That Don't Exist in JSON",
        body: `Anchors and aliases allow value reuse: &default_settings {timeout: 30} defines an anchor; *default_settings references it elsewhere. This eliminates repetition in complex configuration files.\n\nMulti-line strings: YAML's | and > operators handle multi-line string content cleanly — essential for embedding shell scripts, SQL queries, or long descriptions in configuration files.\n\nComments: YAML supports #-prefixed comments. JSON doesn't. This is the biggest usability difference for human-maintained files.\n\nType inference: YAML automatically types values — "true" becomes boolean, "42" becomes integer. This can bite you when you want the string "true" and get the boolean true instead.`,
      },
      {
        heading: "Common YAML Parsing Pitfalls",
        body: `The Norway Problem: YAML 1.1 parses NO, OFF, YES, ON as booleans. The most infamous example: country code "NO" (Norway) parsed as false. YAML 1.2 (used by most modern parsers) fixed this, but older tools still exhibit this behavior.\n\nIndentation: YAML is whitespace-sensitive. Mixing tabs and spaces causes parse errors. Using 2-space indentation consistently prevents most issues.\n\nSpecial characters in strings: Strings containing : or # must be quoted to avoid being interpreted as key-value separators or comment starts.`,
      },
    ],
    conclusion: `Converting between YAML and JSON is one of those minor but constant developer tasks. Whether you're transforming a Kubernetes manifest to debug it in a JSON tool, or converting an API response to paste into a YAML config, the converter handles the translation instantly with proper validation on both sides.`,
    faqs: [
      { q: "Does YAML support comments?", a: "Yes. YAML uses # for comments. JSON does not support comments (though JSONC — JSON with Comments — is supported by some tools like VS Code settings)." },
      { q: "What are YAML anchors?", a: "YAML anchors (&name) define a reusable value and aliases (*name) reference it. They reduce repetition in complex YAML files like Kubernetes multi-environment configs." },
      { q: "Why does YAML parse 'NO' as false?", a: "In YAML 1.1, YES/NO/ON/OFF are treated as boolean true/false. This is called 'The Norway Problem'. YAML 1.2 and modern parsers don't do this, but check which spec your tool uses." },
    ],
  },

];

/* ── Lookup helpers ────────────────────────────────────────────────────── */
export const PROBLEM_SLUGS = PROBLEMS.map(p => p.slug);

export function getProblem(slug: string): ProblemPage | undefined {
  return PROBLEMS.find(p => p.slug === slug);
}
