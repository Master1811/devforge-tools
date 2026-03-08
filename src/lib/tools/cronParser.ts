const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function parseField(field: string, max: number): number[] {
  if (field === "*") return [];
  const results: number[] = [];
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      const [range, step] = part.split("/");
      const s = parseInt(step);
      const start = range === "*" ? 0 : parseInt(range);
      for (let i = start; i <= max; i += s) results.push(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) results.push(i);
    } else {
      results.push(parseInt(part));
    }
  }
  return results;
}

function fieldToEnglish(field: string, names?: string[]): string {
  if (field === "*") return "every";
  if (field.startsWith("*/")) return `every ${field.slice(2)}`;
  if (field.includes(",")) {
    const parts = field.split(",").map(p => names ? names[parseInt(p)] || p : p);
    return parts.join(" and ");
  }
  if (field.includes("-")) {
    const [a, b] = field.split("-");
    const na = names ? names[parseInt(a)] || a : a;
    const nb = names ? names[parseInt(b)] || b : b;
    return `${na} through ${nb}`;
  }
  return names ? names[parseInt(field)] || field : field;
}

export function parseCron(expression: string): { sentence: string; nextRuns: Date[]; error?: string } {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return { sentence: "", nextRuns: [], error: "Expected 5 or 6 fields" };

  const [minute, hour, dom, month, dow] = parts;
  const segments: string[] = [];

  if (minute !== "*" && hour !== "*") {
    const h = parseInt(hour);
    const m = parseInt(minute);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    segments.push(`At ${h12}:${m.toString().padStart(2, "0")} ${ampm}`);
  } else if (minute.startsWith("*/")) {
    segments.push(`Every ${minute.slice(2)} minutes`);
  } else if (hour.startsWith("*/")) {
    segments.push(`Every ${hour.slice(2)} hours`);
  } else {
    if (minute !== "*") segments.push(`At minute ${minute}`);
    if (hour !== "*") segments.push(`at hour ${hour}`);
  }

  if (dow !== "*") segments.push(`on ${fieldToEnglish(dow, DAYS)}`);
  if (dom !== "*") segments.push(`on day ${fieldToEnglish(dom)} of the month`);
  if (month !== "*") segments.push(`in ${fieldToEnglish(month, MONTHS)}`);

  const sentence = segments.join(", ") || "Every minute";

  // Calculate next 10 runs
  const nextRuns: Date[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);

  const minVals = parseField(minute, 59);
  const hourVals = parseField(hour, 23);
  const domVals = parseField(dom, 31);
  const dowVals = parseField(dow, 6);

  for (let i = 0; i < 1440 * 60 && nextRuns.length < 10; i++) {
    d.setMinutes(d.getMinutes() + 1);
    const matches =
      (minVals.length === 0 || minVals.includes(d.getMinutes())) &&
      (hourVals.length === 0 || hourVals.includes(d.getHours())) &&
      (domVals.length === 0 || domVals.includes(d.getDate())) &&
      (dowVals.length === 0 || dowVals.includes(d.getDay()));
    if (matches) nextRuns.push(new Date(d));
  }

  return { sentence, nextRuns };
}

export interface CronSafety {
  safe: boolean;
  level: "safe" | "caution" | "danger";
  message: string;
}

export function checkCronSafety(expression: string): CronSafety {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5) return { safe: true, level: "safe", message: "" };
  const [minute, hour, dom, , dow] = parts;
  
  if (minute === "*" && hour === "*" && dom === "*" && dow === "*") {
    return { safe: false, level: "danger", message: "⚠️ Runs every minute! This will execute 1,440 times/day. Are you sure?" };
  }
  if (minute.startsWith("*/") && parseInt(minute.slice(2)) <= 1) {
    return { safe: false, level: "danger", message: "⚠️ Runs every minute. Consider a longer interval." };
  }
  if (minute === "*" && hour !== "*") {
    return { safe: false, level: "caution", message: "⚡ Runs every minute during specified hour(s). Consider adding a minute interval." };
  }
  if (minute.startsWith("*/") && parseInt(minute.slice(2)) <= 5) {
    return { safe: false, level: "caution", message: "⚡ Runs very frequently (every ≤5 min). Make sure your task can handle this load." };
  }
  return { safe: true, level: "safe", message: "✅ Schedule looks reasonable." };
}

const NL_PATTERNS: { pattern: RegExp; cron: string }[] = [
  { pattern: /^every\s+minute$/i, cron: "* * * * *" },
  { pattern: /^every\s+hour$/i, cron: "0 * * * *" },
  { pattern: /^every\s+(\d+)\s+minutes?$/i, cron: "*/{1} * * * *" },
  { pattern: /^every\s+(\d+)\s+hours?$/i, cron: "0 */{1} * * *" },
  { pattern: /^daily\s+at\s+midnight$/i, cron: "0 0 * * *" },
  { pattern: /^daily\s+at\s+noon$/i, cron: "0 12 * * *" },
  { pattern: /^every\s+day\s+at\s+(\d{1,2})\s*(am|pm)?$/i, cron: "0 {h} * * *" },
  { pattern: /^every\s+weekday\s+at\s+(\d{1,2})\s*(am|pm)?$/i, cron: "0 {h} * * 1-5" },
  { pattern: /^every\s+monday$/i, cron: "0 9 * * 1" },
  { pattern: /^every\s+tuesday$/i, cron: "0 9 * * 2" },
  { pattern: /^every\s+wednesday$/i, cron: "0 9 * * 3" },
  { pattern: /^every\s+thursday$/i, cron: "0 9 * * 4" },
  { pattern: /^every\s+friday$/i, cron: "0 9 * * 5" },
  { pattern: /^every\s+saturday$/i, cron: "0 9 * * 6" },
  { pattern: /^every\s+sunday$/i, cron: "0 9 * * 0" },
  { pattern: /^monthly$/i, cron: "0 0 1 * *" },
  { pattern: /^weekly$/i, cron: "0 0 * * 0" },
  { pattern: /^yearly$/i, cron: "0 0 1 1 *" },
  { pattern: /^every\s+monday\s+at\s+(\d{1,2})\s*(am|pm)?$/i, cron: "0 {h} * * 1" },
  { pattern: /^every\s+friday\s+at\s+(\d{1,2})\s*(am|pm)?$/i, cron: "0 {h} * * 5" },
];

export function naturalLanguageToCron(text: string): { cron: string; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) return { cron: "", error: "Enter a schedule description" };
  
  for (const { pattern, cron } of NL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      let result = cron;
      if (result.includes("{1}")) {
        result = result.replace("{1}", match[1]);
      }
      if (result.includes("{h}")) {
        let h = parseInt(match[1]);
        const ampm = match[2]?.toLowerCase();
        if (ampm === "pm" && h < 12) h += 12;
        if (ampm === "am" && h === 12) h = 0;
        result = result.replace("{h}", String(h));
      }
      return { cron: result };
    }
  }
  return { cron: "", error: `Could not parse: "${trimmed}". Try "every 5 minutes", "daily at 9am", "every weekday at 3pm"` };
}

export const PRESETS: { label: string; value: string }[] = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Every weekday 9am", value: "0 9 * * 1-5" },
  { label: "Every Monday", value: "0 9 * * 1" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Monthly (1st)", value: "0 0 1 * *" },
];
