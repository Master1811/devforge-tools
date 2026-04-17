import { Target, Flame, TrendingUp, BarChart3, Calculator, Zap, type LucideIcon } from "lucide-react";

export type FinanceToolStage = "start" | "understand" | "plan";
export type FinanceToolStatus = "live" | "coming_soon";

export interface FinanceToolDefinition {
  id: string;
  name: string;
  description: string;
  previewDescription: string;
  path: string;
  icon: LucideIcon;
  stage: FinanceToolStage;
  status: FinanceToolStatus;
  primaryNextToolId?: string;
  secondaryNextToolIds?: string[];
}

export const FINANCE_TOOLS: FinanceToolDefinition[] = [
  {
    id: "arr",
    name: "ARR / MRR Calculator",
    description: "Break revenue into new, expansion, and churn to understand growth quality.",
    previewDescription: "Measure recurring revenue quality and momentum.",
    path: "/tools/finance/arr-calculator",
    icon: TrendingUp,
    stage: "start",
    status: "live",
    primaryNextToolId: "growth-rate",
    secondaryNextToolIds: ["runway", "100cr"],
  },
  {
    id: "growth-rate",
    name: "Growth Rate Calculator",
    description: "See how fast your revenue is compounding and what pace gets you to targets.",
    previewDescription: "Understand how quickly your business is actually growing.",
    path: "/tools/finance/growth-rate-calculator",
    icon: BarChart3,
    stage: "start",
    status: "live",
    primaryNextToolId: "runway",
    secondaryNextToolIds: ["100cr", "arr"],
  },
  {
    id: "runway",
    name: "Runway Calculator",
    description: "Calculate how long your cash lasts and when you hit break-even.",
    previewDescription: "Calculate how long your money lasts at current burn.",
    path: "/tools/finance/runway-calculator",
    icon: Flame,
    stage: "understand",
    status: "live",
    primaryNextToolId: "100cr",
    secondaryNextToolIds: ["burn-rate", "growth-rate"],
  },
  {
    id: "100cr",
    name: "₹100Cr Journey Calculator",
    description: "Model your path to ₹100Cr ARR with growth, burn, and milestone context.",
    previewDescription: "Plan your path from today to ₹100Cr ARR.",
    path: "/tools/finance/100cr-calculator",
    icon: Target,
    stage: "understand",
    status: "live",
    primaryNextToolId: "runway",
    secondaryNextToolIds: ["growth-rate", "burn-rate", "arr"],
  },
  {
    id: "burn-rate",
    name: "Burn Rate Calculator",
    description: "Understand your spending by category and your capital efficiency.",
    previewDescription: "Understand exactly where your monthly cash is going.",
    path: "/tools/finance/burn-rate-calculator",
    icon: Calculator,
    stage: "understand",
    status: "live",
    primaryNextToolId: "runway",
    secondaryNextToolIds: ["fundraising-readiness", "scenario-simulation"],
  },
  {
    id: "fundraising-readiness",
    name: "Fundraising Readiness",
    description: "Check if your metrics are strong enough to start a raise.",
    previewDescription: "See if your current metrics are investor-ready.",
    path: "/tools/finance/fundraising-readiness",
    icon: Target,
    stage: "plan",
    status: "coming_soon",
    primaryNextToolId: "scenario-simulation",
  },
  {
    id: "scenario-simulation",
    name: "Scenario Simulation",
    description: "Compare best/base/worst-case plans for growth and cash runway.",
    previewDescription: "Stress-test growth plans across multiple business scenarios.",
    path: "/tools/finance/scenario-simulation",
    icon: Zap,
    stage: "plan",
    status: "coming_soon",
  },
];

export const FINANCE_TOOL_MAP = Object.fromEntries(FINANCE_TOOLS.map((tool) => [tool.id, tool])) as Record<
  string,
  FinanceToolDefinition
>;

export function getFinanceToolById(id: string) {
  return FINANCE_TOOL_MAP[id];
}

export function getJourneyRecommendations(toolId: string, max = 4): FinanceToolDefinition[] {
  const source = getFinanceToolById(toolId);
  if (!source) return FINANCE_TOOLS.filter((t) => t.status === "live").slice(0, max);

  const orderedIds = [source.primaryNextToolId, ...(source.secondaryNextToolIds ?? [])].filter(Boolean) as string[];
  const picked = orderedIds
    .map((id) => getFinanceToolById(id))
    .filter((tool): tool is FinanceToolDefinition => Boolean(tool) && tool.status === "live" && tool.id !== toolId);

  const fallback = FINANCE_TOOLS.filter((tool) => tool.status === "live" && tool.id !== toolId);
  const deduped = [...picked, ...fallback.filter((tool) => !picked.some((p) => p.id === tool.id))];
  return deduped.slice(0, max);
}

export const FINANCE_HUB_SECTIONS: Array<{ title: string; stage: FinanceToolStage; subtitle: string }> = [
  {
    title: "Start Here",
    stage: "start",
    subtitle: "Beginner-friendly tools to understand baseline growth and revenue health.",
  },
  {
    title: "Understand Your Business",
    stage: "understand",
    subtitle: "Core metrics that explain cash, burn, runway, and operating strength.",
  },
  {
    title: "Plan Growth",
    stage: "plan",
    subtitle: "Advanced planning tools for fundraising and scenario-driven decision making.",
  },
];
