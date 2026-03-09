import type { Metadata } from "next";
import CronVisualizerPage from "@/page-components/CronVisualizer";

export const metadata: Metadata = {
  title: "Cron Expression Visualizer & Parser",
  description: "Parse and visualize cron expressions. See next run times and convert to human-readable format. Free online cron parser.",
  keywords: ["cron expression", "cron parser", "cron visualizer", "crontab generator"],
  openGraph: {
    title: "Cron Expression Visualizer & Parser | DevForge",
    description: "Parse and visualize cron expressions. Free online cron parser.",
    url: "https://devforge.tools/cron-visualizer",
  },
  alternates: {
    canonical: "https://devforge.tools/cron-visualizer",
  },
};

export default function Page() {
  return <CronVisualizerPage />;
}

