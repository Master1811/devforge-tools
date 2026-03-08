import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// ─── Custom Metrics ──────────────────────────────────────
const errorRate = new Rate("errors");
const toolLoadTime = new Trend("tool_load_time", true);

// ─── Configuration ───────────────────────────────────────
const BASE_URL = __ENV.BASE_URL || "http://localhost:4173";
const SINGLE_TOOL = __ENV.TOOL || null; // e.g. "jwt-decoder"

const TOOLS = [
  { slug: "jwt-decoder", name: "JWT Decoder" },
  { slug: "json-to-typescript", name: "JSON to TypeScript" },
  { slug: "sql-formatter", name: "SQL Formatter" },
  { slug: "cron-visualizer", name: "Cron Visualizer" },
  { slug: "regex-tester", name: "RegEx Tester" },
  { slug: "base64-encoder", name: "Base64 Encoder" },
  { slug: "curl-converter", name: "cURL Converter" },
  { slug: "yaml-json-converter", name: "YAML ↔ JSON" },
  { slug: "markdown-previewer", name: "Markdown Previewer" },
  { slug: "password-generator", name: "Password Generator" },
];

const activeTools = SINGLE_TOOL
  ? TOOLS.filter((t) => t.slug === SINGLE_TOOL)
  : TOOLS;

// ─── K6 Options ──────────────────────────────────────────
// Ramp to 10,000 VUs over 1 minute, sustain for 2 minutes,
// then ramp down over 30 seconds.
export const options = {
  stages: [
    { duration: "30s", target: 1000 },   // warm-up
    { duration: "30s", target: 5000 },   // ramp to half
    { duration: "1m", target: 10000 },   // full load
    { duration: "2m", target: 10000 },   // sustain
    { duration: "30s", target: 0 },      // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],     // 95% of requests < 500ms
    http_req_failed: ["rate<0.01"],       // < 1% errors
    errors: ["rate<0.01"],
  },
};

// ─── Test Logic ──────────────────────────────────────────
export default function () {
  // 1. Load homepage
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    "homepage status 200": (r) => r.status === 200,
    "homepage has title": (r) => r.body && r.body.includes("DevForge"),
  }) || errorRate.add(1);

  sleep(0.5);

  // 2. Load a random tool page
  const tool = activeTools[Math.floor(Math.random() * activeTools.length)];
  const toolStart = Date.now();
  const toolRes = http.get(`${BASE_URL}/${tool.slug}`);
  const toolDuration = Date.now() - toolStart;

  toolLoadTime.add(toolDuration);

  check(toolRes, {
    [`${tool.name} status 200`]: (r) => r.status === 200,
    [`${tool.name} has content`]: (r) => r.body && r.body.length > 500,
  }) || errorRate.add(1);

  sleep(0.5);

  // 3. Load sitemap
  const sitemapRes = http.get(`${BASE_URL}/sitemap.xml`);
  check(sitemapRes, {
    "sitemap status 200": (r) => r.status === 200,
    "sitemap has urls": (r) => r.body && r.body.includes("<url>"),
  }) || errorRate.add(1);

  // 4. Load robots.txt
  const robotsRes = http.get(`${BASE_URL}/robots.txt`);
  check(robotsRes, {
    "robots.txt status 200": (r) => r.status === 200,
  }) || errorRate.add(1);

  // Simulate user think time
  sleep(Math.random() * 2 + 1);
}

// ─── Summary ─────────────────────────────────────────────
export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration
    ? data.metrics.http_req_duration.values["p(95)"]
    : "N/A";
  const errRate = data.metrics.errors
    ? data.metrics.errors.values.rate
    : "N/A";
  const totalReqs = data.metrics.http_reqs
    ? data.metrics.http_reqs.values.count
    : "N/A";

  console.log("\n════════════════════════════════════════");
  console.log("  DevForge Load Test Summary");
  console.log("════════════════════════════════════════");
  console.log(`  Total Requests:    ${totalReqs}`);
  console.log(`  P95 Latency:       ${typeof p95 === "number" ? p95.toFixed(1) : p95}ms`);
  console.log(`  Error Rate:        ${typeof errRate === "number" ? (errRate * 100).toFixed(2) : errRate}%`);
  console.log(`  Tools Tested:      ${activeTools.map((t) => t.slug).join(", ")}`);
  console.log("════════════════════════════════════════\n");

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
