import { PieChart, Palette, Globe2, Sliders, type LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "simulators" — multi-variable sliders with live chart output
 * "playgrounds" — visual creative tools (CSS, design, preview)
 */
export type InteractiveToolStage = "simulators" | "playgrounds";
export type InteractiveToolStatus = "live" | "coming_soon";

export interface InteractiveToolDefinition {
  id: string;
  name: string;
  description: string;
  previewDescription: string;
  path: string;
  icon: LucideIcon;
  stage: InteractiveToolStage;
  status: InteractiveToolStatus;
  /** Why sliders/visuals make this tool irreplaceable by an LLM */
  aiDefenseReason: string;
  /**
   * Finance tools this tool naturally feeds into.
   * Used to build the "Use this with" cross-nav funnel.
   */
  financeNextTools: Array<{
    id: string;          // Finance tool registry id (for linking)
    name: string;
    description: string; // Context sentence shown in the CTA
    path: string;
    accentColor: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL DEFINITIONS — Pure interactive tools only. No Finance tools here.
// ─────────────────────────────────────────────────────────────────────────────

export const INTERACTIVE_TOOLS: InteractiveToolDefinition[] = [
  {
    id: "cap-table",
    name: "Cap Table Simulator",
    description:
      "Simulate equity dilution across funding rounds. Drag sliders to see how ESOP pools, SAFEs, and Series A terms reshape founder ownership in real time.",
    previewDescription: "Model dilution and ownership across your funding journey.",
    path: "/tools/interactive/cap-table",
    icon: PieChart,
    stage: "simulators",
    status: "live",
    aiDefenseReason: "Real-time pie chart and dilution waterfall — sliders only",
    financeNextTools: [
      {
        id: "runway",
        name: "Runway Calculator",
        description: "Now calculate how long your cash actually lasts after this round.",
        path: "/tools/finance/runway-calculator",
        accentColor: "#10B981",
      },
      {
        id: "100cr",
        name: "₹100Cr Journey",
        description: "Map the growth path that makes this equity worth something.",
        path: "/tools/finance/100cr-calculator",
        accentColor: "#0EA5E9",
      },
    ],
  },
  {
    id: "growth-simulator",
    name: "Growth Scenario Simulator",
    description:
      "Drag sliders to model MoM growth, churn, and expansion revenue. Watch your ARR trajectory update live across best, base, and worst-case scenarios.",
    previewDescription: "Stress-test growth plans across multiple scenarios.",
    path: "/tools/interactive/growth-simulator",
    icon: Sliders,
    stage: "simulators",
    status: "live",
    aiDefenseReason: "9 live sliders across 3 scenarios — Recharts AreaChart redraws on every change",
    financeNextTools: [
      {
        id: "arr",
        name: "ARR / MRR Calculator",
        description: "Now decompose your MRR into new, expansion, and churned revenue.",
        path: "/tools/finance/arr-calculator",
        accentColor: "#10B981",
      },
      {
        id: "growth-rate",
        name: "Growth Rate Calculator",
        description: "Validate your MoM assumptions with CAGR and T2D3 benchmarks.",
        path: "/tools/finance/growth-rate-calculator",
        accentColor: "#059669",
      },
    ],
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism Playground",
    description:
      "Design glassmorphism UI components live. Tune blur, opacity, borders, and gradients with instant CSS export. What you drag is exactly what you get.",
    previewDescription: "Generate glassmorphism CSS visually.",
    path: "/tools/interactive/glassmorphism",
    icon: Palette,
    stage: "playgrounds",
    status: "coming_soon",
    aiDefenseReason: "Live CSS preview with drag-to-adjust visual handles",
    financeNextTools: [],
  },
  {
    id: "og-preview",
    name: "Open Graph Preview",
    description:
      "Preview how your URLs render on Twitter, LinkedIn, and Slack. Edit OG tags and see live card renders across all platforms side-by-side.",
    previewDescription: "See your social share cards before you ship.",
    path: "/tools/interactive/og-preview",
    icon: Globe2,
    stage: "playgrounds",
    status: "coming_soon",
    aiDefenseReason: "Real-time platform card previews require visual rendering",
    financeNextTools: [],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUPS
// ─────────────────────────────────────────────────────────────────────────────

export const INTERACTIVE_TOOL_MAP = Object.fromEntries(
  INTERACTIVE_TOOLS.map((t) => [t.id, t]),
) as Record<string, InteractiveToolDefinition>;

export function getInteractiveToolById(id: string) {
  return INTERACTIVE_TOOL_MAP[id];
}

// ─────────────────────────────────────────────────────────────────────────────
// HUB SECTIONS — Two pure sections, no Finance tools embedded
// ─────────────────────────────────────────────────────────────────────────────

export const INTERACTIVE_HUB_SECTIONS: Array<{
  id: string;
  title: string;
  stage: InteractiveToolStage;
  subtitle: string;
  accentColor: string;
}> = [
  {
    id: "simulators",
    title: "Visual Simulators",
    stage: "simulators",
    subtitle:
      "Move sliders. Watch numbers change instantly. Build intuition you can't get from a spreadsheet.",
    accentColor: "#8B5CF6",
  },
  {
    id: "playgrounds",
    title: "Design Playgrounds",
    stage: "playgrounds",
    subtitle: "Visual creative tools for builders. What you drag is exactly what you ship.",
    accentColor: "#7C3AED",
  },
];
