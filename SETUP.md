# DevForge — Developer Setup Guide

> **Single source of truth** for onboarding onto the DevForge developer tools platform.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone & Install](#2-clone--install)
3. [Project Architecture](#3-project-architecture)
4. [Running the Dev Server](#4-running-the-dev-server)
5. [Tech Stack Overview](#5-tech-stack-overview)
6. [Design System & Tokens](#6-design-system--tokens)
7. [Adding a New Tool](#7-adding-a-new-tool)
8. [Ad System](#8-ad-system)
9. [SEO Checklist](#9-seo-checklist)
10. [Testing](#10-testing)
11. [K6 Load Testing (10,000 Concurrent Users)](#11-k6-load-testing-10000-concurrent-users)
12. [Deployment](#12-deployment)
13. [Environment Variables](#13-environment-variables)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Prerequisites

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |
| Git | 2.30+ | `git --version` |
| K6 (optional, for load tests) | 0.47+ | `k6 version` |

> ⚠️ **CRITICAL**: Do **not** use Node 16 or below. Vite 5 requires Node 18+.

---

## 2. Clone & Install

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>
cd devforge

# Step 2: Install dependencies
npm install

# Step 3: Verify the install succeeded
npm run build
```

> ⚠️ **WARNING**: If you see `ERESOLVE` peer dependency errors, run:
> ```bash
> npm install --legacy-peer-deps
> ```

---

## 3. Project Architecture

```
devforge/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── ads/
│   │   │   └── AdContainer.tsx        # Reusable ad placement (4 types)
│   │   ├── shared/
│   │   │   ├── CodePanel.tsx           # Input/output panel with copy, clear, counts
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ToolCard.tsx            # Homepage grid card
│   │   │   └── ToolLayout.tsx          # Shared wrapper for all tool pages
│   │   └── ui/                         # shadcn primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── container-scroll-animation.tsx
│   │       ├── shader-animation.tsx
│   │       └── ...
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── utils.ts                    # cn() utility
│   │   └── tools/                      # Pure JS logic — one file per tool
│   │       ├── jwt.ts
│   │       ├── jsonToTs.ts
│   │       ├── sqlFormatter.ts
│   │       ├── cronParser.ts
│   │       ├── base64.ts
│   │       ├── curlConverter.ts
│   │       ├── yamlJson.ts
│   │       ├── markdown.ts
│   │       └── passwordGen.ts
│   ├── pages/                          # One page per tool + Index + 404
│   │   ├── Index.tsx
│   │   ├── JWTDecoder.tsx
│   │   ├── JsonToTypescript.tsx
│   │   └── ...
│   ├── App.tsx                         # Router with lazy-loaded routes
│   ├── index.css                       # Tailwind base + design tokens
│   └── main.tsx
├── k6/                                 # Load testing scripts
│   └── load-test.js
├── SETUP.md                            # ← You are here
├── tailwind.config.ts
├── vite.config.ts
└── vitest.config.ts
```

### Key architectural rules

1. **All tool logic lives in `src/lib/tools/`** — pure functions, zero UI imports.
2. **All tool pages use `ToolLayout`** — handles breadcrumbs, ads, SEO schema, and content sections.
3. **All routes are lazy-loaded** via `React.lazy()` with a shared `ToolSkeleton` fallback.
4. **No backend** — every tool runs 100% client-side.
5. **`useLocalStorage`** persists user input across sessions per tool.

---

## 4. Running the Dev Server

```bash
# Start dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 5. Tech Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + Vite 5 | SPA with fast HMR |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| UI Primitives | shadcn/ui | Accessible, composable components |
| Animations | Framer Motion 12 | Page transitions, scroll animations |
| 3D Background | Three.js | WebGL shader on homepage hero |
| Type Safety | TypeScript 5.8 | End-to-end type checking |
| Testing | Vitest + Testing Library | Unit and component tests |
| Load Testing | K6 | Performance benchmarking |

---

## 6. Design System & Tokens

All colors are defined as **HSL values** in `src/index.css` and consumed via Tailwind in `tailwind.config.ts`.

### Color tokens (dark theme — default)

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `240 20% 2%` | Page background (#060608) |
| `--surface` | `240 15% 5%` | Card/panel backgrounds (#0d0d12) |
| `--surface2` | `240 13% 9%` | Elevated surfaces (#13131a) |
| `--primary` | `239 84% 67%` | Accent indigo (#6366f1) |
| `--accent` | `160 84% 43%` | Teal highlight (#06d6a0) |
| `--destructive` | `330 81% 56%` | Pink/error (#f72585) |
| `--muted-foreground` | `240 10% 50%` | Subdued text (#6b6b80) |
| `--border` | `240 10% 12%` | Borders (rgba(255,255,255,0.06)) |

### Typography

| Role | Font | Weight | Tailwind class |
|------|------|--------|---------------|
| Display/headings | Syne | 800 | `heading-display` or `font-display` |
| Code/mono | DM Mono | 400 | `font-mono` |
| Body | Syne | 400/600 | default `body` |

> ⚠️ **CRITICAL**: Never use raw color values like `text-white` or `bg-black` in components. Always use semantic tokens: `text-foreground`, `bg-surface`, `border-border`, `text-primary`, etc.

---

## 7. Adding a New Tool

### Step 1 — Create the logic file

```typescript
// src/lib/tools/myTool.ts
export function processMyTool(input: string): string {
  // Pure function — no React, no DOM
  return input.toUpperCase();
}
```

### Step 2 — Create the page

```typescript
// src/pages/MyTool.tsx
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";

export default function MyTool() {
  const handleProcess = (input: string) => {
    const { processMyTool } = await import("@/lib/tools/myTool");
    return processMyTool(input);
  };

  return (
    <ToolLayout
      title="My Tool — Free Online"
      slug="my-tool"
      description="One-line description for meta tags"
      keywords={["my tool online", "my tool free"]}
      howToUse={["Step 1", "Step 2", "Step 3"]}
      whatIs={{ title: "What is My Tool?", content: "150-word explanation..." }}
      faqs={[
        { q: "Question 1?", a: "Answer 1." },
        { q: "Question 2?", a: "Answer 2." },
      ]}
      relatedTools={[
        { name: "JWT Decoder", path: "/jwt-decoder", description: "Decode JWTs" },
      ]}
    >
      <CodePanel
        inputLabel="Input"
        outputLabel="Output"
        process={handleProcess}
        storageKey="my-tool"
      />
    </ToolLayout>
  );
}
```

### Step 3 — Register the route

```typescript
// src/App.tsx — add lazy import + route
const MyTool = lazy(() => import("./pages/MyTool"));

// Inside <Routes>:
<Route path="/my-tool" element={<MyTool />} />
```

### Step 4 — Add to homepage grid

```typescript
// src/pages/Index.tsx — add to the `tools` array
{ name: "My Tool", description: "Short description", path: "/my-tool", icon: Wrench, tag: "utility" }
```

### Step 5 — Update sitemap

Add the URL to `public/sitemap.xml`.

---

## 8. Ad System

The ad system uses `src/components/ads/AdContainer.tsx` with 4 placement types:

| Placement | Desktop Size | Mobile Size | Position |
|-----------|-------------|-------------|----------|
| `leaderboard` | 728×90 | 320×50 | Above tool title |
| `sidebar` | 300×600 | 300×600 (below tool on mobile) | Beside tool UI |
| `in-flow` | 300×250 | 300×250 | Below tool output |
| `mobile-sticky` | — | 320×50 | Fixed bottom with ✕ close |

### Key rules

- Ads **never** appear inside tool input/output panels.
- All slots have `min-height` placeholders → **CLS = 0**.
- Lazy-loaded via `IntersectionObserver` (except mobile-sticky).
- During development, slots render labeled "DEV AD" placeholders.
- Before production deploy, replace `data-ad-slot` values with real AdSense IDs.

### Desktop layout

```
┌─────────────────────────────────────────────────┐
│              LEADERBOARD 728×90                  │
├──────────────────────────────┬──────────────────┤
│                              │                  │
│   Tool UI                    │  SIDEBAR 300×600 │
│   width: calc(100% - 320px)  │  (sticky)        │
│                              │                  │
├──────────────────────────────┴──────────────────┤
│           IN-FLOW RECTANGLE 300×250              │
├─────────────────────────────────────────────────┤
│              SEO Content                         │
├─────────────────────────────────────────────────┤
│              LEADERBOARD 728×90 (bottom)         │
└─────────────────────────────────────────────────┘
```

### Mobile layout (< 1024px)

```
┌───────────────────┐
│ LEADERBOARD 320×50│
├───────────────────┤
│ Tool UI (100%)    │
├───────────────────┤
│ IN-FLOW 300×250   │
├───────────────────┤
│ SIDEBAR 300×600   │ ← moved below tool
├───────────────────┤
│ SEO Content       │
├───────────────────┤
│ STICKY 320×50     │ ← fixed bottom
└───────────────────┘
```

---

## 9. SEO Checklist

Every tool page includes via `ToolLayout`:

- [x] Unique `<title>` tag (< 60 chars with primary keyword)
- [x] Unique meta description (< 160 chars)
- [x] Canonical URL
- [x] JSON-LD: `WebApplication` schema
- [x] JSON-LD: `FAQPage` schema
- [x] JSON-LD: `BreadcrumbList` schema
- [x] Single `<h1>` with primary keyword
- [x] "How to Use" section (H2)
- [x] "What is X?" section (H2)
- [x] FAQ section with 5 Q&As (H2)
- [x] Related Tools internal links (H2)
- [x] `robots.txt` with sitemap reference
- [x] `sitemap.xml` with all 11 URLs

---

## 10. Testing

### Unit tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npx vitest run src/test/example.test.ts
```

### Writing tests

```typescript
// src/test/myTool.test.ts
import { describe, it, expect } from "vitest";
import { processMyTool } from "@/lib/tools/myTool";

describe("processMyTool", () => {
  it("should process input correctly", () => {
    expect(processMyTool("hello")).toBe("HELLO");
  });
});
```

---

## 11. K6 Load Testing (10,000 Concurrent Users)

### Install K6

```bash
# macOS
brew install k6

# Ubuntu/Debian
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D68
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Windows
choco install k6

# Docker
docker pull grafana/k6
```

### Run the load test

```bash
# Test all tools at 10,000 VUs for 2 minutes
k6 run k6/load-test.js

# Test with custom base URL
k6 run -e BASE_URL=https://devforge.tools k6/load-test.js

# Test specific tool only
k6 run -e TOOL=jwt-decoder k6/load-test.js

# Output results to JSON
k6 run --out json=results.json k6/load-test.js
```

### Understanding results

| Metric | Target | Description |
|--------|--------|-------------|
| `http_req_duration` (p95) | < 500ms | 95th percentile response time |
| `http_req_failed` | < 1% | Error rate |
| `http_reqs` | > 5000/s | Throughput |
| `checks` | 100% pass | Content validation |

> ⚠️ **WARNING**: Running 10,000 VUs from a single machine requires significant resources. For production testing, use K6 Cloud or distribute across multiple machines.

---

## 12. Deployment

### Lovable (default)

Click **Share → Publish** in the Lovable editor.

### Manual (any static host)

```bash
# Build the production bundle
npm run build

# Output is in /dist — deploy to any static host:
# Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront, etc.
```

### Custom domain

In Lovable: **Project → Settings → Domains → Connect Domain**

---

## 13. Environment Variables

This project runs 100% client-side and requires **no environment variables** for core functionality.

If you add ad integrations in the future:

| Variable | Purpose | Where |
|----------|---------|-------|
| `VITE_ADSENSE_PUB_ID` | Google AdSense publisher ID | `.env` |
| `VITE_GA_ID` | Google Analytics tracking ID | `.env` |

> ⚠️ **CRITICAL**: Never commit `.env` files. Add `.env` to `.gitignore`.

---

## 14. Troubleshooting

### Error 1: `Module not found: @/lib/utils`

**Cause**: Path alias `@/` not configured.
**Fix**: Verify `tsconfig.app.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Error 2: `Cannot find module 'three'`

**Cause**: Three.js not installed.
**Fix**:
```bash
npm install three @types/three
```

### Error 3: `Hydration mismatch` or `window is not defined`

**Cause**: Component using browser APIs (e.g., `ShaderAnimation`) rendered during SSR/prerender.
**Fix**: This is a Vite SPA — ensure components using `window`/`document` are wrapped in `useEffect` or conditionally rendered.

### Error 4: Tailwind classes not applying

**Cause**: Class not in Tailwind's content scan paths.
**Fix**: Verify `tailwind.config.ts` includes:
```typescript
content: ["./src/**/*.{ts,tsx}"]
```

### Error 5: `ERESOLVE unable to resolve dependency tree`

**Cause**: Conflicting peer dependencies.
**Fix**:
```bash
npm install --legacy-peer-deps
```

### Error 6: Vite dev server extremely slow

**Cause**: Large `node_modules` or filesystem watcher limits.
**Fix** (Linux):
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Error 7: `TypeError: Cannot read properties of null (reading 'appendChild')` in ShaderAnimation

**Cause**: Component unmounted before Three.js finished initializing.
**Fix**: The cleanup function in `useEffect` already handles this. If it persists, ensure the component is not conditionally rendered in a way that causes rapid mount/unmount cycles.

### Error 8: Ad container causes layout shift (CLS > 0)

**Cause**: Ad slot missing `min-height`.
**Fix**: All `AdContainer` placements include reserved height via inline `style={{ minHeight }}`. Never remove these.

### Error 9: `localStorage` quota exceeded

**Cause**: User stored very large inputs across multiple tools.
**Fix**: The `useLocalStorage` hook should catch `QuotaExceededError`:
```typescript
try { localStorage.setItem(key, value); }
catch (e) { console.warn("Storage full, clearing old entries"); }
```

### Error 10: K6 test shows `dial: too many open files`

**Cause**: OS file descriptor limit too low for 10,000 concurrent connections.
**Fix**:
```bash
# macOS/Linux — increase for current session
ulimit -n 65536

# Permanent (Linux) — add to /etc/security/limits.conf:
* soft nofile 65536
* hard nofile 65536
```

---

## License

MIT — see `LICENSE` file.

---

> **Built for developers. Free forever. No tracking.**
