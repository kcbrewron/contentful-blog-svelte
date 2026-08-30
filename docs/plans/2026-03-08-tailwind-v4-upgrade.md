# Tailwind v4 Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade TailwindCSS from v3 to v4, replacing `tailwind.config.js` with a CSS `@theme` block and eliminating JS `colorClasses` lookup maps via a `data-theme` CSS custom property system.

**Architecture:** The Vite plugin (`@tailwindcss/vite`) replaces the PostCSS pipeline. All design tokens move from `tailwind.config.js` into an `@theme {}` block in `app.css`. Dynamic category theming moves from per-component JS lookup maps to `[data-theme="color"]` CSS blocks that expose `--theme-*` custom properties, consumed via inline styles in components.

**Tech Stack:** TailwindCSS v4, `@tailwindcss/vite`, SvelteKit, Vite, Yarn v4

---

## Task 1: Update packages

**Files:**
- Modify: `package.json`

**Step 1: Remove old packages and add new ones**

```bash
yarn remove tailwindcss autoprefixer
yarn add -D tailwindcss @tailwindcss/vite
```

**Step 2: Verify installed versions**

```bash
yarn list tailwindcss @tailwindcss/vite
```

Expected: `tailwindcss` at `4.x.x`, `@tailwindcss/vite` at `4.x.x`. No `autoprefixer` entry.

**Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: upgrade tailwindcss to v4, add @tailwindcss/vite, remove autoprefixer"
```

---

## Task 2: Update Vite config to use Tailwind v4 Vite plugin

**Files:**
- Modify: `vite.config.js`

**Step 1: Add the Tailwind Vite plugin**

Replace the top of `vite.config.js`:

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		include: ['tests/unit/**/*.test.js'],
		globals: true,
		environment: 'node',
		alias: {
			$lib: '/src/lib',
			'$env/dynamic/private': '/tests/unit/__mocks__/env.js',
			'$env/static/private': '/tests/unit/__mocks__/env.js'
		}
	}
});
```

Note: `tailwindcss()` must come **before** `sveltekit()` in the plugins array.

**Step 2: Delete PostCSS config (no longer needed)**

```bash
rm postcss.config.js
```

**Step 3: Verify dev server starts**

```bash
yarn dev
```

Expected: Server starts without errors. Visit `http://localhost:5173` and confirm styles are applied.

**Step 4: Commit**

```bash
git add vite.config.js
git rm postcss.config.js
git commit -m "chore: wire up @tailwindcss/vite plugin, remove postcss.config.js"
```

---

## Task 3: Migrate `app.css` — directives and `@theme` block

**Files:**
- Modify: `src/app.css`
- Delete: `tailwind.config.js`

**Step 1: Replace the three `@tailwind` directives**

At the top of `src/app.css`, replace:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

With:

```css
@import "tailwindcss";
```

**Step 2: Add the `@theme` block directly below the import**

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

**Step 3: Delete `tailwind.config.js`**

```bash
rm tailwind.config.js
```

**Step 4: Verify in browser**

```bash
yarn dev
```

Check that:
- `bg-brand-dark`, `text-brand-primary`, `font-sans`, `font-mono` classes still render correctly
- Prose styles in `app.css` are intact
- No console errors about missing classes

**Step 5: Commit**

```bash
git add src/app.css
git rm tailwind.config.js
git commit -m "feat: migrate tailwind config to @theme block in app.css"
```

---

## Task 4: Add `[data-theme]` blocks to `app.css`

**Files:**
- Modify: `src/app.css`

**Step 1: Append the theme definitions after the `@theme` block**

Add the following after the `@theme { }` block in `src/app.css`:

```css
/* ─── Dynamic category theme system ────────────────────────────────────────── */
/* Apply data-theme="<color>" to a component root to activate these vars.      */
/* --theme-accent: text accent (links, highlights)                              */
/* --theme-badge-bg: badge/pill background                                      */
/* --theme-badge-text: badge/pill text                                          */
/* --theme-dot: status indicator fill                                           */
/* --theme-hero-bg: hero section background                                     */
/* --theme-gradient-from / --theme-gradient-to: gradient start/end             */

[data-theme="indigo"] {
  --theme-accent:        #818cf8;
  --theme-badge-bg:      rgb(49 46 129 / 0.3);
  --theme-badge-text:    #a5b4fc;
  --theme-dot:           #6366f1;
  --theme-hero-bg:       #4f46e5;
  --theme-gradient-from: #6366f1;
  --theme-gradient-to:   #4f46e5;
}

[data-theme="amber"] {
  --theme-accent:        #fbbf24;
  --theme-badge-bg:      rgb(120 53 15 / 0.3);
  --theme-badge-text:    #fcd34d;
  --theme-dot:           #f59e0b;
  --theme-hero-bg:       #d97706;
  --theme-gradient-from: #f59e0b;
  --theme-gradient-to:   #d97706;
}

[data-theme="emerald"] {
  --theme-accent:        #34d399;
  --theme-badge-bg:      rgb(6 78 59 / 0.3);
  --theme-badge-text:    #6ee7b7;
  --theme-dot:           #10b981;
  --theme-hero-bg:       #059669;
  --theme-gradient-from: #10b981;
  --theme-gradient-to:   #059669;
}

[data-theme="purple"] {
  --theme-accent:        #c084fc;
  --theme-badge-bg:      rgb(88 28 135 / 0.3);
  --theme-badge-text:    #d8b4fe;
  --theme-dot:           #a855f7;
  --theme-hero-bg:       #9333ea;
  --theme-gradient-from: #a855f7;
  --theme-gradient-to:   #9333ea;
}

[data-theme="blue"] {
  --theme-accent:        #60a5fa;
  --theme-badge-bg:      rgb(30 58 138 / 0.3);
  --theme-badge-text:    #93c5fd;
  --theme-dot:           #3b82f6;
  --theme-hero-bg:       #2563eb;
  --theme-gradient-from: #3b82f6;
  --theme-gradient-to:   #2563eb;
}

[data-theme="green"] {
  --theme-accent:        #4ade80;
  --theme-badge-bg:      rgb(20 83 45 / 0.3);
  --theme-badge-text:    #86efac;
  --theme-dot:           #22c55e;
  --theme-hero-bg:       #16a34a;
  --theme-gradient-from: #22c55e;
  --theme-gradient-to:   #16a34a;
}

[data-theme="red"] {
  --theme-accent:        #f87171;
  --theme-badge-bg:      rgb(127 29 29 / 0.3);
  --theme-badge-text:    #fca5a5;
  --theme-dot:           #ef4444;
  --theme-hero-bg:       #dc2626;
  --theme-gradient-from: #ef4444;
  --theme-gradient-to:   #dc2626;
}

[data-theme="orange"] {
  --theme-accent:        #fb923c;
  --theme-badge-bg:      rgb(124 45 18 / 0.3);
  --theme-badge-text:    #fdba74;
  --theme-dot:           #f97316;
  --theme-hero-bg:       #ea580c;
  --theme-gradient-from: #f97316;
  --theme-gradient-to:   #ea580c;
}
```

**Step 2: Commit**

```bash
git add src/app.css
git commit -m "feat: add [data-theme] CSS custom property blocks to app.css"
```

---

## Task 5: Migrate `ClusterHero.svelte`

**Files:**
- Modify: `src/lib/components/ClusterHero.svelte`

**Step 1: Remove `colorClasses` map and `$: colors` reactive statement**

Delete lines 24–32 from `<script>`:
```js
// DELETE this entire block:
const colorClasses = {
    indigo: { accent: 'text-indigo-400', badge: 'bg-indigo-900/30 text-indigo-300', dot: 'bg-indigo-500' },
    amber: { accent: 'text-amber-400', badge: 'bg-amber-900/30 text-amber-300', dot: 'bg-amber-500' },
    emerald: { accent: 'text-emerald-400', badge: 'bg-emerald-900/30 text-emerald-300', dot: 'bg-emerald-500' },
    purple: { accent: 'text-purple-400', badge: 'bg-purple-900/30 text-purple-300', dot: 'bg-purple-500' },
    blue: { accent: 'text-blue-400', badge: 'bg-blue-900/30 text-blue-300', dot: 'bg-blue-500' }
};
$: colors = colorClasses[themeColor] || colorClasses.indigo;
```

**Step 2: Add `data-theme` to the `<section>` root and replace class-based color references**

Find the `<section>` opening tag (line 35) and add `data-theme={themeColor}`:
```svelte
<section class="relative bg-gradient-to-b from-slate-950 to-slate-900 pt-20 pb-16 lg:pt-28 lg:pb-20" data-theme={themeColor}>
```

Find the badge `<div>` (line 52):
```svelte
<!-- BEFORE -->
<div class="mb-8 inline-flex items-center gap-2 rounded-full {colors.badge} px-4 py-2">
    <div class="h-2 w-2 rounded-full {colors.dot}"></div>

<!-- AFTER -->
<div class="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2"
     style="background: var(--theme-badge-bg); color: var(--theme-badge-text);">
    <div class="h-2 w-2 rounded-full" style="background: var(--theme-dot);"></div>
```

**Step 3: Remove the `<style>` block's `@apply` usage**

The existing `<style>` block uses `@apply font-semibold` — in v4 this still works, but since it's a global style on a non-existent selector, delete the entire `<style>` block:
```svelte
<!-- DELETE this entire block -->
<style>
    :global(.cluster-accent-text) {
        @apply font-semibold;
    }
</style>
```

**Step 4: Verify in browser**

With `yarn dev`, navigate to a cluster/category page and confirm badge colors render correctly for each theme color.

**Step 5: Commit**

```bash
git add src/lib/components/ClusterHero.svelte
git commit -m "feat: migrate ClusterHero to data-theme CSS custom properties"
```

---

## Task 6: Migrate `BlogPostContent.svelte`

**Files:**
- Modify: `src/lib/components/BlogPostContent.svelte`

**Step 1: Remove `colorClasses` map and `$: colors`**

Delete lines 39–47:
```js
// DELETE:
const colorClasses = {
    indigo: { badge: 'bg-indigo-900/30 text-indigo-300', dot: 'bg-indigo-500' },
    amber: { badge: 'bg-amber-900/30 text-amber-300', dot: 'bg-amber-500' },
    emerald: { badge: 'bg-emerald-900/30 text-emerald-300', dot: 'bg-emerald-500' },
    purple: { badge: 'bg-purple-900/30 text-purple-300', dot: 'bg-purple-500' },
    blue: { badge: 'bg-blue-900/30 text-blue-300', dot: 'bg-blue-500' }
};
$: colors = colorClasses[themeColor] || colorClasses.indigo;
```

**Step 2: Add `data-theme` to `<article>` and update the badge**

Add `data-theme` to the `<article>` tag (line 62):
```svelte
<article class="bg-slate-950" data-theme={themeColor}>
```

Replace the category badge (line 78–80):
```svelte
<!-- BEFORE -->
<div class="mb-6 inline-flex items-center gap-2 rounded-full {colors.badge} px-4 py-2">
    <div class="h-2 w-2 rounded-full {colors.dot}"></div>

<!-- AFTER -->
<div class="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
     style="background: var(--theme-badge-bg); color: var(--theme-badge-text);">
    <div class="h-2 w-2 rounded-full" style="background: var(--theme-dot);"></div>
```

**Step 3: Verify in browser**

Navigate to a blog post and confirm the category badge color matches the category theme.

**Step 4: Commit**

```bash
git add src/lib/components/BlogPostContent.svelte
git commit -m "feat: migrate BlogPostContent to data-theme CSS custom properties"
```

---

## Task 7: Migrate `CategoryHero.svelte`

**Files:**
- Modify: `src/lib/components/CategoryHero.svelte`

**Step 1: Remove `colorClasses` map and `$: bgClass`**

Delete lines 11–19:
```js
// DELETE:
const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
    orange: 'bg-orange-600'
};
$: bgClass = colorClasses[themeColor] || colorClasses.blue;
```

**Step 2: Add `data-theme` to `<section>` and replace `{bgClass}` with inline style**

```svelte
<!-- BEFORE -->
<section class="relative {bgClass} text-white py-20">

<!-- AFTER -->
<section class="relative text-white py-20"
         data-theme={themeColor}
         style="background-color: var(--theme-hero-bg);">
```

**Step 3: Verify in browser**

Navigate to a category page (e.g. `/technology`) and confirm the hero background color matches the category theme color.

**Step 4: Commit**

```bash
git add src/lib/components/CategoryHero.svelte
git commit -m "feat: migrate CategoryHero to data-theme CSS custom properties"
```

---

## Task 8: Migrate `CategorySection.svelte`

**Files:**
- Modify: `src/lib/components/CategorySection.svelte`

**Step 1: Remove `colorClasses` map and `$: titleColor`**

Delete lines 27–35:
```js
// DELETE:
const colorClasses = {
    blue: 'text-brand-primary',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    orange: 'text-orange-600'
};
$: titleColor = colorClasses[themeColor] || colorClasses.blue;
```

**Step 2: Add `data-theme` to `<section>` root**

Find the `<section>` tag and add the attribute:
```svelte
<section class="bg-brand-darker text-white py-4" {id} data-theme={themeColor}>
```

**Step 3: Find where `{titleColor}` is used and replace with inline style**

Search the template for `{titleColor}` — if used on an element, replace with `style="color: var(--theme-accent);"`. If there is no usage (the variable may be unused in the template — `text-brand-primary` for blue is the default `text-brand-primary` class on the "View all" link which doesn't use `titleColor`), simply verify and skip.

Run:
```bash
grep -n "titleColor" src/lib/components/CategorySection.svelte
```

If no template usage: the deletion in Step 1 is sufficient. Verify the section still renders correctly.

**Step 4: Verify in browser**

Navigate to the homepage and confirm category sections render without errors.

**Step 5: Commit**

```bash
git add src/lib/components/CategorySection.svelte
git commit -m "feat: migrate CategorySection to data-theme CSS custom properties"
```

---

## Task 9: Migrate `CategoryShowcase.svelte`

**Files:**
- Modify: `src/lib/components/CategoryShowcase.svelte`

**Step 1: Remove `colorClasses` and `hoverClasses` maps**

Delete lines 12–26:
```js
// DELETE:
const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    ...
};
const hoverClasses = {
    blue: 'hover:from-blue-600 hover:to-blue-700',
    ...
};
```

**Step 2: Remove `{@const gradientClass}` and `{@const hoverClass}` from the `{#each}` block**

Delete lines 40–41 inside the `{#each categories as category}` block:
```svelte
<!-- DELETE: -->
{@const gradientClass = colorClasses[themeColor] || colorClasses.blue}
{@const hoverClass = hoverClasses[themeColor] || hoverClasses.blue}
```

**Step 3: Replace the `<a>` tag's dynamic gradient classes with `data-theme` and inline style**

```svelte
<!-- BEFORE -->
<a
    href="/{category.fields.slug}"
    class="group block bg-gradient-to-br {gradientClass} {hoverClass} text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
>

<!-- AFTER -->
<a
    href="/{category.fields.slug}"
    data-theme={themeColor}
    class="group block text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
    style="background: linear-gradient(to bottom right, var(--theme-gradient-from), var(--theme-gradient-to));"
>
```

Note: The hover gradient darkening effect was previously done via `hover:from-*` / `hover:to-*` Tailwind utilities. With inline styles those aren't available. Use a CSS brightness filter instead by adding a Svelte `<style>` block to the component:

```svelte
<style>
    a:hover {
        filter: brightness(0.9);
    }
</style>
```

**Step 4: Verify in browser**

Navigate to a page that renders `CategoryShowcase` and confirm gradient cards display correctly for each category color. Hover to verify the darkening effect.

**Step 5: Commit**

```bash
git add src/lib/components/CategoryShowcase.svelte
git commit -m "feat: migrate CategoryShowcase to data-theme CSS custom properties"
```

---

## Task 10: Run full test suite and fix any failures

**Step 1: Run unit tests**

```bash
yarn test:unit
```

Expected: All 52 tests pass. Unit tests do not exercise Tailwind classes directly, so no failures are expected here.

**Step 2: Run E2E tests (if dev server is available)**

```bash
yarn test:e2e
```

Expected: All E2E tests pass. If any tests check for specific class names that were removed (e.g. `bg-indigo-900/30`), update those assertions to check for `data-theme` attribute instead.

**Step 3: Final visual check**

With `yarn dev`, spot-check the following pages:
- Homepage (`/`) — CategorySection and CategoryShowcase components visible
- A blog post page — CategoryHero and BlogPostContent badge visible
- A category page — ClusterHero badge and CategoryHero background visible

Confirm all theme colors render correctly for each category.

**Step 4: Commit any test fixes**

```bash
git add tests/
git commit -m "test: update e2e assertions for data-theme attribute pattern"
```

---

## Task 11: Update ADR-0004 in `decisions.md`

**Files:**
- Modify: `docs/project_notes/decisions.md`

**Step 1: Update the ADR**

In `docs/project_notes/decisions.md`, update ADR-0004 to reflect the completed upgrade:

- Change version from `TailwindCSS v3` to `TailwindCSS v4`
- Update the Decision section: mention `@import "tailwindcss"`, `@theme {}`, `@tailwindcss/vite`, no `tailwind.config.js`, no `autoprefixer`
- Update Consequences: note that `data-theme` CSS custom property system replaces JS `colorClasses` maps; `tailwind.config.js` no longer exists

**Step 2: Update `MEMORY.md`**

Update the Stack entry to reflect TailwindCSS v4.

**Step 3: Commit**

```bash
git add docs/project_notes/decisions.md
git commit -m "docs: update ADR-0004 to reflect Tailwind v4 upgrade"
```
