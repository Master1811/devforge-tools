# Finance Tool UI/UX Consistency Checklist

Every finance tool must pass all items before shipping.
Run this check against the ₹100Cr Journey Calculator as the canonical reference.

---

## 1. Architecture

- [ ] Uses `FinanceToolLayout` as the outer wrapper (not raw `ToolLayout` directly)
- [ ] Calculator engine is a pure function in `src/lib/tools/finance/{toolName}.ts`
- [ ] Engine returns a type that extends `InsightEngineData`
- [ ] State managed via `useClientScenarioSync<T>` with a unique `toolKey`
- [ ] Route file at `src/app/tools/finance/{tool-name}/page.tsx` with full metadata
- [ ] Page component at `src/page-components/finance/{ToolName}.tsx`
- [ ] Tool registered in `src/lib/tools/registry.ts` with `tag: "finance"`

---

## 2. Layout & Structure

- [ ] Exactly 4 summary metric cards in the `summaryCards` array
- [ ] Left column: inputs wrapped in `FinanceInputRow` components
- [ ] Right column: at minimum one `FinanceChart` component
- [ ] Insight Engine rendered at full width at the bottom (handled by `FinanceToolLayout`)
- [ ] Scenario manager rendered below the inputs panel
- [ ] Finance privacy banner shows (not the dev SQL banner)

---

## 3. Input Components

- [ ] All sliders use `FinanceInputRow` — no custom slider implementations
- [ ] Each input has: label, value, min, max, step, unit, prefix (if ₹), description
- [ ] Descriptions are human-readable (e.g. "Total monthly expenses (all-in)")
- [ ] Numeric inputs clamp to [min, max] on manual entry
- [ ] State patched via `patchInput(key, value)` — not full `setInputs` calls

---

## 4. Metric Cards

- [ ] Uses `FinanceMetricCard` — no custom card implementations
- [ ] `accent` prop set correctly: `green` (good), `yellow` (warning), `red` (critical), `blue` (info)
- [ ] `sub` text provides context/interpretation (not just units)
- [ ] All 4 cards visible on mobile (2×2 grid)

---

## 5. Charts

- [ ] Uses `FinanceChart` — no custom Recharts implementations
- [ ] `colorVar` matches design system: `primary` (blue), `accent` (green), `destructive` (red), `yellow`
- [ ] Reference lines added for key thresholds (e.g. ₹100Cr target, runway end)
- [ ] `yTickFormatter` formats values in Indian units (₹Cr, ₹L)
- [ ] Height ≥ 160px, ≤ 300px
- [ ] Chart title uses uppercase monospace label

---

## 6. Insight Engine

- [ ] `benchmarks` array has exactly 4 items
- [ ] Each benchmark has: metric, yourValue, unit, topQuartile, median, bottomQuartile, level, context
- [ ] `actions` array has 2–4 items (never 0, never more than 4)
- [ ] `overallScore` is 0–100
- [ ] `overallLevel` is one of the 5 `InsightLevel` values
- [ ] `subline` is set on the result to give context-specific interpretation
- [ ] Benchmark `context` strings are ≤ 60 characters

---

## 7. Scenario System

- [ ] Share button copies shareable URL to clipboard with success feedback
- [ ] Save creates a named scenario in localStorage
- [ ] Load restores inputs and syncs to URL
- [ ] Delete removes from localStorage
- [ ] Reset returns to default inputs
- [ ] URL state survives page refresh (test by reloading after changing inputs)
- [ ] Scenarios namespaced by `toolKey` — no cross-tool contamination

---

## 8. SEO & Metadata

- [ ] Page `<title>` includes primary keyword + "| DevForge"
- [ ] `description` meta is 130–160 characters
- [ ] 5–10 `keywords` targeting Indian SaaS + generic search intent
- [ ] `og:url` and `alternates.canonical` set to absolute URL
- [ ] `ToolLayout` `howToUse` has 4–7 steps
- [ ] `faqs` has 4–6 items with substantive answers (>50 words each)
- [ ] `relatedTools` links to exactly 3 other finance tools (internal linking)
- [ ] `whatIs` section is ≥ 100 words

---

## 9. Typography & Spacing

- [ ] Section labels use: `text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest`
- [ ] Metric values use: `text-2xl font-bold tabular-nums`
- [ ] Input labels use: `text-[13px] font-medium`
- [ ] Input descriptions use: `text-[11px] text-muted-foreground/50`
- [ ] Panel background: `bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm rounded-xl`
- [ ] Outer padding: `p-4 sm:p-6` on the FinanceToolLayout container
- [ ] Inner panel padding: `p-5`
- [ ] Gap between panels: `gap-6`

---

## 10. Performance

- [ ] All heavy calculations wrapped in `useMemo([inputs])`
- [ ] No calculations in render functions
- [ ] Chart data downsampled to ≤ 25 data points (every 3–6 months)
- [ ] No `useEffect` for calculation — only `useMemo`
- [ ] `useClientScenarioSync` debounceMs ≤ 300ms

---

## 11. Mobile Responsiveness

- [ ] Summary cards: `grid-cols-2 sm:grid-cols-4` (2×2 on mobile)
- [ ] Layout: single column on mobile (`lg:grid-cols-[2fr_3fr]`)
- [ ] Chart renders correctly at 320px viewport width
- [ ] No horizontal overflow on mobile

---

## Canonical Reference Tool

When in doubt, check: `src/page-components/finance/RunwayCalculator.tsx`
This file uses all shared components and follows the full pattern.

---

*Last updated: 2026-04-17*
