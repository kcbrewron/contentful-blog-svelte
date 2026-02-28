# ronnelson.dev — Brand Guide

Version 1.0 | February 2026
Author: UI Design System Review
Status: Approved for Implementation

---

## Table of Contents

1. [Brand Identity and Voice](#1-brand-identity-and-voice)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Spacing and Layout](#4-spacing-and-layout)
5. [Elevation and Shadow System](#5-elevation-and-shadow-system)
6. [Border Radius System](#6-border-radius-system)
7. [Component Inventory](#7-component-inventory)
8. [Interaction Patterns](#8-interaction-patterns)
9. [UX/UI Issues and Recommendations](#9-uxui-issues-and-recommendations)
10. [Design System Roadmap](#10-design-system-roadmap)

---

## 1. Brand Identity and Voice

### Positioning Statement

ronnelson.dev is the personal publishing platform of Ron Nelson — father, husband, software engineer, and technical leader. The site sits at the intersection of technical credibility and human warmth. It is not a faceless corporate dev blog. It is a personal record of what someone who thinks deeply about software and people has learned, is learning, and wants to share.

The audience is primarily other software engineers and technical leaders, with secondary reach to people navigating the "learning in public" space. The tone should make a senior staff engineer feel at home, while also being approachable enough that an engineer two years into their career finds it genuinely useful rather than intimidating.

### Core Brand Attributes

**Credible.** The writing is technically grounded. The design should not look experimental or unfinished. Every visual choice should communicate that this is someone who takes their work seriously.

**Warm.** The "father, husband, software engineer" framing in the About section is not accidental. The design should avoid the sterile coldness of a pure technology blog. There is a person here.

**Clear.** Ron values communicating clearly — this is a characteristic of both good technical writing and good leadership. The design enforces clarity through strong typographic hierarchy, generous whitespace, and a restrained color palette.

**Curious.** The breadth of topics — technology, leadership, outdoors, life — signals intellectual range. The design can hint at this through the category color system without becoming chaotic.

**Direct.** Nothing is buried. The navigation is flat. The content is front-and-center. This is a direct reflection of the writing style.

### Voice and Tone

**Writing voice (for any UI copy):** First person, conversational but precise. Uses "I" without apology. Avoids jargon for jargon's sake. Does not use buzzwords like "leverage" or "synergy." Treats the reader as a peer, not a student.

**UI copy tone scale:**
- Navigation labels: Noun-first, minimal. "Home", "Technology", "Leadership" — not "Browse Technology" or "Explore Leadership."
- CTAs: Action-first, honest. "Read more" is fine. "Explore Articles" works. Avoid "Learn More" as a generic fallback.
- Empty states: Reassuring and human. "No articles yet — check back soon." Not "No content found."
- Error states: Calm and helpful. Never blame the user.

### Logo

The wordmark `ronnelson.dev` uses a split color treatment to create identity from standard typography:

- `ron` — `text-blue-600` (#2563EB), `font-bold` (700)
- `nelson` — `text-gray-900` (#111827), `font-bold` (700)
- `.dev` — `text-gray-500` (#6B7280), `font-light` (300)

This three-part treatment works because it separates the personal name from the domain extension using both weight and color, giving the logo a typographic sophistication that does not require a custom icon. The blue on `ron` creates an anchor that ties the logo to the primary brand color.

**Logo rule:** Never separate the three parts. Never recolor individual segments outside the defined colors. The logo should always render at `text-2xl` minimum (1.5rem). In the nav it renders at `text-2xl`. Do not use the logo in all-white or all-dark monochrome contexts without a design review.

---

## 2. Color System

### Philosophy

The color system is built on a single primary hue (blue) extended by neutral grays and a set of semantic category colors. The palette is deliberately restrained — the primary accent is used sparingly so that its presence always signals interactivity or importance.

### Primary — Brand Blue

| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Primary | #2563EB | `blue-600` | Links, CTA buttons, logo accent, category text, active nav states, focus rings |
| Primary Dark | #1D4ED8 | `blue-700` | Hover state for primary buttons, hover state for blue text links |
| Primary Deeper | #1E40AF | `blue-800` | Hero gradient start, deep emphasis contexts |
| Primary Darkest | #1E3A5F | `blue-900` | Hero gradient overlay, decorative dark contexts only |

**When to use primary blue:** Any interactive element that the user should recognize as clickable and brand-affiliated. Reserve it. Do not use it for decorative purposes.

### Neutral — Grays

| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Text Primary | #111827 | `gray-900` | H1, H2, strong emphasis text, blockquote text |
| Text Secondary | #1F2937 | `gray-800` | Footer background, sub-headings in some contexts |
| Text Body | #374151 | `gray-700` | Prose body text, nav link text, secondary headings |
| Text Muted | #4B5563 | `gray-600` | Meta info (date, read time), descriptions, author byline |
| Text Subtle | #6B7280 | `gray-500` | Logo `.dev` suffix, tertiary labels, placeholder text |
| Border | #D1D5DB | `gray-300` | Dividers, card borders, input borders |
| Hairline | #E5E7EB | `gray-200` | Subtle separators, quote mark decoration |
| Surface Subtle | #F3F4F6 | `gray-100` | Tag backgrounds, nav link hover, code text on dark |
| Surface Light | #F9FAFB | `gray-50` | Article header background, blockquote background, featured post section |
| Surface White | #FFFFFF | `white` | Card backgrounds, nav background, primary page background |
| Surface Dark | #1F2937 | `gray-800` | Code block `pre` background |
| Surface Darkest | #111827 | `gray-900` | Code block section container |

### Semantic Colors

These are used for UI state communication, not decoration.

| Role | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Success | #16A34A | `green-600` | Success states, positive confirmations |
| Warning | #D97706 | `amber-600` | Warning badges, draft indicators |
| Error | #DC2626 | `red-600` | Errors, destructive actions |
| Info | #2563EB | `blue-600` | Info callouts (reuses primary blue) |

### Category Palette

Five categories are defined by theme color. Each color has three roles: a light background tint for section backgrounds, a solid color for text and icons, and a gradient pair for the CategoryShowcase cards.

| Category Color | Background (section) | Text / Icon | Gradient (card) | Hover Gradient |
|----------------|---------------------|-------------|-----------------|----------------|
| Blue | `bg-blue-50` (#EFF6FF) | `text-blue-600` (#2563EB) | `from-blue-500 to-blue-600` | `hover:from-blue-600 hover:to-blue-700` |
| Green | `bg-green-50` (#F0FDF4) | `text-green-600` (#16A34A) | `from-green-500 to-green-600` | `hover:from-green-600 hover:to-green-700` |
| Purple | `bg-purple-50` (#FAF5FF) | `text-purple-600` (#9333EA) | `from-purple-500 to-purple-600` | `hover:from-purple-600 hover:to-purple-700` |
| Red | `bg-red-50` (#FEF2F2) | `text-red-600` (#DC2626) | `from-red-500 to-red-600` | `hover:from-red-600 hover:to-red-700` |
| Orange | `bg-orange-50` (#FFF7ED) | `text-orange-600` (#EA580C) | `from-orange-500 to-orange-600` | `hover:from-orange-600 hover:to-orange-700` |

**Category color rule:** The category color controls the section background tint, the section title text, the "View all" link text, the CategoryHero solid background, and the CategoryShowcase card gradient. It does not bleed into unrelated UI. A post card rendered inside a category section still uses white background with gray text — the card is category-neutral.

### Hero Gradient

The hero uses a layered gradient system:

```
Layer 1 (image collage): Absolute positioned, full bleed, 2x2 grid
Layer 2 (primary overlay): bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-purple-900/95
Layer 3 (texture/depth): bg-gradient-to-t from-black/40 via-transparent to-black/20
```

The blue-to-purple shift in the hero is the only instance of purple in the primary brand context. It adds depth and avoids a flat blue wall. Do not use this gradient outside of the hero.

### Color Do's and Don'ts

**Do:**
- Use `blue-600` consistently for all interactive text links.
- Use `gray-600` for all post meta (date, author, read time) across all components.
- Use `gray-900` for all H1 and H2 headings.
- Use `gray-50` for article headers and blockquote section backgrounds.

**Don't:**
- Do not use `blue-500` anywhere — `blue-600` is the minimum for accessible contrast on white.
- Do not mix category colors in the same card or non-category context.
- Do not use the hero gradient on any component other than the homepage Hero.
- Do not use opacity variants of gray for text — use the solid gray scale tokens.

---

## 3. Typography System

### Font Recommendation

The current implementation uses the system font stack with no custom fonts loaded. This creates a personality gap — the site looks technically functional but visually generic. The following Google Fonts pairing is recommended and aligns with the brand attributes of credible, clear, and warm.

#### Recommended Pairing

**Display and Headings: Inter**
- Google Fonts import name: `Inter`
- Weights to load: 400, 500, 600, 700, 800
- Why: Inter is a humanist sans-serif designed specifically for screen readability. It has a slightly narrow proportion that reads well at large display sizes and retains clarity at body sizes. It is widely used in high-quality developer tools and publications (Linear, Vercel, Notion), which reinforces the "credible technical" positioning without feeling corporate.

**Body Prose and Long-Form Reading: Inter**
- For this site, using Inter across all text is the right call. The prose content benefits from the same humanist legibility. A second serif font would add complexity without clear benefit for a primarily technical audience.

**Monospace (Code): JetBrains Mono**
- Google Fonts import name: `JetBrains Mono`
- Weights to load: 400, 500
- Why: JetBrains Mono has programming ligatures, excellent character differentiation (0 vs O, 1 vs l vs I), and a slightly more modern character than Fira Code. It signals a developer who cares about their tools.

#### Google Fonts Import

Add this to `src/app.html` inside `<head>`, before the SvelteKit head tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

#### Tailwind Configuration Update

Add the following to `tailwind.config.js` under `theme.extend`:

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  },
},
```

### Type Scale

Each step in the scale has a semantic name used consistently across all components. Never use a size token outside its defined role without design review.

| Name | Size | Tailwind | Rem | Weight | Line Height | Usage |
|------|------|----------|-----|--------|-------------|-------|
| Display | 4.5rem | `text-7xl` | 72px | `font-bold` (700) | `leading-tight` | Hero H1, largest breakpoint (lg+) |
| H1 | 3.75rem | `text-6xl` | 60px | `font-bold` (700) | `leading-tight` | Hero H1 (md), Category hero H1 (lg+) |
| H1-sm | 3rem | `text-5xl` | 48px | `font-bold` (700) | `leading-tight` | Hero H1 (base), Category hero H1 (base/md), Article title (md+) |
| H2 | 2.25rem | `text-4xl` | 36px | `font-bold` (700) | `leading-snug` | Section headings (Recent Articles, Explore Topics), Blog post header H1 (base) |
| H3 | 1.875rem | `text-3xl` | 30px | `font-bold` (700) | `leading-snug` | Card titles, About heading, CategorySection title, featured section headings |
| H4 | 1.5rem | `text-2xl` | 24px | `font-semibold` (600) | `leading-snug` | Card H3 (horizontal variant), hero subtitle, blockquote text, prose H3 |
| H5 | 1.25rem | `text-xl` | 20px | `font-semibold` (600) | `leading-normal` | Descriptions, hero subtitle (md), code block caption, prose H4 |
| Body-lg | 1.125rem | `text-lg` | 18px | `font-normal` (400) | `leading-relaxed` | About bio, hero description, primary prose body |
| Body | 1rem | `text-base` | 16px | `font-normal` (400) | `leading-relaxed` | Default body text, card excerpt |
| Small | 0.875rem | `text-sm` | 14px | `font-medium` (500) | `leading-normal` | Meta info, nav links, tags, labels, author byline, "Read more" links |
| Caption | 0.75rem | `text-xs` | 12px | `font-medium` (500) | `leading-normal` | Code language badge, small platform badges |
| Code | inherit | `font-mono` | — | `font-normal` (400) | `leading-relaxed` | All code within CodeBlock and inline code |

### Typography Usage Rules

**Headings:** Always `gray-900` (#111827). Never use a category color for a heading outside of the CategorySection component where `titleColor` is intentional.

**Body prose:** Always `gray-700` (#374151). This is the `.prose` base color as currently defined in the global CSS.

**Meta information (date, author, read time, platform badge):** Always `gray-600` (#4B5563). This applies uniformly across BlogPostCard (both variants), BlogPostContent, and any future card component.

**Links in prose:** `blue-600` with `hover:underline`. This is the existing pattern in the prose CSS and should remain the standard. It is the most accessible and conventional pattern for in-body links.

**Interactive text links (outside prose):** `text-blue-600 hover:text-blue-700` with a `transition-colors duration-150` — see Section 8 for full interaction specification.

**Avoid:**
- Never use `font-light` (300) outside of the logo `.dev` suffix and the hero subtitle. Thin weights perform poorly on Windows rendering and reduce readability in body contexts.
- Never use `text-gray-400` or lighter for any text that conveys information. It fails WCAG AA contrast on white.
- Never use `text-black` — use `text-gray-900` to maintain the warm tone.

---

## 4. Spacing and Layout

### Spacing Scale

The project uses Tailwind's default spacing scale. The following values are the ones actively used and should be considered the canonical set. Introduce other values only for micro-adjustments that cannot be achieved with these.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` / `p-1` | 0.25rem (4px) | Icon gaps, tight inline spacing |
| `space-2` / `p-2` | 0.5rem (8px) | Button icon padding, small badge padding |
| `space-3` / `p-3` | 0.75rem (12px) | Nav link padding (`px-3 py-2`), pill padding |
| `space-4` / `p-4` | 1rem (16px) | Container horizontal padding (`px-4`), inline gap |
| `space-6` / `p-6` | 1.5rem (24px) | Card body padding (`p-6`), standard gap between meta items |
| `space-8` / `gap-8` | 2rem (32px) | Grid gap (card grids), section internal spacing |
| `space-12` / `py-12` | 3rem (48px) | Standard section vertical padding (CategorySection, ParagraphBlock, CodeBlock, BlockQuote) |
| `space-16` / `py-16` | 4rem (64px) | Medium section padding (RecentArticles, AboutSection, CategoryShowcase) |
| `space-20` / `py-20` | 5rem (80px) | CategoryHero vertical padding |
| `space-24` / `py-24` | 6rem (96px) | Homepage Hero vertical padding |

### Container Widths

Two container widths are used. This is correct and should remain as-is.

| Name | Tailwind | Max Width | Usage |
|------|----------|-----------|-------|
| Wide | `max-w-6xl` | 72rem (1152px) | Homepage sections, category pages, all multi-column layouts |
| Narrow | `max-w-4xl` | 56rem (896px) | Article header, article footer, blog post reading column, About section |

Both use `mx-auto px-4` to center and provide horizontal padding.

**Rule:** Never exceed `max-w-6xl` for page-level content. The narrow `max-w-4xl` is for reading-focused contexts only — article content, the About section.

### Section Rhythm

Sections stack vertically with consistent vertical padding. The pattern currently in use:

```
Hero:                py-24   (6rem top/bottom)
RecentArticles:      py-16   (4rem top/bottom)
CategorySection:     py-12   (3rem top/bottom)
CategoryShowcase:    py-16   (4rem top/bottom)
AboutSection:        py-16   (4rem top/bottom)
CategoryHero:        py-20   (5rem top/bottom)
ParagraphBlock:      py-12   (3rem top/bottom)
ImageContentBlock:   py-12   (3rem top/bottom)
CodeBlock:           py-12   (3rem top/bottom)
BlockQuote:          py-12   (3rem top/bottom)
```

**Recommendation:** Standardize content block sections (ParagraphBlock, ImageContentBlock, CodeBlock, BlockQuote) to `py-12`. Reserve `py-16` for primary page sections (RecentArticles, CategoryShowcase, About). Reserve `py-20+` for hero sections. This three-tier rhythm creates clear visual hierarchy at the page level.

### Grid System

| Context | Columns | Gap | Breakpoint |
|---------|---------|-----|------------|
| BlogPost card grid (vertical) | 1 / 2 / 3 | `gap-8` | base / md / lg |
| CategorySection post list | 1 (stacked) | `space-y-6` | — |
| ImageContentBlock | 1 / 2 | `gap-8` | base / md |
| CategoryShowcase | 1 / 3 | `gap-8` | base / md |
| Hero image collage | 2x2 | `gap-2` | — |

---

## 5. Elevation and Shadow System

The current codebase uses four shadow utilities (`shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`) without a clear semantic system. The following named elevation levels normalize this.

### Named Elevation Levels

| Level | Name | Tailwind Class | Hex Approximation | Usage |
|-------|------|----------------|-------------------|-------|
| 0 | Flat | `shadow-none` | No shadow | Inline elements, text, ghost buttons |
| 1 | Raised | `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle card lift, platform badges, small tags |
| 2 | Lifted | `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Navigation bar, default BlogPostCard, avatar image |
| 3 | Floating | `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Featured images (BlogPostContent), hero CTA button, CategoryShowcase cards, social link icon buttons |
| 4 | Overlay | `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | BlogPostCard on hover state, modal dialogs (future), dropdown menus (future) |
| 5 | Prominent | `shadow-2xl` | `0 25px 50px rgba(0,0,0,0.25)` | Hero CTA button (current use — this should be downgraded to `shadow-lg` for consistency) |

### Elevation Rules

**Navigation (sticky):** Level 2 (`shadow-md`). It needs to separate from content but should not feel heavy.

**Cards (default):** Level 2 (`shadow-md`). Resting state.

**Cards (hover):** Level 4 (`shadow-xl`). The elevation jump on hover communicates interactivity.

**Featured images:** Level 3 (`shadow-lg`). The image is a visual anchor; the shadow grounds it.

**CTA button in hero:** Level 3 (`shadow-lg`). The current `shadow-2xl` on the hero CTA is excessive given the already high-contrast white-on-dark-gradient context. Reduce to `shadow-lg`.

**CategoryShowcase cards:** Level 3 (`shadow-lg`). Appropriate for a large interactive card with gradient background.

**Code blocks:** Level 0 (`shadow-none`). Code blocks have a dark background that provides contrast — shadow would be invisible and unnecessary.

**Transition:** Always pair shadow elevation changes with `transition-shadow duration-300` for smoothness.

---

## 6. Border Radius System

| Name | Tailwind Class | Value | Usage |
|------|----------------|-------|-------|
| Sharp | `rounded-none` | 0px | Not currently used; reserved for table borders or code block `pre` elements if needed |
| Subtle | `rounded` | 4px | Not currently used explicitly; could be used for inline code chips |
| Default | `rounded-md` | 6px | Nav link hover background (`rounded-md` per current code), platform badges |
| Standard | `rounded-lg` | 8px | BlogPostCard, ImageContentBlock image, CodeBlock `pre`, CTA button, CategoryShowcase card |
| Full | `rounded-full` | 9999px | Tags in BlogPostContent footer, avatar image, hero category pill links |

### Radius Rules

**Cards:** Always `rounded-lg`. This applies to BlogPostCard (both variants) and CategoryShowcase cards.

**Images within cards:** Always `rounded-lg` when the image is standalone (ImageContentBlock, BlogPostContent featured image). When the image is at the top of a vertical BlogPostCard, use `overflow-hidden rounded-lg` on the article wrapper to clip the image — do not add radius to the `<img>` element directly as it creates a gap.

**Buttons:** `rounded-lg` for all standard buttons. `rounded-full` for pill-style links only (hero category pills, tags).

**Avatars:** Always `rounded-full`.

**Nav link hover state:** `rounded-md` (matches current implementation).

**Badges and tags:** `rounded-full` for user-facing tags in article footers. `rounded` (4px) for system-generated platform badges (Medium, Dev.to) where a tighter corner fits the inline context.

---

## 7. Component Inventory

### C01 — NavigationBar

**File:** `src/lib/components/NavigationBar.svelte`
**Also implemented in:** `src/routes/+layout.svelte` (inline, duplicated)

**Current state:** Two separate implementations exist. The `NavigationBar.svelte` component is used by `PageRenderer.svelte` for Contentful-managed pages. The `+layout.svelte` contains its own inline nav that is used for all route-based pages (the actual site). This duplication must be resolved.

The layout nav correctly implements the logo three-color split, sticky positioning with `z-50`, and desktop nav links with hover states. It has a mobile hamburger button that is entirely non-functional — `aria-expanded="false"` is hardcoded, there is no state variable, and there is no mobile menu panel to reveal.

**Current classes:**
- Container: `bg-white shadow-md sticky top-0 z-50`
- Logo: `text-2xl font-bold` in three spans
- Nav links: `text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors`
- Mobile button: `text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2`

**Issues:**
1. Duplicate implementation (NavigationBar.svelte vs +layout.svelte)
2. Mobile menu is non-functional
3. No active route highlighting
4. No `focus-visible` styles on desktop nav links
5. `aria-expanded` is hardcoded to false

**Recommended improvements:**
- Consolidate into a single `NavigationBar.svelte` component used by the layout.
- Add Svelte reactive `let mobileOpen = false` and toggle on button click.
- Add a mobile menu panel below the bar using `{#if mobileOpen}` with the same links in vertical layout, `py-4 px-4 bg-white border-t border-gray-200`.
- Add active state: use SvelteKit `$page.url.pathname` to apply `text-blue-600 bg-blue-50` to the matching nav link.
- Replace `focus:outline-none` on the mobile button with `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`.
- Add `aria-expanded={mobileOpen}` to the mobile button, and `aria-controls="mobile-menu"` / `id="mobile-menu"` on the panel.

### C02 — Hero

**File:** `src/lib/components/Hero.svelte`

**Current state:** Well-structured. The layered gradient approach with image collage background, two gradient overlays, and z-indexed content is sound. Animations (`animate-fade-in`, `animate-slide-up`) are defined in component `<style>` and work correctly. The CTA button uses white background with `text-blue-700`, which correctly inverts from the dark hero context.

**Current classes (key):**
- Section: `relative text-white py-24 overflow-hidden min-h-[600px] flex items-center`
- H1: `text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in drop-shadow-lg`
- Subtitle: `text-2xl md:text-3xl font-light mb-6 opacity-95`
- Category pills: `px-5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg`
- CTA: `inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105`

**Issues:**
1. `shadow-2xl` on the CTA is excessive — reduce to `shadow-lg`.
2. `hover:shadow-3xl` does not exist in Tailwind — this silently does nothing. Remove it.
3. The arrow SVG in the CTA points down (chevron down: `M19 9l-7 7-7-7`), which conventionally means "expand" or "scroll down." If the CTA scrolls to articles on the same page, this is acceptable. If it navigates to a different page, use a right arrow (`M9 5l7 7-7 7`).
4. Category pills have `hover:scale-105` — good. Ensure `transition-transform` is included or use `transition-all`. The current `transition-all duration-300` covers it.
5. No `focus-visible` styles on category pills or CTA button.

**Recommended improvements:**
- Change CTA to `shadow-lg hover:shadow-xl` for consistency with the elevation system.
- Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800` to the CTA (white ring on dark bg).
- Add `focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2` to category pills.

### C03 — RecentArticles

**File:** `src/lib/components/RecentArticles.svelte`

**Current state:** Simple and clean. White background section with centered header and a 3-column card grid. No issues with the section structure itself. The `limit` prop defaults to 6, which fills the grid neatly.

**Current classes:**
- Section: `py-16 bg-white`
- Header H2: `text-4xl font-bold text-gray-900 mb-4`
- Subtitle: `text-xl text-gray-600`

**Issues:**
1. No "View all articles" link. Users who arrive at the homepage want a way to see all posts, not just recent ones. Currently the only path to more posts is via category navigation.
2. The section has no `id` attribute — if a CTA or nav link needs to jump to "recent articles," there is no anchor.

**Recommended improvements:**
- Add `id="recent-articles"` to the section element.
- Add a centered "View all articles" link below the grid: `<a href="/blog" class="mt-10 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">View all articles <ArrowRight /></a>`. Note: this requires a `/blog` route to be built (see Section 10 Roadmap).

### C04 — CategorySection

**File:** `src/lib/components/CategorySection.svelte`

**Current state:** Handles theme color correctly through the `colorClasses` / `bgColorClasses` lookup objects. The horizontal BlogPostCard layout inside this section is the right choice — it distinguishes category sections from the vertical card grid in RecentArticles. The "View all" link with arrow is well-placed but hidden on mobile (`hidden md:inline-flex`) with no mobile equivalent.

**Issues:**
1. "View all" link is hidden on mobile with no replacement. Mobile users have no path from the category section to the full category page without using the nav.
2. The "View all" link uses `hover:underline` — this should be `hover:text-[color]-700` to match the interactive text link standard.
3. The category description `text-gray-600` is correct but the description `<p>` has no bottom margin before the card list when rendered without a description.

**Recommended improvements:**
- Below the card list, add a mobile-only "View all" link: `<a class="md:hidden mt-6 inline-flex items-center [themeColor] font-medium">View all {category.fields.name} →</a>`.
- Standardize "View all" hover to `hover:text-[color]-700` (e.g., `hover:text-blue-700`) instead of `hover:underline`.

### C05 — BlogPostCard

**File:** `src/lib/components/BlogPostCard.svelte`

**Current state:** The most complex component in the system with two variants (vertical and horizontal). The meta row pattern (category, bullet, date, bullet, read time, bullet, platform badge) is consistent between variants. The card hover using `hover:shadow-xl` and the `transition-shadow duration-300` is correct.

**Issues:**
1. Category link uses `hover:underline` in the meta row. This conflicts with the interactive link standard of `hover:text-blue-700`. Standardize to `text-blue-600 hover:text-blue-700 font-medium`.
2. "Read more" in vertical variant appends `→` as a Unicode character, while horizontal variant uses an SVG arrow in an `inline-flex` container. These are inconsistent. Use the SVG pattern in both.
3. Vertical card "Read more" link: `text-blue-600 hover:text-blue-800`. This skips `blue-700` and jumps to `blue-800`. Standardize to `hover:text-blue-700`.
4. Horizontal card "Read more" link: `text-blue-600 hover:text-blue-800` — same issue.
5. Card title (`h2` / `h3`) hover link uses `hover:text-blue-600 transition-colors`. This is correct for the neutral-text-turns-blue pattern. Keep this one.
6. The `line-clamp-3` utility is defined with custom CSS instead of using Tailwind's `line-clamp-3` (available since Tailwind v3.3). Remove the custom CSS and use `line-clamp-3` directly in the class list.
7. The horizontal variant's image link is `md:w-2/5` which can leave a large empty space when no image exists. Add a conditional class or a gray placeholder.

**Recommended improvements:**

For the category link in meta rows (both variants):
```html
<!-- Replace -->
<a href="/category/{categorySlug}" class="text-blue-600 hover:underline font-medium">

<!-- With -->
<a href="/category/{categorySlug}" class="text-blue-600 hover:text-blue-700 font-medium transition-colors">
```

For "Read more" in vertical variant:
```html
<!-- Replace -->
<a href={postUrl} class="text-blue-600 hover:text-blue-800 font-medium text-sm">
  {isExternalLink ? 'Read on ' + platform : 'Read more'} →
</a>

<!-- With -->
<a href={postUrl} class="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1 transition-colors">
  {isExternalLink ? 'Read on ' + platform : 'Read more'}
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  </svg>
</a>
```

### C06 — CategoryHero

**File:** `src/lib/components/CategoryHero.svelte`

**Current state:** Solid-color hero using the category `themeColor`. Uses `py-20` for height. The optional hero image at 20% opacity is a good touch — it adds texture without competing with the white text.

**Issues:**
1. The font size for `h1` is `text-5xl md:text-6xl` with no `lg:` size, unlike the homepage hero which uses `lg:text-7xl`. This is intentional (category hero should be secondary to the homepage hero) but should be noted as a deliberate choice.
2. Hero description uses `opacity-90 max-w-3xl mx-auto` — this is fine, but opacity on white text in a category-colored context can reduce contrast below AA on lighter category colors (orange, green). Test these explicitly.
3. No visual separator or breadcrumb between the CategoryHero and the content below. Users cannot tell from the hero alone which "level" of the site they are on.

**Recommended improvements:**
- Add a breadcrumb above the H1: `<p class="text-sm font-medium uppercase tracking-widest opacity-70 mb-4">Category</p>`.
- For the lighter category colors (orange, green), consider adding a darker gradient overlay: `<div class="absolute inset-0 bg-black/20"></div>` to ensure white text contrast.

### C07 — CategorySection (Showcase variant)

**File:** `src/lib/components/CategoryShowcase.svelte`

**Current state:** Gradient cards that link directly to category pages. The `hover:scale-105 transition-all duration-300 transform` lift effect is well-executed. The arrow `→` character with `group-hover:translate-x-2 transition-transform` is a nice affordance.

**Issues:**
1. `line-clamp-2` is defined as custom CSS. Replace with Tailwind's `line-clamp-2`.
2. The article count displays as "0 articles" when empty, which looks odd on the homepage before content is published. Consider hiding the count entirely when it is 0.
3. The card has no explicit `focus-visible` styles. Keyboard users will see the browser default outline, which looks inconsistent against the gradient background.

**Recommended improvements:**
- Replace `line-clamp-2` custom CSS with `line-clamp-2` in the class attribute.
- Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2` to the card anchor.
- Conditionally render post count: `{#if postCount > 0}<span>{postCount} {postCount === 1 ? 'article' : 'articles'}</span>{/if}`.

### C08 — AboutSection

**File:** `src/lib/components/AboutSection.svelte`

**Current state:** Clean two-column layout (avatar + text) that collapses to stacked on mobile. Social icons are correctly sized (`w-6 h-6`) with `hover:text-blue-600 transition-colors`. The `border-t border-gray-200` separator above the section is a good page-level divider.

**Issues:**
1. No `aria-label` or screen-reader context for the social icon links. Currently `aria-label={link.platform}` is present — this is correct. No action needed here.
2. The avatar renders a conditional — if `about.avatarUrl` is null, no placeholder displays. The section still renders but the layout shifts. Consider a placeholder avatar (initials circle in `bg-blue-600 text-white`) for when no image is provided.
3. Avatar `class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"` — uses `shadow-lg` (Level 3 — Floating). This is correct.

**Recommended improvements:**
- Add an initials fallback avatar:
  ```html
  {#if about.avatarUrl}
    <img ... />
  {:else}
    <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
      <span class="text-3xl font-bold text-white">RN</span>
    </div>
  {/if}
  ```

### C09 — BlockQuote

**File:** `src/lib/components/BlockQuote.svelte`

**Current state:** The decorative SVG quotation mark (`text-gray-200`) is positioned with `-translate-x-6 -translate-y-8`. The quote text uses `text-2xl font-medium text-gray-900 italic`. The author footer uses `font-semibold` for name and `text-sm text-gray-600` for title.

**Issues:**
1. The quote text uses `text-gray-900` — this is heading-weight darkness for body-style italic content. Consider `text-gray-700` for the quote body and reserve `text-gray-900` for the author name. This creates better visual hierarchy within the component itself.
2. The decorative SVG uses an absolute positioning approach. On mobile when the blockquote text is short, the SVG can overlap the quote text. Test at `text-2xl` with short quotes on narrow screens.
3. The section background `bg-gray-50` is correct per the design system.

**Recommended improvements:**
- Change quote text from `text-gray-900` to `text-gray-700`.
- Consider switching the decorative SVG to `relative` positioning above the text rather than absolute, to avoid mobile overlap. Alternatively, reduce the SVG size on mobile: `h-12 w-12 md:h-16 md:w-16`.

### C10 — ParagraphBlock

**File:** `src/lib/components/ParagraphBlock.svelte`

**Current state:** Renders a heading and rich text. Has complete prose CSS defined as `:global(.prose)` rules for all heading levels, paragraphs, lists, links, strong, and em.

**Critical issue:** The entire `:global(.prose)` CSS block (lines 32–98) is duplicated verbatim in `ImageContentBlock.svelte`. These are global styles — only one instance needs to exist. Having two identical global blocks risks specificity confusion and makes future updates error-prone.

**Recommended improvements:**
- Extract all `:global(.prose)` rules into `src/app.css` (or a dedicated `src/lib/styles/prose.css` imported in `app.css`). Remove the `<style>` blocks from both `ParagraphBlock.svelte` and `ImageContentBlock.svelte` entirely.

The consolidated prose styles in `src/app.css`:
```css
/* Prose typography */
.prose { color: #374151; }
.prose h1 { font-size: 2.25rem; font-weight: 800; line-height: 2.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #111827; }
.prose h2 { font-size: 1.875rem; font-weight: 700; line-height: 2.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #111827; }
.prose h3 { font-size: 1.5rem; font-weight: 600; line-height: 2rem; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #111827; }
.prose h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.75rem; margin-top: 1rem; margin-bottom: 0.5rem; color: #111827; }
.prose p { margin-bottom: 1rem; }
.prose ul, .prose ol { margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 1.5rem; }
.prose ul { list-style-type: disc; }
.prose ol { list-style-type: decimal; }
.prose li { margin-bottom: 0.5rem; }
.prose a { color: #2563eb; text-decoration: none; }
.prose a:hover { text-decoration: underline; }
.prose strong { font-weight: 700; color: #111827; }
.prose em { font-style: italic; }
```

Once Inter is added, update the prose color to reference the font: no change needed to the CSS since Inter is set globally via Tailwind's `fontFamily.sans` config.

### C11 — ImageContentBlock

**File:** `src/lib/components/ImageContentBlock.svelte`

**Current state:** Two-column layout with image and prose, switchable left/right via `imagePosition` prop. Uses the same prose global CSS as ParagraphBlock (see C10 for the duplication issue).

**Issues:**
1. Duplicate `:global(.prose)` CSS — resolve as described in C10.
2. Image uses `shadow-lg` (Level 3 — Floating). Correct per the elevation system.
3. The prose column has `class="prose prose-lg"` but no `max-w-none`. When used inside the `max-w-6xl` container with a 2-col grid, Tailwind's prose may apply its own `max-width` constraint. Add `max-w-none` to both prose divs (as ParagraphBlock correctly does with `prose-lg max-w-none`).

**Recommended improvements:**
- Fix prose duplication (move to app.css).
- Add `max-w-none` to prose column divs:
  ```html
  <div class="order-2 prose prose-lg max-w-none">
  ```

### C12 — CodeBlock

**File:** `src/lib/components/CodeBlock.svelte`

**Current state:** Dark background section (`bg-gray-900`), `pre` with `bg-gray-800`, `rounded-lg`, with a language badge positioned absolutely at `top-3 right-3`.

**Issues:**
1. The caption uses `text-xl font-semibold` — which is H5 level. This is correct but the text color `text-gray-100` gives high contrast. Fine.
2. No copy-to-clipboard button. This is a meaningful UX gap for a developer blog.
3. The language badge `text-xs text-gray-400 uppercase font-mono` — `text-gray-400` on `bg-gray-900` has a contrast ratio of approximately 3.5:1, which fails WCAG AA for small text (requires 4.5:1). Change to `text-gray-300`.
4. No syntax highlighting. The code is rendered as plain monospaced text. For a technical blog, adding Prism.js or Shiki for server-side syntax highlighting would significantly improve value.

**Recommended improvements:**
- Change language badge from `text-gray-400` to `text-gray-300` immediately for accessibility.
- Add a copy button (client-side Svelte):
  ```svelte
  <script>
    let copied = false;
    function copyCode() {
      navigator.clipboard.writeText(section.fields.code);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  </script>
  <!-- Inside the relative wrapper div -->
  <button
    on:click={copyCode}
    class="absolute top-3 right-16 text-xs text-gray-400 hover:text-gray-200 font-mono transition-colors"
    aria-label="Copy code"
  >
    {copied ? 'Copied!' : 'Copy'}
  </button>
  ```

---

## 8. Interaction Patterns

### Hover States

All interactive elements must have visible hover states. The following are the canonical patterns:

**Text links (in prose, body):**
```css
/* Standard: color + underline on hover */
class="text-blue-600 hover:underline"
```

**Text links (UI / nav context, outside prose):**
```css
/* Standard: color shift */
class="text-blue-600 hover:text-blue-700 transition-colors duration-150"
```

**Card title links:**
```css
/* Standard: neutral text goes blue */
class="text-gray-900 hover:text-blue-600 transition-colors duration-150"
```

**Navigation links:**
```css
/* Standard: bg highlight + text darkening */
class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md transition-colors duration-150"
```

**Icon-only links (social, etc.):**
```css
/* Standard: muted to brand */
class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
```

**Cards:**
```css
/* Standard: shadow elevation jump */
class="shadow-md hover:shadow-xl transition-shadow duration-300"
```

**Primary buttons (white on dark, in hero):**
```css
/* Standard: bg tint, scale */
class="bg-white text-blue-700 hover:bg-gray-100 hover:scale-105 transition-all duration-300"
```

**Category pills (on dark hero):**
```css
/* Standard: opacity increase, scale */
class="bg-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300"
```

**Category showcase cards:**
```css
/* Standard: gradient shift, scale */
class="hover:scale-105 transition-all duration-300"
```

### Focus Styles

This is the largest accessibility gap in the current implementation. Focus styles must be present and visible for keyboard navigation. The following system should be applied globally and per-component.

**Global default focus-visible (add to app.css):**
```css
:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}

/* Remove the default outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

This global rule establishes a `blue-600` ring for all focused elements for keyboard users, while not showing an outline for mouse clicks.

**Component-level overrides (where the global blue ring is not sufficient):**

- Hero CTA button (white button on dark bg): `focus-visible:ring-white focus-visible:ring-offset-blue-900`
- Category pills (on dark bg): `focus-visible:ring-white`
- CategoryShowcase cards (on gradient): `focus-visible:ring-white`
- Nav mobile button: Already has `focus:ring-2 focus:ring-inset focus:ring-blue-500` — update to `focus-visible:` prefix.

**Tailwind approach using the `focus-visible` variant:**
```html
class="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
```

### Transitions

Consistent transition timing prevents jarring UI. The following durations are canonical:

| Duration | Tailwind | Usage |
|----------|----------|-------|
| Fast | `duration-150` | Color changes, text color transitions |
| Standard | `duration-200` | Icon color changes, opacity |
| Medium | `duration-300` | Shadow changes, background color changes, scale transforms |
| Slow | `duration-500` | Complex multi-property transitions (not currently used) |
| Deliberate | `duration-700` | Hero image collage zoom on hover |

**Easing:**
- Use `ease-out` for all transitions that start on a user action (hover, focus). This makes UI feel responsive.
- Use `ease-in-out` for looping animations or enter/exit sequences.
- The current `animation: slide-up 0.8s ease-out` and `animation: fade-in 0.8s ease-out` in Hero are correct.

### Animation

The Hero component defines two keyframe animations. These should be the template for any future entrance animations:

**fade-in (image collage panels):**
```css
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**slide-up (text content):**
```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Staggered delay pattern (from Hero):**
`animation-delay: 0ms`, `100ms`, `200ms`, `300ms` — this is correct and creates a natural reading order reveal.

**Accessibility note:** Always respect `prefers-reduced-motion`. Add to app.css:
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

## 9. UX/UI Issues and Recommendations

Issues are prioritized as Critical (accessibility/functionality), High (significant UX impact), and Medium (consistency/polish).

### Critical

**Issue 1: Mobile navigation is entirely non-functional**
Location: `src/routes/+layout.svelte` lines 41–63

The hamburger button is hardcoded with `aria-expanded="false"`, has no click handler, and there is no mobile menu panel. Mobile users on the homepage have no way to access category pages through the nav.

Fix:
```svelte
<script>
  let mobileOpen = false;
  function toggleMobile() { mobileOpen = !mobileOpen; }
</script>

<!-- Button -->
<button
  type="button"
  on:click={toggleMobile}
  aria-expanded={mobileOpen}
  aria-controls="mobile-menu"
  class="md:hidden text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 p-2"
>
  <span class="sr-only">{mobileOpen ? 'Close menu' : 'Open main menu'}</span>
  <!-- Swap icon based on state -->
  {#if mobileOpen}
    <svg class="h-6 w-6" ...><!-- X icon --></svg>
  {:else}
    <svg class="h-6 w-6" ...><!-- Hamburger icon --></svg>
  {/if}
</button>

<!-- Mobile menu panel -->
{#if mobileOpen}
  <div id="mobile-menu" class="md:hidden border-t border-gray-200 bg-white py-2 px-4 space-y-1">
    <a href="/" class="block text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
    {#each data.categories as category}
      <a href="/category/{category.fields.slug}" class="block text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
        {category.fields.name}
      </a>
    {/each}
  </div>
{/if}
```

**Issue 2: No focus-visible styles — site is not keyboard navigable**
Location: All components, `src/app.css`

Browsers show a visible focus ring by default, but this site uses `focus:outline-none` on some elements (mobile button) which hides the ring entirely for keyboard users. This is a WCAG 2.1 Level AA failure (Success Criterion 2.4.7 Focus Visible).

Fix: Add the global focus-visible CSS described in Section 8, then replace all instances of `focus:outline-none` with `focus-visible:outline-none`.

**Issue 3: Language badge fails contrast on CodeBlock**
Location: `src/lib/components/CodeBlock.svelte` line 14

`text-gray-400` (#9CA3AF) on `bg-gray-900` (#111827) = ~3.5:1 contrast ratio. Fails WCAG AA for small text (requires 4.5:1).

Fix: Change `text-gray-400` to `text-gray-300` (#D1D5DB). Contrast ratio becomes ~7.4:1.

### High

**Issue 4: Duplicate prose global CSS across two components**
Location: `ParagraphBlock.svelte` lines 32–98, `ImageContentBlock.svelte` lines 53–119

The identical `:global(.prose)` CSS block exists in two component files. Any future update to prose styles (e.g., adding Inter font, changing link color) must be made in two places. One will inevitably drift.

Fix: Move all prose CSS to `src/app.css` and delete the `<style>` blocks from both components. No functional change.

**Issue 5: No custom fonts — the site has no visual identity**
Location: `src/app.html`, `tailwind.config.js`

The system font stack varies across operating systems. On Windows, it renders as Segoe UI. On macOS, San Francisco. On Linux, whatever the system default is. This means the site looks visually different depending on the device, and it lacks any distinctive typographic personality.

Fix: Add Inter and JetBrains Mono as specified in Section 3. Estimated implementation time: 30 minutes.

**Issue 6: No design tokens — all values are hardcoded**
Location: `tailwind.config.js`, all component files

There are no CSS custom properties defining brand colors, spacing, or typography. If the primary blue changes from `blue-600` to a custom hex, every component must be manually updated. This is a scalability problem that compounds as the component library grows.

Fix (phase 1, low-overhead): Add CSS custom properties to `src/app.css`:
```css
:root {
  --color-primary: #2563EB;
  --color-primary-dark: #1D4ED8;
  --color-text-heading: #111827;
  --color-text-body: #374151;
  --color-text-muted: #4B5563;
  --color-surface-white: #FFFFFF;
  --color-surface-subtle: #F9FAFB;
  --color-border: #E5E7EB;
}
```

Fix (phase 2, full integration): Extend `tailwind.config.js` with these as CSS variable references:
```javascript
theme: {
  extend: {
    colors: {
      brand: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
      }
    }
  }
}
```

**Issue 7: No active state on navigation links**
Location: `src/routes/+layout.svelte`

Users cannot tell which page they are on from the navigation. The currently active route should be visually distinguished.

Fix using SvelteKit's `$page`:
```svelte
<script>
  import { page } from '$app/stores';
</script>

<!-- Nav link with active state -->
<a
  href="/category/{category.fields.slug}"
  class="px-3 py-2 rounded-md text-sm font-medium transition-colors
    {$page.url.pathname === '/category/' + category.fields.slug
      ? 'bg-blue-50 text-blue-600'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
>
```

**Issue 8: Inconsistent link hover styles across components**
Location: Multiple components

Three different hover patterns coexist for the same "link" use case:
- `hover:underline` (BlogPostCard category meta, BlogPostContent back link, prose links)
- `hover:text-blue-800` (BlogPostCard "Read more", vertical and horizontal)
- `hover:text-blue-600` (card title links)
- `hover:text-blue-700` (not used anywhere, but is the correct token)

Fix: Standardize to the patterns defined in Section 8. Specifically:
- Prose links: `hover:underline` — keep this only in prose contexts.
- UI text links (meta, "Read more", "View all", back links): `hover:text-blue-700 transition-colors duration-150`.
- Card title links: `hover:text-blue-600 transition-colors duration-150` — this pattern of neutral-to-primary is correct and distinct from the primary-to-dark pattern above. Keep it.

**Issue 9: CategorySection "View all" link hidden on mobile**
Location: `src/lib/components/CategorySection.svelte` line 56

The `hidden md:inline-flex` class means mobile users see category posts but have no link to the full category page. The category name itself is not linked.

Fix: Add a mobile-specific "View all" link below the post list. Additionally, consider making the category H2 itself a link on mobile:
```html
<!-- On mobile, the heading can be a link -->
<h2 class="text-3xl font-bold {titleColor} mb-2">
  <a href="/category/{category.fields.slug}" class="md:pointer-events-none">{category.fields.name}</a>
</h2>
```

### Medium

**Issue 10: CTA button uses `hover:shadow-3xl` which does not exist**
Location: `src/lib/components/Hero.svelte` line 83

`shadow-3xl` is not a valid Tailwind class. It silently fails. The button simply does not change shadow on hover.

Fix: Remove `hover:shadow-3xl`. Replace `shadow-2xl` with `shadow-lg`. The button sits on a visually complex dark hero — the shadow effect is nearly invisible anyway, and scale-up (`hover:scale-105`) is the more effective affordance here.

**Issue 11: No reading progress indicator on blog posts**
Location: `src/routes/blog/[slug]/+page.svelte` (route), `BlogPostContent.svelte`

Long-form technical content benefits from a reading progress bar. This is a minor but meaningful UX detail for a developer audience.

Fix: Add a fixed top bar that measures scroll progress relative to article height. Implement as a new `ReadingProgress.svelte` component.

**Issue 12: No "scroll to top" affordance on long category pages**
Location: Category pages with many posts

When a user scrolls through a long category page, there is no quick way to return to the top to access navigation.

Fix: Add a floating "Back to top" button that appears after scrolling 400px, positioned `fixed bottom-6 right-6`.

**Issue 13: BlogPostCard image has `hover:opacity-90 transition-opacity`**
Location: `BlogPostCard.svelte` lines 41, 120

The image fades slightly on hover, which competes with the card's `hover:shadow-xl` elevation change. Two hover effects on the same element create visual noise. The shadow change on the card wrapper is sufficient.

Fix: Remove `hover:opacity-90 transition-opacity` from all featured image tags inside BlogPostCard.

**Issue 14: Footer is minimal and lacks navigation**
Location: `src/routes/+layout.svelte` lines 74–78

The footer contains only a copyright line. A technical blog footer should at minimum provide navigation redundancy and optionally a brief bio link.

Fix:
```html
<footer class="bg-gray-800 text-white py-12 mt-auto">
  <div class="container mx-auto px-4 max-w-6xl">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div>
        <a href="/" class="flex items-center space-x-1 mb-3">
          <span class="text-xl font-bold text-blue-400">ron</span>
          <span class="text-xl font-bold text-white">nelson</span>
          <span class="text-xl font-light text-gray-400">.dev</span>
        </a>
        <p class="text-sm text-gray-400 leading-relaxed">Software engineer and technical leader sharing what I'm learning.</p>
      </div>
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Topics</h4>
        <ul class="space-y-2">
          {#each data.categories as category}
            <li><a href="/category/{category.fields.slug}" class="text-gray-300 hover:text-white text-sm transition-colors">{category.fields.name}</a></li>
          {/each}
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Connect</h4>
        <!-- Social links -->
      </div>
    </div>
    <div class="border-t border-gray-700 pt-6 text-center">
      <p class="text-sm text-gray-500">&copy; {new Date().getFullYear()} ronnelson.dev. All rights reserved.</p>
    </div>
  </div>
</footer>
```

Note: For the footer, the logo accent color shifts to `text-blue-400` (instead of `blue-600`) to maintain readability against the `gray-800` background while preserving the brand blue identity.

---

## 10. Design System Roadmap

The following items are ordered by recommended implementation priority. Each is categorized by effort (S = hours, M = 1-2 days, L = 3+ days).

### Phase 1 — Foundation (implement first, unblocks everything else)

**1.1 Add custom fonts** (S)
Add Inter and JetBrains Mono via Google Fonts. Update `tailwind.config.js` `fontFamily`. This immediately improves visual quality across the entire site.

**1.2 Consolidate prose CSS** (S)
Move the duplicated `:global(.prose)` block from `ParagraphBlock.svelte` and `ImageContentBlock.svelte` into `src/app.css`. Delete the `<style>` blocks from both components.

**1.3 Add global focus-visible styles** (S)
Add `:focus-visible` and `prefers-reduced-motion` CSS to `src/app.css` as specified in Section 8.

**1.4 Fix mobile navigation** (S)
Implement the `mobileOpen` toggle and mobile menu panel in `+layout.svelte` as specified in Issue 1.

**1.5 Define CSS custom properties** (S)
Add the `:root` color token block to `src/app.css` as specified in Issue 6.

### Phase 2 — Consistency Pass (standardize what exists)

**2.1 Standardize link hover states** (S)
Go through all components and align hover patterns as specified in Issue 8 and Section 8.

**2.2 Fix CodeBlock language badge contrast** (S)
One class change: `text-gray-400` to `text-gray-300`.

**2.3 Fix Hero CTA shadow** (S)
Change `shadow-2xl hover:shadow-3xl` to `shadow-lg hover:shadow-xl` in `Hero.svelte`.

**2.4 Add active nav state** (S)
Use `$page` store to highlight the current route in the navigation.

**2.5 Fix CategorySection mobile "View all"** (S)
Add mobile-visible link below the post list.

**2.6 Add `max-w-none` to ImageContentBlock prose columns** (S)
Two-character addition per prose div.

**2.7 Remove duplicate card image hover opacity** (S)
Remove `hover:opacity-90 transition-opacity` from BlogPostCard image elements.

### Phase 3 — New Components

**3.1 Enhanced Footer** (M)
Implement the three-column footer with navigation links, mini bio, and social icons. Reference the implementation in Issue 14.

**3.2 Avatar Fallback** (S)
Add the initials circle fallback to `AboutSection.svelte`.

**3.3 CodeBlock Copy Button** (S)
Add clipboard copy with "Copied!" confirmation as specified in C12.

**3.4 ReadingProgress Component** (M)
New `src/lib/components/ReadingProgress.svelte`. A fixed `<div>` with `position: fixed; top: 0; left: 0; height: 3px; background: #2563EB; z-index: 100;` with width driven by a scroll event listener that calculates `scrollY / (document.body.scrollHeight - window.innerHeight) * 100`.

**3.5 BackToTop Component** (S)
New `src/lib/components/BackToTop.svelte`. A button that appears via Svelte's `fly` transition after 400px scroll depth, positioned `fixed bottom-6 right-6`.

**3.6 Tag Component** (S)
Extract the tag pill pattern (currently inlined in `BlogPostContent.svelte` footer) into a reusable `Tag.svelte` component: `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{tag}</span>`.

**3.7 Badge Component** (S)
Extract the platform badge pattern (currently inlined in `BlogPostCard.svelte`) into a reusable `Badge.svelte` component: `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{platform}</span>`.

**3.8 Breadcrumb Component** (M)
New `src/lib/components/Breadcrumb.svelte` for use on article and category pages. Displays the path: `Home > Category > Article Title`. Uses `text-sm text-gray-500` with `text-blue-600` for linked segments.

### Phase 4 — New Features and Routes

**4.1 Blog Index Route** (M)
Create `src/routes/blog/+page.svelte` and `+page.server.js`. A paginated list of all posts from all categories, sorted by date. Uses vertical BlogPostCard layout. Adds the "View all articles" destination that RecentArticles should link to.

**4.2 Search Component** (L)
Client-side search using a pre-built index. Given the Cloudflare edge deployment, a lightweight approach using `fuse.js` or `minisearch` is appropriate. Search opens in an overlay modal triggered by a search icon in the nav.

**4.3 Related Posts** (M)
At the bottom of `BlogPostContent.svelte`, display 2-3 posts from the same category. Requires passing related posts from the server load function.

**4.4 Table of Contents** (M)
For long articles, a sticky sidebar table of contents that highlights the current section as the user scrolls. Built from the H2/H3 headings in the rich text content. Appears on `lg:` breakpoints only using a two-column layout (`grid grid-cols-[1fr_280px]`).

**4.5 Open Graph / Social Preview Images** (M)
The site already includes `<meta property="og:image">` in BlogPostContent. Ensure all category pages and the homepage also have appropriate OG images. Consider generating dynamic OG images using a Cloudflare Worker function.

**4.6 Dark Mode** (L)
Not a current requirement, but the color system is prepared for it. The primary blue `blue-600` has good contrast on both light and dark surfaces. The main changes would be: nav from white to `gray-900`, card backgrounds from white to `gray-800`, prose text from `gray-700` to `gray-300`. Implement using Tailwind's `darkMode: 'class'` and a `ThemeToggle` component in the nav.

### Design Token Migration (Ongoing)

As Phase 1.5 CSS custom properties are adopted, gradually migrate hardcoded Tailwind color references to use the token references. This is a long-term consistency initiative that does not need to happen all at once.

Target state for `tailwind.config.js`:
```javascript
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A5F',
        }
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  safelist: [
    // (existing safelist unchanged)
  ],
  plugins: [],
}
```

Moving the Hero keyframes into `tailwind.config.js` means the component's `<style>` block can be deleted entirely, keeping the component clean.

---

*End of Brand Guide — ronnelson.dev v1.0*
