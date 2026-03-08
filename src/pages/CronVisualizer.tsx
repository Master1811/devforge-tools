import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { parseCron, PRESETS, checkCronSafety, naturalLanguageToCron } from "@/lib/tools/cronParser";
import { Clock, AlertTriangle, ArrowRight } from "lucide-react";

export default function CronVisualizerPage() {
  const [input, setInput] = useLocalStorage("devforge-cron-input", "* * * * *");
  const [nlInput, setNlInput] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const debounced = useDebounce(input, 200);
  const result = parseCron(debounced);
  const safety = checkCronSafety(debounced);

  const handleNlConvert = () => {
    const { cron, error } = naturalLanguageToCron(nlInput);
    if (cron && !error) setInput(cron);
  };

  const nlPreview = nlInput.trim() ? naturalLanguageToCron(nlInput) : null;

  const formatInTimezone = (date: Date) => {
    try {
      return date.toLocaleString("en-US", { timeZone: timezone, dateStyle: "medium", timeStyle: "medium" });
    } catch {
      return date.toLocaleString();
    }
  };

  const TIMEZONES = [
    "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone,
    "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "Europe/London", "Europe/Berlin", "Europe/Paris", "Asia/Tokyo", "Asia/Shanghai",
    "Asia/Kolkata", "Australia/Sydney",
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <ToolLayout
      title="Cron Expression Visualizer & Generator"
      slug="cron-visualizer"
      description="Visualize cron expressions in human-readable format. See next execution times instantly — free cron job visualizer."
      keywords={["cron expression generator", "cron job visualizer", "human readable cron", "cron to english", "natural language to cron"]}
      howToUse={["Enter a cron expression (5 fields) or use natural language.", "Read the human-readable description of your schedule.", "Review the next 10 execution times in your timezone."]}
      whatIs={{ title: "What is a Cron Expression?", content: "A cron expression is a string of five (or six) fields representing a schedule: minute, hour, day-of-month, month, and day-of-week. Cron jobs use these expressions to run tasks at specific intervals — from every minute to once a year. Each field supports wildcards (*), ranges (1-5), lists (1,3,5), and step values (*/15). Our cron expression generator converts these cryptic strings into plain English and shows you exactly when your job will run next. Understanding cron syntax is essential for scheduling backups, deployments, data processing, and maintenance tasks on Unix/Linux systems, Kubernetes, and CI/CD pipelines." }}
      faqs={[
        { q: "What do the 5 cron fields represent?", a: "From left to right: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, where 0 is Sunday)." },
        { q: "What does */15 mean in a cron expression?", a: "The */15 syntax means 'every 15 units.' In the minute field, */15 means every 15 minutes (0, 15, 30, 45)." },
        { q: "How do I schedule a job for weekdays only?", a: "Use 1-5 in the day-of-week field. For example, '0 9 * * 1-5' runs at 9:00 AM Monday through Friday." },
        { q: "Can I use natural language?", a: "Yes! Type something like 'every weekday at 9am' or 'every 15 minutes' and we'll convert it to a cron expression." },
        { q: "Why are my next run times different than expected?", a: "The next runs are calculated from your local system time. Use the timezone selector to view times in different zones." },
      ]}
      relatedTools={[
        { name: "RegEx Tester", path: "/regex-tester", description: "Test patterns for parsing log files from cron jobs." },
        { name: "cURL Converter", path: "/curl-converter", description: "Convert webhook curl commands triggered by cron." },
        { name: "Password Generator", path: "/password-generator", description: "Generate API keys for authenticated cron tasks." },
      ]}
    >
      <div className="space-y-6">
        {/* Natural Language Input */}
        <div className="p-4 rounded-lg bg-surface border border-border">
          <p className="text-xs font-mono text-muted-foreground mb-2">Natural Language → Cron</p>
          <div className="flex gap-2">
            <input
              value={nlInput}
              onChange={e => setNlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleNlConvert()}
              className="flex-1 bg-surface2 border border-border rounded-lg px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder='Try "every weekday at 9am" or "every 15 minutes"'
              spellCheck={false}
            />
            <button onClick={handleNlConvert} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4" /> Convert
            </button>
          </div>
          {nlPreview?.cron && (
            <p className="mt-2 text-xs font-mono text-accent">→ {nlPreview.cron}</p>
          )}
          {nlPreview?.error && (
            <p className="mt-2 text-xs font-mono text-destructive">{nlPreview.error}</p>
          )}
        </div>

        {/* Cron Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="* * * * *"
            spellCheck={false}
          />
          <select value={timezone} onChange={e => setTimezone(e.target.value)} className="bg-surface border border-border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        {/* Field labels */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {["Minute", "Hour", "Day (Month)", "Month", "Day (Week)"].map((label, i) => {
            const parts = input.trim().split(/\s+/);
            return (
              <div key={label} className="rounded-lg bg-surface border border-border p-2">
                <p className="text-[10px] font-mono text-muted-foreground">{label}</p>
                <p className="font-mono text-lg text-primary font-bold">{parts[i] || "*"}</p>
              </div>
            );
          })}
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.value} onClick={() => setInput(p.value)} className="px-3 py-1.5 rounded-full text-xs font-mono bg-surface2 border border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground">
              {p.label}
            </button>
          ))}
        </div>

        {/* Safety Check */}
        {safety.level !== "safe" && (
          <div className={`p-3 rounded-lg text-sm font-mono flex items-start gap-2 border ${
            safety.level === "danger" ? "bg-destructive/10 border-destructive/30 text-destructive" :
            "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {safety.message}
          </div>
        )}
        {safety.level === "safe" && debounced.trim() && !result.error && (
          <div className="p-3 rounded-lg text-sm font-mono bg-accent/10 border border-accent/30 text-accent">
            {safety.message}
          </div>
        )}

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
                <p className="text-xs font-mono text-muted-foreground mb-3">Next 10 Runs ({timezone})</p>
                {/* Timeline visualization */}
                <div className="space-y-0">
                  {result.nextRuns.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${i === 0 ? "bg-primary border-primary" : "bg-transparent border-border group-hover:border-primary/50"} transition-colors`} />
                        {i < result.nextRuns.length - 1 && <div className="w-0.5 h-6 bg-border" />}
                      </div>
                      <div className="flex-1 py-1.5">
                        <div className="font-mono text-sm flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatInTimezone(d)}
                          {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">next</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
