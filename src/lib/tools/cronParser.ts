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

  // Calculate next 5 runs
  const nextRuns: Date[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);

  const minVals = parseField(minute, 59);
  const hourVals = parseField(hour, 23);
  const domVals = parseField(dom, 31);
  const dowVals = parseField(dow, 6);

  for (let i = 0; i < 1440 * 60 && nextRuns.length < 5; i++) {
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

export const PRESETS: { label: string; value: string }[] = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Every weekday 9am", value: "0 9 * * 1-5" },
  { label: "Every Monday", value: "0 9 * * 1" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Monthly (1st)", value: "0 0 1 * *" },
];
