# Design: Tailwind CSS v4 Upgrade

**Date:** 2026-03-08
**Status:** Approved
**Approach:** CSS custom properties via `data-theme` attribute (Approach A)

---

## Overview

Upgrade the project from TailwindCSS v3.4 to v4. Along with the toolchain migration, eliminate the large `safelist` array in `tailwind.config.js` by replacing all JS-based dynamic color lookups (`colorClasses` maps) with a CSS custom property theme system driven by a `data-theme` HTML attribute.

---

## Section 1 — Package & Toolchain Changes

### Remove
- `tailwindcss@^3.3.2`
- `autoprefixer` (v4 handles vendor prefixes natively)
- `tailwind.config.js` (deleted — replaced by CSS `@theme` block)
- `postcss.config.js` (deleted — replaced by Vite plugin)

### Add
- `tailwindcss@^4`
- `@tailwindcss/vite` — first-class Vite plugin for SvelteKit/Vite projects

### Modify
- **`vite.config.js`** — import and add `tailwindcss()` from `@tailwindcss/vite` to the plugins array alongside `sveltekit()`
- **`package.json`** — update devDependencies accordingly

### Note on PostCSS
`postcss` remains as a devDependency (required by other tooling) but `postcss.config.js` is removed since the Vite plugin handles CSS processing directly.

---

## Section 2 — `app.css` Restructuring

### Directive replacement
Replace the three v3 directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
With the single v4 import:
```css
@import "tailwindcss";
```

### `@theme` block — custom design tokens
All tokens from `tailwind.config.js` move here. Tailwind v4 automatically generates utility classes from `@theme` custom properties, so all existing `brand-*` utilities (`bg-brand-dark`, `text-brand-primary`, etc.) continue to work unchanged.

```css
@theme {
  --font-family-sans: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-size-sm: 1rem;
  --line-height-sm: 1.5rem;
  --color-brand-dark: #0A0A0F;
  --color-brand-darker: #06060C;
  --color-brand-border: #1A1A2E;
  --color-brand-text-muted: #A1A1AA;
  --color-brand-text-subtle: #71717A;
  --color-brand-text-dimmer: #3A3A5E;
  --color-brand-primary: #6366F1;
}
```

---

## Section 3 — Dynamic Theme System (`data-theme`)

### Problem being solved
Six components each contain a JS `colorClasses` lookup map and a reactive assignment to produce dynamic Tailwind class strings at runtime. This required a 100+ entry `safelist` to prevent Tailwind from purging those classes. In v4, content scanning is more aggressive, making safelists harder to manage.

### Solution
Replace the JS color lookup pattern with a CSS custom property theme driven by a `data-theme` HTML attribute.

### Theme custom property slots
Each theme color exposes a fixed set of CSS custom properties:

| Variable | Purpose |
|---|---|
| `--theme-accent` | Text accent color (links, highlights) |
| `--theme-badge-bg` | Badge/pill background |
| `--theme-badge-text` | Badge/pill text color |
| `--theme-dot` | Status dot / indicator fill |
| `--theme-hero-bg` | Hero section background |
| `--theme-gradient-from` | Gradient start color |
| `--theme-gradient-to` | Gradient end color |

### Theme definitions in `app.css`

```css
[data-theme="indigo"] {
  --theme-accent:         #818cf8;           /* indigo-400 */
  --theme-badge-bg:       rgb(49 46 129 / 0.3); /* indigo-900/30 */
  --theme-badge-text:     #a5b4fc;           /* indigo-300 */
  --theme-dot:            #6366f1;           /* indigo-500 */
  --theme-hero-bg:        #4f46e5;           /* indigo-600 */
  --theme-gradient-from:  #6366f1;           /* indigo-500 */
  --theme-gradient-to:    #4f46e5;           /* indigo-600 */
}

[data-theme="amber"] {
  --theme-accent:         #fbbf24;           /* amber-400 */
  --theme-badge-bg:       rgb(120 53 15 / 0.3); /* amber-900/30 */
  --theme-badge-text:     #fcd34d;           /* amber-300 */
  --theme-dot:            #f59e0b;           /* amber-500 */
  --theme-hero-bg:        #d97706;           /* amber-600 */
  --theme-gradient-from:  #f59e0b;           /* amber-500 */
  --theme-gradient-to:    #d97706;           /* amber-600 */
}

[data-theme="emerald"] {
  --theme-accent:         #34d399;           /* emerald-400 */
  --theme-badge-bg:       rgb(6 78 59 / 0.3); /* emerald-900/30 */
  --theme-badge-text:     #6ee7b7;           /* emerald-300 */
  --theme-dot:            #10b981;           /* emerald-500 */
  --theme-hero-bg:        #059669;           /* emerald-600 */
  --theme-gradient-from:  #10b981;           /* emerald-500 */
  --theme-gradient-to:    #059669;           /* emerald-600 */
}

[data-theme="purple"] {
  --theme-accent:         #c084fc;           /* purple-400 */
  --theme-badge-bg:       rgb(88 28 135 / 0.3); /* purple-900/30 */
  --theme-badge-text:     #d8b4fe;           /* purple-300 */
  --theme-dot:            #a855f7;           /* purple-500 */
  --theme-hero-bg:        #9333ea;           /* purple-600 */
  --theme-gradient-from:  #a855f7;           /* purple-500 */
  --theme-gradient-to:    #9333ea;           /* purple-600 */
}

[data-theme="blue"] {
  --theme-accent:         #60a5fa;           /* blue-400 */
  --theme-badge-bg:       rgb(30 58 138 / 0.3); /* blue-900/30 */
  --theme-badge-text:     #93c5fd;           /* blue-300 */
  --theme-dot:            #3b82f6;           /* blue-500 */
  --theme-hero-bg:        #2563eb;           /* blue-600 */
  --theme-gradient-from:  #3b82f6;           /* blue-500 */
  --theme-gradient-to:    #2563eb;           /* blue-600 */
}

[data-theme="green"] {
  --theme-accent:         #4ade80;           /* green-400 */
  --theme-badge-bg:       rgb(20 83 45 / 0.3); /* green-900/30 */
  --theme-badge-text:     #86efac;           /* green-300 */
  --theme-dot:            #22c55e;           /* green-500 */
  --theme-hero-bg:        #16a34a;           /* green-600 */
  --theme-gradient-from:  #22c55e;           /* green-500 */
  --theme-gradient-to:    #16a34a;           /* green-600 */
}

[data-theme="red"] {
  --theme-accent:         #f87171;           /* red-400 */
  --theme-badge-bg:       rgb(127 29 29 / 0.3); /* red-900/30 */
  --theme-badge-text:     #fca5a5;           /* red-300 */
  --theme-dot:            #ef4444;           /* red-500 */
  --theme-hero-bg:        #dc2626;           /* red-600 */
  --theme-gradient-from:  #ef4444;           /* red-500 */
  --theme-gradient-to:    #dc2626;           /* red-600 */
}

[data-theme="orange"] {
  --theme-accent:         #fb923c;           /* orange-400 */
  --theme-badge-bg:       rgb(124 45 18 / 0.3); /* orange-900/30 */
  --theme-badge-text:     #fdba74;           /* orange-300 */
  --theme-dot:            #f97316;           /* orange-500 */
  --theme-hero-bg:        #ea580c;           /* orange-600 */
  --theme-gradient-from:  #f97316;           /* orange-500 */
  --theme-gradient-to:    #ea580c;           /* orange-600 */
}
```

### Component migration pattern

**Before (v3):**
```svelte
<script>
  const colorClasses = {
    indigo: { badge: 'bg-indigo-900/30 text-indigo-300', dot: 'bg-indigo-500' },
    amber:  { badge: 'bg-amber-900/30 text-amber-300',   dot: 'bg-amber-500' },
  };
  $: colors = colorClasses[themeColor] || colorClasses.indigo;
</script>
<div class={colors.badge}>...</div>
```

**After (v4):**
```svelte
<div data-theme={themeColor} style="background: var(--theme-badge-bg); color: var(--theme-badge-text)">...</div>
```

Or using Tailwind arbitrary values where a utility class is more readable:
```svelte
<div data-theme={themeColor} class="bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)]">...</div>
```

### Affected components
- `src/lib/components/BlogPostContent.svelte`
- `src/lib/components/ClusterHero.svelte`
- `src/lib/components/CategoryHero.svelte`
- `src/lib/components/CategorySection.svelte`
- `src/lib/components/CategoryShowcase.svelte`
- `src/lib/components/BlogPostCard.svelte` (if applicable)

---

## Files Changed Summary

| File | Action |
|---|---|
| `tailwind.config.js` | Deleted |
| `postcss.config.js` | Deleted |
| `vite.config.js` | Add `@tailwindcss/vite` plugin |
| `package.json` | Remove tailwindcss v3, autoprefixer; add tailwindcss v4, @tailwindcss/vite |
| `src/app.css` | Replace directives with `@import`, add `@theme` block, add `[data-theme]` blocks |
| 6 × component `.svelte` files | Remove `colorClasses` maps, add `data-theme` attribute |

---

## Non-Goals

- TypeScript migration (out of scope)
- Svelte 5 migration (out of scope)
- Adding new visual features or design changes
- Changing the prose/dark-prose CSS (it stays as-is)
