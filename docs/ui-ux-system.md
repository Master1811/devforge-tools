# DevForge Tools — UI/UX System Reference

> **Source of truth for all design and frontend decisions.**
> Documents the implemented system only. Do not add to this file without implementing the change first.

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Typography](#2-typography)
3. [Spacing & Layout](#3-spacing--layout)
4. [Shadows & Elevation](#4-shadows--elevation)
5. [Glassmorphism System](#5-glassmorphism-system)
6. [Background System](#6-background-system)
7. [Navigation System](#7-navigation-system)
8. [Component Library](#8-component-library)
9. [Tool Page UX Patterns](#9-tool-page-ux-patterns)
10. [Category System](#10-category-system)
11. [User Flow](#11-user-flow)
12. [Motion & Interaction](#12-motion--interaction)
13. [Responsiveness](#13-responsiveness)
14. [Keyboard & Shell Layer](#14-keyboard--shell-layer)

---

## 1. Design Tokens

**Source files:** `src/styles/tokens.css`, `src/styles/globals.css`, `tailwind.config.ts`

### Philosophy

> Vibrance through contrast, not color. Pure white × pure black with opacity-derived grays for depth. Flat surfaces, 1px borders.

The system is **monochromatic** at its base. Color is only introduced for three semantic roles: category accents (cyan / green / violet) and destructive states (red).

---

### 1.1 Raw Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FAFAFA` | Page background |
| `--color-bg-elevated` | `#F2F2F2` | Elevated surface (card bg via Tailwind HSL) |
| `--color-surface` | `#E8E8E8` | Input fill, surface panels |
| `--color-fg` | `#0A0A0A` | Primary text |
| `--color-accent` | `#000000` | Primary CTA background |
| `--color-accent-inv` | `#FAFAFA` | Text on dark CTA |

### 1.2 Opacity-Derived Text Colors

These are always `rgba(10,10,10, N)` — never separate hues.

| Opacity | Usage |
|---|---|
| `1.00` → `#0A0A0A` | Headings, primary text |
| `0.80` | Strong body text, active states |
| `0.70` | Secondary body text |
| `0.65` | Muted body text |
| `0.60` | `--color-fg-muted` — descriptions, breadcrumbs |
| `0.55` | Icon color, placeholder text |
| `0.50` | Card descriptions |
| `0.48` | Subdued labels |
| `0.45` | Nav links (inactive) |
| `0.40` | Mono labels, section titles |
| `0.38` | `--color-fg-subtle` — faint annotations |
| `0.35` | Footer column headings |
| `0.32` | Placeholder text |
| `0.30` | Disabled/coming-soon state |

### 1.3 Opacity-Derived Border Colors

Always `rgba(0,0,0, N)` on light surfaces.

| Value | Token / Usage |
|---|---|
| `rgba(0,0,0,0.06)` | Section dividers, navbar bottom border (expanded) |
| `rgba(0,0,0,0.07)` | Coming-soon card borders |
| `rgba(0,0,0,0.08)` | `--color-border` — standard card border, footer border |
| `rgba(0,0,0,0.09)` | Finance funnel cards (interactive page) |
| `rgba(0,0,0,0.10)` | Navbar border (scrolled), glass elements |
| `rgba(0,0,0,0.12)` | Privacy banner border |
| `rgba(0,0,0,0.14)` | Input border (rest state) |
| `rgba(0,0,0,0.16)` | `--color-border-strong` |
| `rgba(0,0,0,0.18)` | Interactive tool card border |
| `rgba(0,0,0,0.20)` | ToolCard hover border |
| `rgba(0,0,0,0.24)` | Input hover border |

### 1.4 Category Accent Colors

Each tool category has one accent color used for badges, borders, backgrounds, and active states.

| Category | Accent Color | Tailwind Equivalent | Usage |
|---|---|---|---|
| **Dev Tools** | `#06B6D4` | `cyan-500` | Nav active, card accents |
| **Finance Tools** | `#10B981` | `emerald-500` | Nav active, metric cards, charts |
| **Interactive Tools** | `#8B5CF6` / `#7C3AED` | `violet-500` / `violet-700` | Nav active, tool cards, badges |

Accent usage pattern (violet example):
```css
/* Badge */
background: rgba(139,92,246,0.08);
border-color: rgba(139,92,246,0.25);
color: #7C3AED;

/* Card border (live) */
border-color: rgba(139,92,246,0.18);
hover border-color: rgba(139,92,246,0.32);
hover shadow: 0 8px 32px rgba(139,92,246,0.10);

/* Icon container */
background: rgba(139,92,246,0.09);
border-color: rgba(139,92,246,0.16);
icon color: #8B5CF6;
```

Emerald (Finance) parallel:
```css
hover shadow: 0 6px 24px rgba(16,185,129,0.08);
hover border: rgba(16,185,129,0.28);
```

Cyan (Dev) parallel:
```css
panel background: rgba(6,182,212,0.03);
panel border: rgba(6,182,212,0.18);
```

### 1.5 Semantic / Chart Colors

| Purpose | Value |
|---|---|
| Chart primary | `hsl(214 95% 52%)` |
| Chart accent (emerald) | `hsl(160 84% 43%)` |
| Chart destructive (red) | `hsl(330 81% 56%)` |
| Chart yellow | `hsl(38 92% 50%)` |
| Destructive UI | `hsl(0 72% 51%)` |

### 1.6 Tailwind HSL Bridge (shadcn convention)

```
--background:    0 0% 98%   (#FAFAFA)
--foreground:    0 0% 4%    (#0A0A0A)
--card:          0 0% 95%   (#F2F2F2)
--primary:       0 0% 4%    (black — primary CTA)
--secondary:     0 0% 91%   (#E8E8E8)
--muted:         0 0% 91%
--muted-foreground: 0 0% 40%
--border:        0 0% 88%
--input:         0 0% 92%
--ring:          0 0% 4%    (black focus ring)
--surface:       0 0% 96%
--surface2:      0 0% 91%
--radius:        0.375rem   (6px)
```

### 1.7 Dark Mode Tokens

Defined but **not active on tool pages or the design system at large**. Finance chart internals use dark-themed panel styles (`bg-white/[0.03]`, `border-white/[0.07]`) regardless of mode. The rest of the app is light-only.

```
Dark: --color-bg: #0A0A0A, --color-bg-elevated: #141414, --color-surface: #1C1C1C
Dark: --color-fg: #FAFAFA, --color-border: rgba(255,255,255,0.08)
```

---

## 2. Typography

**Source:** `src/app/layout.tsx`, `src/styles/tokens.css`, `tailwind.config.ts`

### 2.1 Font Stack

| Role | Primary | Fallback chain |
|---|---|---|
| **Display** | `Epic Pro` (self-hosted TTF) | `Geist`, `system-ui`, `sans-serif` |
| **Body** | `Epic Pro` | `Inter`, `system-ui`, `sans-serif` |
| **Mono** | `Epic Pro` | `JetBrains Mono`, `monospace` |

**Epic Pro** is loaded from `/public/fonts/EpicPro.ttf` via `@font-face`, weight range 100–900, `font-display: swap`. OpenType features enabled: `'ss01'`, `'cv11'`.

In practice, `font-display` is the class used for headings (maps to Epic Pro), `font-mono` for all code/label contexts (maps to JetBrains Mono fallback when Epic Pro glyphs are unavailable for monospace). Body text uses `font-sans` (Inter via CSS variable).

Font smoothing: `antialiased` applied globally.

### 2.2 Type Scale

| Context | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|
| Hero h1 | `clamp(2.8rem, 5.5vw, 4.5rem)` | 700 | `-0.03em` | `1.05` |
| Page h1 (tool) | `text-3xl` → `text-4xl` (sm+) | 700 | `-0.03em` | `1.06` |
| Section h2 | `clamp(1.8rem, 3.5vw, 2.8rem)` | 700 | `-0.025em` | — |
| Subsection h2 (SEO) | `text-2xl` (1.5rem) | 700 | `-0.025em` | — |
| Card title | `15px` | 600 | `-0.01em` | — |
| Interactive card h3 | `15px` | 600 | default | snug |
| Body text | `15px` | 400 | default | `relaxed` (1.625) |
| Small body | `13px` | 400 | default | `relaxed` |
| Tiny body | `12px`–`12.5px` | 400 | default | `relaxed` |
| Mono label | `11px` | — | `0.06em`–`0.10em` | — |
| Micro label | `10px` | 600 | `0.08em`–`0.10em` | — |
| Breadcrumb | `11px` | — | default | — |
| Keyboard hints | `10px`–`13px` | mono | `0.10em` | — |

### 2.3 Letter Spacing Conventions

| Value | Context |
|---|---|
| `-0.03em` | All major headings (h1, display) |
| `-0.025em` | SEO section headings (h2 in tool pages) |
| `-0.02em` | Subsection headings (h3) |
| `-0.01em` | Card titles (optional) |
| `0.06em` | Mono labels in breadcrumbs, category badges |
| `0.08em` | Command palette group headings |
| `0.10em` | Section section-label (`UPPERCASE MONO`) headers |
| `trackingwidest` (Tailwind) | Status badges, hub section titles |

### 2.4 Text Color Shortcuts (Most Used)

```tsx
// Primary content
text-[#0A0A0A]

// Muted descriptions
text-[rgba(10,10,10,0.55)]   // ~55%
text-[rgba(10,10,10,0.50)]   // ~50%
text-[rgba(10,10,10,0.48)]   // finance subtitles

// Labels / mono
text-[rgba(10,10,10,0.40)]   // breadcrumbs, labels
text-[rgba(10,10,10,0.35)]   // footer headings

// Tailwind utility
text-muted-foreground        // maps to 0 0% 40% via HSL
```

---

## 3. Spacing & Layout

### 3.1 CSS Custom Properties

```css
--nav-height: 64px
--content-max: 1200px          /* also --content-max-width */
--section-space: clamp(3.5rem, 7vw, 6.5rem)   /* ~56px – 104px */
```

### 3.2 Page Shell

```tsx
<html>
  <body className="antialiased">
    <Navbar />            {/* fixed top-0 left-0 right-0 z-50 */}
    <main className="pt-20 pb-8 min-h-screen">
      <div className="page-container">   {/* max-w-[1200px] mx-auto px-4 */}
        {/* content */}
      </div>
    </main>
    <Footer />
  </body>
</html>
```

Interactive / Finance hub pages override `pt-20` with `pt-24` for additional breathing room.

### 3.3 Container Widths

| Context | Max Width |
|---|---|
| Default page container | `max-w-[1200px]` (via `.page-container`) |
| Interactive hub | `max-w-5xl` (1024px) |
| Coming-soon pages | `max-w-2xl` (672px), centered |
| Navbar (scrolled pill) | `min(700px, calc(100vw - 2rem))` |
| Sticky action bar | `min(960px, calc(100% - 1.5rem))` |
| SEO content sections | `max-w-4xl` |

### 3.4 Grid Patterns

| Layout | Columns | Gap |
|---|---|---|
| Tool cards directory | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | `gap-4` |
| Finance metric summary | `grid-cols-2 sm:grid-cols-4` | `gap-3` |
| Finance tool (inputs/outputs) | `grid-cols-1 lg:grid-cols-[2fr_3fr]` | `gap-6` |
| Hero (text + visual) | `grid-cols-1 lg:grid-cols-[1fr_440px]` | `gap-12 lg:gap-16` |
| Decision cards (homepage) | `grid-cols-1 md:grid-cols-2` | `gap-5` |
| Interactive hub sections | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | `gap-4` |
| FinanceNextSteps | `grid-cols-1 md:grid-cols-2` | `gap-3` |
| Related tools | `grid-cols-1 sm:grid-cols-3` | `gap-3` |
| Footer | `grid-cols-2 md:grid-cols-4` | `gap-x-8 gap-y-10` |

### 3.5 Key Padding / Margin Values

| Element | Value |
|---|---|
| Card padding | `p-5` (20px) standard |
| Finance tool inner panel | `p-4 sm:p-6`, inner `p-5` |
| Navbar horizontal | `px-6` (expanded), `px-4` (scrolled) |
| Section top padding | `pt-24` (hub/finance pages), `pt-20` (dev tools) |
| Section bottom padding | `pb-20` (hub pages), `pb-8` (tool pages) |
| Footer | `py-14 px-6` |

### 3.6 Border Radius

| Value | Tailwind | Usage |
|---|---|---|
| `6px` | `rounded-lg` (`var(--radius)`) | Buttons, inputs, kbd tags |
| `8px` | `rounded-xl` | Panels, FAQ items, small cards |
| `12px` | `rounded-xl` (sometimes) | AdContainer |
| `16px` | `rounded-2xl` | Main cards, tool panels, navbar pill |
| `9999px` | `rounded-full` | Pills, badges, status dots |

---

## 4. Shadows & Elevation

### 4.1 CSS Shadow Tokens

```css
--shadow-xs:          0 1px 2px rgb(0 0 0 / 0.06)
--shadow-sm:          0 1px 3px rgb(0 0 0 / 0.06)
--shadow-md:          0 4px 20px rgb(0 0 0 / 0.08)
--shadow-nav:         0 4px 24px rgb(0 0 0 / 0.08), 0 1px 0 rgba(0,0,0,0.04)
--shadow-glow:        0 0 24px -4px rgba(0,0,0,0.06)
--shadow-glow-white:  0 0 28px -4px rgba(0,0,0,0.08)
--shadow-glow-accent: 0 0 24px -4px rgba(0,0,0,0.08)
```

### 4.2 Per-Component Shadow Usage

| Component | Rest State | Hover State |
|---|---|---|
| ToolCard | none | `0 4px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)` |
| Interactive tool card | none | `0 8px 32px rgba(139,92,246,0.10)` |
| Finance funnel card | none | `0 6px 24px rgba(16,185,129,0.08)` |
| Navbar (scrolled) | `--shadow-nav` | — |
| Primary CTA button | none | `0 0 20px rgba(0,0,0,0.15)` |
| Sticky action bar | `shadow-lg` | — |
| Hero carousel (active) | `0 8px 40px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)` | — |
| Hero carousel (inactive) | `0 2px 12px rgba(0,0,0,0.07)` | — |
| Related tools | none | `var(--shadow-glow)` |

---

## 5. Glassmorphism System

### 5.1 Where Glass Is Used

| Element | Background | Blur | Border | Saturation |
|---|---|---|---|---|
| **Navbar (scrolled)** | `rgba(255,255,255,0.90)` | `blur(24px)` | `rgba(0,0,0,0.10)` | `saturate(150%)` |
| **Keyboard hints overlay** (backdrop) | `rgba(250,250,250,0.60)` | `blur(sm)` | — | — |
| **Finance input panel** | `white/[0.03]` | `backdrop-blur-sm` | `white/[0.07]` | — |
| **Finance insight panel** | `white/[0.03]` | `backdrop-blur-sm` | `white/[0.07]` | — |
| **FinanceNextSteps panel** | `white/[0.03]` | `backdrop-blur-sm` | `white/[0.07]` | — |
| **Sticky action bar** | `bg-background/90` | `backdrop-blur-md` | `white/10` | — |
| **ToolLayout privacy badge** | `bg-surface/50` | `backdrop-blur-sm` | `border-border` | — |
| **FAQ items** | `bg-surface/60` | `backdrop-blur-sm` | `border-border` | — |
| **Related tools** | `bg-surface/60` | `backdrop-blur-sm` | `border-border` | — |

### 5.2 Glass Rules

- **Navbar glass** activates only when `scrollY >= 20px` (scroll-aware).
- **Finance panel glass** (`white/[0.03]`) is a very subtle tint — near-transparent. It creates a slight elevation sense without a visible blur.
- **Heavy blur is avoided** on cards — max blur in production is `backdrop-blur-md` (12px) on the sticky action bar.
- Glass is **never applied to tool content areas** — only structural chrome (navbar) and contextual overlays.
- **Background pages** (interactive hub header, coming-soon pages) use `overflow-hidden` to contain animated backgrounds, not glass.

---

## 6. Background System

### 6.1 Background Components

| Component | File | Animation |
|---|---|---|
| `HeroBackground` | `src/components/ui/hero-background.tsx` | `motion.g` groups drifting ±5px x, ±3px y |
| `BackgroundPaths` | `src/components/ui/background-paths.tsx` | Per-path `pathLength` + `opacity` pulse |

---

### 6.2 HeroBackground

**Used on:** Hero section of `HomePage` only.

**Design:**
- 16 smooth S-curves in two groups (`GROUP_A` / `GROUP_B`), drawn on a `1440×640` viewBox
- Paths extend from `x=-200` to `x=1640` — always overflow the viewport
- `preserveAspectRatio="xMidYMid slice"` (equivalent to `background-size: cover`)
- CSS mask vignette: fades all four edges to transparent so the background blends seamlessly

```tsx
style={{
  WebkitMaskImage: [
    "linear-gradient(to right,  transparent 0%, black  6%, black 94%, transparent 100%)",
    "linear-gradient(to bottom, transparent 0%, black 10%, black 78%, transparent 100%)",
  ].join(", "),
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
}}
```

**Animation:**
- `GROUP_A` drifts right: `x: [0, 5, 0, -5, 0]`, `y: [0, 3, 0, -3, 0]` — 34s loop
- `GROUP_B` drifts left: `x: [0, -5, 0, 5, 0]`, `y: [0, -3, 0, 3, 0]` — 42s loop
- Stroke opacity ≤ `0.060` (watermark level, never distracting)
- `useReducedMotion()` → static fallback (no animation)

**DO NOT USE on:** Tool pages, Finance pages, the /tools directory page, or any page where users are performing tasks.

---

### 6.3 BackgroundPaths

**Used on:**
1. `/tools/interactive` — header section only (inside a `relative overflow-hidden rounded-2xl` wrapper with `fadeBottom={true} fadeColor="#FAFAFA"`)
2. `/tools/interactive/glassmorphism` — full page (coming-soon empty state, `fadeBottom={false}`)
3. `/tools/interactive/og-preview` — full page (coming-soon empty state, `fadeBottom={false}`)

**Design:**
- 18 animated S-curve paths (down from 72 in original — 36 paths × 2 instances)
- Two mirrored `FloatingPaths` instances (`position=1` fans right, `position=-1` fans left)
- Path formula generates long sweeping S-curves across the viewport
- Stroke opacity range: `0.06` to `~0.204` (progressive, earlier paths lighter)

**Animation (per path):**
- `pathLength: [0.35, 0.85, 0.35]` — breathing draw effect
- `opacity` pulse at same frequency
- Pre-computed deterministic `DURATIONS` array (avoids SSR hydration mismatch)
- `delay: (id * 1.3) % 8` — staggered so paths don't pulse in sync
- `pathOffset` animation **intentionally removed** (too expensive — forces per-frame path length recalculation)

**Props:**
```tsx
interface BackgroundPathsProps {
  fadeBottom?: boolean;   // gradient fade to page background
  fadeColor?: string;     // color to fade into (default "#FAFAFA")
  className?: string;
}
```

**DO NOT USE on:** Tool pages (JWT, SQL, Finance calculators), search/filter pages, any page where the user is actively filling forms.

---

### 6.4 Gradient Backgrounds

| Location | Value |
|---|---|
| Interactive tool card (live) — top hairline | `linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.45) 50%, transparent 95%)` |
| AI-defensibility callout | `linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(124,58,237,0.02) 100%)` |
| Navbar bottom fade (interactive hub header) | `linear-gradient(to bottom, transparent 0%, #FAFAFA 100%)` |
| Ad skeleton shimmer | `linear-gradient(90deg, transparent, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.03) 60%, transparent)` |
| ToolCard hover spotlight | `radial-gradient(200px at {cursor}, rgba(0,0,0,0.04), transparent)` |

---

## 7. Navigation System

### 7.1 Navbar Structure

**File:** `src/components/shared/Navbar.tsx`

Fixed at `top-0 left-0 right-0 z-50`. Scroll-aware: transitions from a full-width transparent bar to a floating glass pill when the user scrolls past 20px.

```
Expanded (scrollY < 20px)
  height: 64px
  background: transparent
  border-bottom: 1px solid rgba(0,0,0,0.06)
  padding: px-6
  max-width: 100%

Scrolled (scrollY ≥ 20px)
  height: 52px
  background: rgba(255,255,255,0.90) backdrop-blur-xl saturate-150
  border: 1px solid rgba(0,0,0,0.10)
  border-radius: rounded-2xl
  margin-top: mt-3
  max-width: min(700px, calc(100vw - 2rem))  ← centered pill
  shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(0,0,0,0.04)
```

Transition: `duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]`

### 7.2 Navigation Links & Active States

Three primary links. Active detection uses `usePathname()`.

| Link | `href` | Active When | Active Color |
|---|---|---|---|
| Dev Tools | `/tools` | `pathname === "/"` or starts with `/tools` but not Finance/Interactive | Black pill |
| Finance Tools | `/tools/finance` | starts with `/tools/finance` | Black pill |
| Interactive Tools | `/tools/interactive` | starts with `/tools/interactive` | **Violet pill** |

Active pill styling:
```tsx
// Dev / Finance (active)
bg-[rgba(0,0,0,0.07)] text-[#0A0A0A]

// Interactive (active)
bg-[rgba(139,92,246,0.10)] text-[#7C3AED]

// Any (inactive)
text-[rgba(10,10,10,0.45)] hover:text-[#0A0A0A]
```

Right side of navbar: Logo mark + `⌘K` hint badge.

### 7.3 Route Map

```
/                          → HomePage
/tools                     → Dev Tools directory (ToolsPage)
/tools/finance             → Finance Tools hub
/tools/finance/[slug]      → Individual Finance tools
/tools/interactive         → Interactive Tools hub
/tools/interactive/[slug]  → Individual Interactive tools
/[slug]                    → Dev tools (legacy flat route)
```

---

## 8. Component Library

### 8.1 Button (`src/components/ui/button.tsx`)

CVA-based. All variants are light-mode.

| Variant | Background | Border | Text | Hover |
|---|---|---|---|---|
| `default` | `#0A0A0A` | none | `#FAFAFA` | shadow `0 0 20px rgba(0,0,0,0.15)` |
| `outline` | transparent | `rgba(0,0,0,0.18)` | `rgba(10,10,10,0.80)` | border darkens, subtle bg |
| `ghost` | transparent | none | `rgba(10,10,10,0.55)` | `rgba(0,0,0,0.06)` bg |
| `destructive` | `red-600/90` | none | white | `red-500` |
| `link` | transparent | none | `rgba(10,10,10,0.55)` | underline + darker text |
| `secondary` | `rgba(0,0,0,0.04)` | `rgba(0,0,0,0.10)` | `rgba(10,10,10,0.80)` | bg `rgba(0,0,0,0.08)` |

Sizes:
```
default: h-10 px-5 py-2      (40px tall)
sm:      h-8  px-3.5 text-[13px]
lg:      h-12 px-7  text-[15px]
icon:    h-10 w-10  rounded-lg
icon-sm: h-8  w-8   rounded-md
```

Base: `rounded-lg font-medium text-sm transition-[...] duration-200`

### 8.2 Input (`src/components/ui/input.tsx`)

```
height: h-10 (40px)
font:   font-mono text-sm
bg:     bg-white
border: border border-[rgba(0,0,0,0.14)] rounded-lg
placeholder: text-[rgba(10,10,10,0.32)]
hover:  border-[rgba(0,0,0,0.24)]
focus:  outline outline-1 outline-offset-0 outline-[rgba(0,0,0,0.60)], border-transparent
caret:  caret-[#0A0A0A]
selection: bg-black/10
disabled: cursor-not-allowed opacity-40
```

### 8.3 Textarea (`src/components/ui/textarea.tsx`)

Same styles as Input, plus:
```
min-height: auto (no fixed height)
resize: resize-y
padding: px-3 py-2
```

### 8.4 ToolCard (`src/components/shared/ToolCard.tsx`)

Used on the `/tools` directory page.

```
Container: rounded-xl border border-[rgba(0,0,0,0.10)] bg-white p-5
           transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]

Hover:     border-[rgba(0,0,0,0.20)]
           shadow: 0 4px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)
           translateY(-1px)
           Spotlight: radial-gradient at cursor position, rgba(0,0,0,0.04)
           Top hairline: 1px gradient from-transparent via-[rgba(0,0,0,0.15)] to-transparent

Icon box:  w-9 h-9 rounded-lg bg-[rgba(0,0,0,0.04)] border-[rgba(0,0,0,0.08)]

Title:     font-display font-semibold text-[15px] text-[#0A0A0A]
Desc:      text-[13px] text-[rgba(10,10,10,0.50)] line-clamp-2

Footer:    border-t border-[rgba(0,0,0,0.06)]
           "Open tool →" arrow animates +0.5px on hover
```

### 8.5 Command Palette (`src/components/ui/command.tsx`)

Dark-mode only component — always rendered dark regardless of page theme.

```
Background: #0A0A0A
Text: #FAFAFA
Border: rgba(255,255,255,0.12)
Input height: h-12 (48px)
Item padding: px-2.5 py-2.5
Selected bg: rgba(255,255,255,0.08)
Group heading: 10px font-mono tracking-[0.08em] uppercase text-[rgba(250,250,250,0.35)]
```

Triggered by `⌘K`. Lists Dev Tools (shortcuts 1–0) and Finance Tools (A, G, R, B, F) grouped separately.

### 8.6 Toast / Sonner (`src/components/ui/sonner.tsx`)

Dark-mode only:
```
Background: #0A0A0A
Text: #FAFAFA
Border: rgba(255,255,255,0.16)
Border-radius: rounded-lg
Shadow: 0 8px 32px rgba(0,0,0,0.6)
Font: text-[13px]
Duration: 2500ms
Description: rgba(250,250,250,0.55), font-mono 12px
Action button: bg-[#FAFAFA] text-[#0A0A0A]
```

### 8.7 FinanceMetricCard

Used in the `grid-cols-2 sm:grid-cols-4` summary row at the top of every finance tool.

Accent variants: `green`, `yellow`, `red`.

```
Container: rounded-xl border p-4
Value: text-2xl font-bold font-display tracking-tight
Sub-label: text-xs text-muted-foreground

green:  border-emerald-500/20, bg-emerald-500/5, value color: emerald
yellow: border-yellow-500/20,  bg-yellow-500/5,  value color: yellow
red:    border-red-500/20,     bg-red-500/5,     value color: red
```

### 8.8 InsightEngine

Full-width panel at the bottom of finance tool output. Generates text observations from computed data.

```
Container: rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5
Header: "Insights" with Sparkles icon
Items: bullet list of text insights, colored by severity (green/yellow/red)
```

### 8.9 FinanceNextSteps

Cross-navigation component. Shows up to 4 related tools after the insight engine.

```
Container: rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5
Title: "What should you do next?" 18px font-semibold
Cards: grid-cols-1 md:grid-cols-2 gap-3
  - Each: rounded-lg border border-border/70 bg-surface/60 p-4
  - Hover: border-primary/30, shadow-glow
  - First card labeled "Recommended next step"
  - Arrow animates +0.5px on hover
```

### 8.10 AdContainer (`src/components/ads/AdContainer.tsx`)

| Placement | Dimensions | Position |
|---|---|---|
| `leaderboard` | 728×90 (md+), 320×50 (mobile) | In-page, below header |
| `sidebar` | 300×600 | `sticky top-20` inside `<aside>` |
| `in-flow` | 468×60 | Below tool content |
| `success-banner` | 728×90 | Shown after successful operation |
| `mobile-sticky` | 320×50 | `fixed bottom-0`, glass effect |

Mobile sticky ad styling:
```
bg-white/90 backdrop-blur-[12px]
border-t border-[rgba(0,0,0,0.08)]
Dismiss button: absolute top-1 right-1, 20px
```

### 8.11 ShinyButton (`src/components/ui/shiny-button.tsx`)

Used for primary CTAs that need visual emphasis. Has a light-sweep animation on hover.

```
Base: inline-flex items-center justify-center rounded-lg
Background: black
Text: white
Animation: shiny-sweep (pseudo-element sweeps left to right)
Transition: 300ms ease-out
```

---

## 9. Tool Page UX Patterns

### 9.1 Dev Tool Page Structure

**Wrapper:** `ToolLayout` (`src/components/shared/ToolLayout.tsx`)

```
<Navbar />
<main pt-20 pb-8>
  <div page-container>
    [Leaderboard Ad]
    [Breadcrumb: Home / {Tool Name}]
    [Header: h1, description, privacy badge, keyboard hints]
    <div rounded-2xl surface-panel p-1>
      <div flex gap-6>
        <div w-full lg:w-[calc(100%-320px)]>
          {children}           ← TOOL UI HERE
          [Success Banner Ad]
          [In-flow Ad]
        </div>
        <aside hidden lg:block w-[300px] sticky top-20>
          [Sidebar Ad]
        </aside>
      </div>
    </div>
    [Mobile Ad]
    [SEO: How to Use, What Is, FAQ, Related Tools]
    [Bottom Ad]
  </div>
</main>
<AdContainer placement="mobile-sticky" />
<Footer />
```

The tool UI (`children`) is whatever the individual tool renders — typically:
- Left: textarea/input + process button
- Right: output textarea/display + copy button

### 9.2 Finance Tool Page Structure

**Wrapper:** `FinanceToolLayout` (wraps `ToolLayout`)

```
<ToolLayout privacyBanner={FINANCE_PRIVACY_BANNER} hideRelatedToolsSection>
  <div p-4 sm:p-6 space-y-6 pb-24>

    1. [Summary Metric Cards]  ← grid-cols-2 sm:grid-cols-4
       Green/yellow/red accent, large value + sub-label

    2. [Two-Column: Inputs | Outputs]  ← grid-cols-1 lg:grid-cols-[2fr_3fr]
       Inputs column:
         - "Example inputs" button (optional)
         - Input panel: rounded-xl, glass, "Your Numbers" mono label
         - Scenario manager (optional)
       Outputs column:
         - Chart(s), milestone display, scenario tabs

    3. [Insight Engine]  ← full-width glass panel

    4. [Finance Next Steps]  ← cross-navigation to related tools

  </div>
  [Sticky Action Bar: Copy Results | Share Link | Reset]
</ToolLayout>
```

All finance inputs update results **in real time** via `useMemo` — no submit button.

### 9.3 Interactive Tool Page Structure

**File examples:** `src/app/tools/interactive/cap-table/page.tsx`, `growth-simulator/page.tsx`

No shared wrapper — each tool is a fully custom React component inside a standard `<Navbar> / <main> / <Footer>` shell.

Common structure:
```
<Navbar />
<main pt-24 pb-20 min-h-screen>
  [Breadcrumb: Interactive / {Tool Name}]
  [Tool Header: icon, badge, h1, description]
  [Slider Controls]          ← left or top
  [Chart / Visual Output]    ← right or below, updates live
  ["Use this with" section]  ← cross-nav to Finance tools
</main>
<Footer />
```

Slider inputs update all outputs **synchronously** on every `onChange` event — no debounce.

### 9.4 Coming-Soon Page Structure

Used for Interactive tools not yet built.

```
<Navbar />
<main relative pt-24 pb-20 min-h-screen overflow-hidden>
  <BackgroundPaths fadeBottom={false} />
  <div relative z-[1] max-w-2xl mx-auto px-6 text-center>
    [Breadcrumb]
    [Icon box: 56px, violet tint]
    ["Coming soon" badge: violet pill]
    [h1]
    [Description paragraph]
    [Back link button: violet]
  </div>
</main>
<Footer />
```

### 9.5 Real-Time Update Rules

| Tool Type | Update Trigger | Method |
|---|---|---|
| Dev tools | Button click ("Process") | Manual, `⌘Enter` shortcut |
| Finance tools | Any input change | `useMemo` on every render |
| Interactive tools | Slider `onChange` | Synchronous state update |

---

## 10. Category System

### 10.1 Definitions

| Category | Route | Color | Purpose |
|---|---|---|---|
| **Dev Tools** | `/tools` | Cyan `#06B6D4` | Fast developer utilities. Text-in, text-out. No visualization required. |
| **Finance Tools** | `/tools/finance` | Emerald `#10B981` | Startup financial insight. Number-in, chart-out. Deep analysis with scenario management. |
| **Interactive Tools** | `/tools/interactive` | Violet `#8B5CF6` | AI-defensible visual experiences. Requires sliders, produces real-time visual output. |

### 10.2 Category Rules

**Dev Tools — a tool belongs here if:**
- Input is raw text / code / configuration
- Output is processed text / decoded data / formatted output
- No visualization needed
- Examples: JWT Decoder, SQL Formatter, Regex Tester, Base64, YAML↔JSON

**Finance Tools — a tool belongs here if:**
- Inputs are financial numbers (cash, MRR, burn rate, growth %)
- Output is a projection, score, or metric with chart visualization
- Benefits from scenario save/load/share
- Examples: Runway Calculator, ARR Calculator, ₹100Cr Journey

**Interactive Tools — a tool belongs here if:**
- Has mandatory sliders or toggle controls (not text inputs alone)
- Produces real-time chart, diagram, or spatial visual output
- Would be **useless as a static text form**
- A text model cannot replicate the experience
- Examples: Cap Table Simulator (equity pie + dilution bars), Growth Scenario Simulator (multi-scenario area chart)

### 10.3 Tag System (`src/lib/tools/registry.ts`)

Each tool in the registry has:
- `tag`: primary category (`"dev"` | `"finance"` | `"interactive"`)
- `tags[]`: all applicable categories for filtering

Finance tools do **not** appear in Interactive and vice versa. Cross-navigation is handled through UX funnels, not shared data.

### 10.4 Rules for Adding Tools

1. Assign exactly one primary `tag`
2. Add to `INTERACTIVE_TOOLS` array if interactive (with `stage`, `status`, `aiDefenseReason`, `financeNextTools`)
3. Add a route at `src/app/tools/{category}/{slug}/page.tsx`
4. Register in `src/lib/tools/registry.ts`
5. Add to `Shell.tsx` TOOLS array if it needs `⌘K` search support
6. Create a coming-soon page if `status: "coming_soon"`

---

## 11. User Flow

### 11.1 Homepage → Decision

```
Landing (/)
  ↓
Hero section
  → Primary CTA: "Explore Dev Tools" → /tools
  → Secondary CTA: "Finance Tools" → /tools/finance  (outline button)
  → Tertiary CTA: "Interactive" text link → /tools/interactive  (violet, Sliders icon)
  ↓
Decision section (below hero)
  → Two primary cards: Dev Tools | Finance Tools  (grid-cols-2 on md+)
  → One secondary strip: Interactive Tools  (full-width, accent strip below)
```

### 11.2 Dev Tools Flow

```
/tools  ← category filter tabs (All / Dev / Finance / Interactive)
  ↓
Search / filter by tag
  ↓
/[slug]  ← individual tool (flat route)
  Shell: keyboard shortcuts, ⌘K search, ⌘Enter process, ⌘C copy
  ↓
SEO section: Related Tools → other dev tools
```

### 11.3 Finance Tools Flow

```
/tools/finance  ← Finance hub page
  ↓
/tools/finance/[slug]  ← individual tool
  Summary cards → Inputs → Chart outputs → Insights
  ↓
FinanceNextSteps: "Recommended next step" → adjacent Finance tool
  (e.g., Runway → ₹100Cr Journey → ARR Calculator)
```

### 11.4 Interactive → Finance Funnel

This is the key cross-category flow. Interactive tools are designed as the **hook** (low commitment, visual) that funnels into Finance tools (deeper, number-driven).

```
/tools/interactive  ← hub with BackgroundPaths header
  ↓
/tools/interactive/cap-table  (live)
  Sliders → Equity pie chart → Dilution waterfall
  ↓
  "Use this with" section:
    → Runway Calculator  ("Now calculate how long your cash actually lasts")
    → ₹100Cr Journey    ("Map the growth path that makes this equity worth something")

/tools/interactive/growth-simulator  (live)
  Sliders → Multi-scenario ARR area chart
  ↓
  "Use this with" section:
    → ARR / MRR Calculator
    → Growth Rate Calculator
    → ₹100Cr Journey
```

The interactive hub page also has a dedicated **"Turn insight into action"** Finance funnel section at the bottom, showing 3 Finance tool cards labeled with context (`"After Cap Table Simulator"`, `"After Growth Simulator"`).

---

## 12. Motion & Interaction

### 12.1 CSS Easing Tokens

```css
--ease-sharp:        cubic-bezier(0.22, 1, 0.36, 1)   /* Default for UI */
--ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1)    /* Page transitions */
--ease-in-out-smooth: cubic-bezier(0.45, 0, 0.15, 1)  /* Shimmer sweeps */
--spring:            cubic-bezier(0.34, 1.56, 0.64, 1) /* Bouncy, drag */
```

### 12.2 Duration Tokens

```css
--duration-fast:   120ms   /* Micro-interactions, focus rings */
--duration-ui:     200ms   /* Standard hover/active transitions */
--duration-page:   320ms   /* Page-level animations */
```

### 12.3 Framer Motion Patterns

**Page entry animation (ToolLayout header):**
```tsx
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
// Second element:
transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
```

**Reveal animation (SEO sections):**
Uses `Reveal` component (`src/components/shared/Reveal.tsx`) with IntersectionObserver — fades up when scrolled into view.

```tsx
<Reveal>         // delay: 0
<Reveal delay={0.05}>
<Reveal delay={0.08}>
<Reveal delay={0.12}>
```

**Hero carousel:**
```tsx
drag="x"
dragConstraints={{ left: -maxDrag, right: 0 }}
dragElastic: 0.1
animate={{ x: -index * STEP_SIZE }}
transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
whileDrag={{ scale: 0.97 }}
```

**BackgroundPaths animation:**
```tsx
// Per path, deterministic durations from DURATIONS array
animate={{ pathLength: [0.35, 0.85, 0.35], opacity: [lo, hi, lo] }}
transition={{ duration: DURATIONS[id % 18], repeat: Infinity, ease: "easeInOut", delay: (id * 1.3) % 8 }}
```

**HeroBackground animation:**
```tsx
// Group-level (not per-path — much cheaper)
animate={{ x: [0, 5, 0, -5, 0], y: [0, 3, 0, -3, 0] }}
transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
```

### 12.4 CSS Animation Keyframes

| Class | Animation | Duration | Use |
|---|---|---|---|
| `animate-fade-up` | opacity 0→1, y 16→0 | 500ms | Section entrances |
| `animate-fade-in` | opacity 0→1 | 300ms | Overlays |
| `animate-scale-in` | opacity 0→1, scale 0.96→1 | 300ms | Modals, dropdowns |
| `animate-shimmer` | translateX -100%→100% | 1.8s loop | Loading skeletons |
| `animate-shiny-sweep` | left -80%→150% | 600ms | ShinyButton hover |
| `animate-validation-pulse` | border-color flash | 160ms | Input validation |
| `animate-light-sweep` | left -100%→100% | 300ms | Card hover sweeps |
| `animate-pulse` | opacity pulse | 2s loop | Status dots, skeletons |

### 12.5 Hover Interaction Details

| Element | Transform | Color change | Shadow change |
|---|---|---|---|
| ToolCard | `translateY(-1px)` | border darkens | `+shadow-md` |
| Interactive tool card (live) | `translateY(-0.5px)` | border: violet | violet glow shadow |
| Finance funnel cards | `translateY(-1px)` | border: emerald | emerald glow shadow |
| Related tool cards | `translateY(-0.5px)` | border: primary/30 | `--shadow-glow` |
| Arrow icons | `translateX(+0.5px)` | — | — |
| Nav links | none | text darkens | — |
| Button (default) | none | — | glow shadow |
| Button (outline) | none | border darkens | — |
| FAQ summary | none | text → `text-primary` | — |
| FAQ `+` icon | `rotate(45deg)` | — | — |

### 12.6 Performance Rules

- **Never animate `path-offset`** — forces continuous stroke-length recalculation per frame
- Prefer **group-level animation** (`motion.g`) over per-element animation for SVG backgrounds
- Use **deterministic durations** for background animations — never `Math.random()` (causes SSR hydration mismatch in Next.js)
- Background animations run at `pathLength` + `opacity` only — no transforms on individual paths
- `useReducedMotion()` checked in both background components — static fallback rendered instead

---

## 13. Responsiveness

### 13.1 Breakpoints (Tailwind defaults)

| Name | Min Width | Usage |
|---|---|---|
| `sm` | 640px | 2-column cards, responsive ad sizes |
| `md` | 768px | 2-column decision cards, footer 4-col |
| `lg` | 1024px | Tool sidebar appears, 2-col finance layout, 3-col cards |
| `2xl` | 1400px | (Used in Tailwind config, not heavily in components) |

### 13.2 Mobile-Specific Behaviors

- **Navbar:** Full-width in both states; pill width uses `calc(100vw - 2rem)` to respect margins on mobile
- **Tool content:** Single column; sidebar ad hidden (`hidden lg:block`); leaderboard ad shown as centered block
- **Finance tool layout:** Single column (inputs then outputs stacked)
- **Sticky action bar:** Full-width (`w-[min(960px,calc(100%-1.5rem))]`), 3-button grid on all sizes
- **Mobile sticky ad:** Fixed `bottom-0`, shown on all non-desktop views
- **Hero:** Single column stacked; carousel touch drag enabled via `drag="x"`
- **Command palette:** Full-width on mobile
- **Footer:** 2-column on mobile, 4-column on `md+`

### 13.3 Reduced Motion

Both `HeroBackground` and `BackgroundPaths` check `useReducedMotion()`:
```tsx
const prefersReduced = useReducedMotion();
animate={prefersReduced ? undefined : { ... }}
```

When reduced motion is preferred: paths render statically at initial opacity/pathLength — no animation runs.

CSS global:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 14. Keyboard & Shell Layer

**File:** `src/components/Shell.tsx`

### 14.1 Global Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` | Open command palette |
| `⌘Enter` | Trigger tool processing (fires registered callbacks) |
| `⌘C` (no selection) | Copy tool result (fires registered callbacks) |
| `?` | Toggle keyboard hints panel |
| `Esc` | Close keyboard hints panel |

### 14.2 Command Palette Quick-Switch

Number keys `1`–`0` → Dev Tools 1–10.  
Letter keys `A`, `G`, `R`, `B`, `F` → Finance Tools.

### 14.3 Keyboard Hints Panel

Slides in from the right (`animate-in slide-in-from-right`). Contains three sections: Navigation, Actions, Quick Switch. Background: white, border-left `rgba(0,0,0,0.10)`.

Backdrop: `rgba(250,250,250,0.60) backdrop-blur-sm`.

### 14.4 Shell Context API

```tsx
const shell = useShell();
shell.triggerProcess()           // programmatically fire ⌘Enter
shell.triggerCopyResult()        // programmatically fire ⌘C
shell.onProcess(cb)              // register a handler (returns unsubscribe fn)
shell.onCopyResult(cb)           // register a copy handler
shell.showSuccessAd              // boolean — show success-banner ad
shell.setShowSuccessAd(true)     // trigger success ad after operation
```

---

*Last updated: April 2026. Reflects the codebase as of the Interactive Tools phase completion.*
