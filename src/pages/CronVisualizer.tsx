import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { parseCron, PRESETS } from "@/lib/tools/cronParser";

export default function CronVisualizerPage() {
  const [input, setInput] = useLocalStorage("devforge-cron-input", "* * * * *");
  const debounced = useDebounce(input, 200);
  const result = parseCron(debounced);

  return (
    <ToolLayout
      title="Cron Expression Visualizer & Generator"
      slug="cron-visualizer"
      description="Visualize cron expressions in human-readable format. See next execution times instantly — free cron job visualizer."
      keywords={["cron expression generator", "cron job visualizer", "human readable cron", "cron to english"]}
      howToUse={["Enter a cron expression (5 fields) or click a preset.", "Read the human-readable description of your schedule.", "Review the next 5 execution times calculated from now."]}
      whatIs={{ title: "What is a Cron Expression?", content: "A cron expression is a string of five (or six) fields representing a schedule: minute, hour, day-of-month, month, and day-of-week. Cron jobs use these expressions to run tasks at specific intervals — from every minute to once a year. Each field supports wildcards (*), ranges (1-5), lists (1,3,5), and step values (*/15). Our cron expression generator converts these cryptic strings into plain English and shows you exactly when your job will run next. Understanding cron syntax is essential for scheduling backups, deployments, data processing, and maintenance tasks on Unix/Linux systems, Kubernetes, and CI/CD pipelines." }}
      faqs={[
        { q: "What do the 5 cron fields represent?", a: "From left to right: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, where 0 is Sunday)." },
        { q: "What does */15 mean in a cron expression?", a: "The */15 syntax means 'every 15 units.' In the minute field, */15 means every 15 minutes (0, 15, 30, 45)." },
        { q: "How do I schedule a job for weekdays only?", a: "Use 1-5 in the day-of-week field. For example, '0 9 * * 1-5' runs at 9:00 AM Monday through Friday." },
        { q: "Is there a 6-field cron format?", a: "Yes, some systems add a seconds field at the beginning. This tool primarily handles the standard 5-field format." },
        { q: "Why are my next run times different than expected?", a: "The next runs are calculated from your local system time. Ensure your system clock is correct. Remember cron uses 24-hour time format." },
      ]}
      relatedTools={[
        { name: "RegEx Tester", path: "/regex-tester", description: "Test patterns for parsing log files from cron jobs." },
        { name: "cURL Converter", path: "/curl-converter", description: "Convert webhook curl commands triggered by cron." },
        { name: "Password Generator", path: "/password-generator", description: "Generate API keys for authenticated cron tasks." },
      ]}
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="* * * * *"
            spellCheck={false}
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.value} onClick={() => setInput(p.value)} className="px-3 py-1.5 rounded-full text-xs font-mono bg-surface2 border border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground">
              {p.label}
            </button>
          ))}
        </div>

        {/* Result */}
        {result.error ? (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive font-mono text-sm">{result.error}</div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-surface border border-border">
              <p className="text-xs font-mono text-muted-foreground mb-2">Schedule</p>
              <p className="text-2xl font-display font-bold">{result.sentence}</p>
            </div>
            {result.nextRuns.length > 0 && (
              <div className="p-4 rounded-lg bg-surface border border-border">
                <p className="text-xs font-mono text-muted-foreground mb-3">Next 5 Runs</p>
                <ul className="space-y-2">
                  {result.nextRuns.map((d, i) => (
                    <li key={i} className="font-mono text-sm flex items-center gap-2">
                      <span className="text-primary">{i + 1}.</span>
                      {d.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
