# Article Page Redesign

Date: 2026-03-07
Status: Approved for Implementation

## Goal

Redesign the article reading experience to match the dark slate/zinc/indigo design language established in the category cluster pages (ClusterHero, FeaturedArticleCluster, ArticleGridCluster). The current BlogPostContent.svelte uses a light design (bg-white/bg-gray-50) that is visually inconsistent with the rest of the site.

## Approach: Dark Chrome, Elevated Prose Well (Option B)

The header and surrounding chrome use the same dark slate-950 treatment as cluster pages. The prose reading column sits on a subtly elevated bg-slate-900 container. Related articles appear in a right sidebar on large screens and stack below the content on mobile.

---

## Design Zones

### 1. Article Header

Mirrors ClusterHero visually.

- Background: `bg-gradient-to-b from-slate-950 to-slate-900`, `pt-20 pb-16 lg:pt-28 lg:pb-20`
- Container: `mx-auto max-w-7xl px-6 lg:px-8`
- Breadcrumb: Home / [Category] / [Article title] — `text-sm text-zinc-400`, links `hover:text-white transition-colors`
- Category badge: colored pill using category `themeColor` (same colorClasses map as ClusterHero) — dot + label
- Title: `text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-4xl`
- Tag pills (below title): `bg-slate-800 border border-zinc-700 text-zinc-300 text-xs rounded-full px-3 py-1` inline flex row with gap-2
- Excerpt: `text-lg text-zinc-300 leading-relaxed max-w-2xl`
- Author row: `w-12 h-12 rounded-full` avatar + author name (`text-white font-medium`) + date + reading time (`text-sm text-zinc-400`)

### 2. Featured Image

- Outer: `bg-slate-950 px-6 lg:px-8 py-10`
- Container: `mx-auto max-w-7xl`
- Image: `w-full h-auto rounded-xl shadow-lg`
- Subtle overlay: `bg-gradient-to-t from-black/20 to-transparent`

### 3. Two-Column Body Layout

- Outer: `bg-slate-950 px-6 lg:px-8 py-12`
- Container: `mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12`

#### Main Column — Prose Reading Well

- Container: `bg-slate-900 rounded-xl border border-zinc-800 px-8 py-10 lg:px-12 lg:py-12`
- Body text: `text-zinc-200`
- Headings: `text-white`
- Links: `text-indigo-400 hover:text-indigo-300 underline`
- Blockquotes: `border-l-4 border-indigo-500 pl-6 text-zinc-300 italic`
- Code blocks: `bg-slate-950` (naturally elevated from the slate-900 well)
- Images: `rounded-lg` with optional caption in `text-sm text-zinc-500`
- Bottom of main column: updated date (`text-sm text-zinc-500`) + back-to-category link (`text-indigo-400 hover:text-indigo-300`)

#### Right Sidebar — Related Articles

- Visible: always (stacks below main content on mobile, sticky sidebar on lg+)
- Sticky: `sticky top-24 self-start`
- Heading: "More from [Category Name]" — `text-lg font-bold text-white mb-4`
- Compact card stack (up to 3 posts, current post excluded):
  - `bg-slate-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-indigo-500 transition-colors`
  - Thumbnail: `aspect-video rounded-t-lg object-cover`
  - Title: `text-sm font-semibold text-white line-clamp-2`
  - Meta: date + reading time — `text-xs text-zinc-500`
- Footer link: "View all [Category] articles →" — `text-sm text-indigo-400 hover:text-indigo-300`

### 4. Content Block Tokens (updated)

| Component | Key change |
|-----------|-----------|
| ParagraphBlock | `text-zinc-200` body, `text-white` headings, `text-indigo-400 underline` links |
| BlockQuote | `border-l-4 border-indigo-500 pl-6 text-zinc-300 italic bg-slate-800/50 py-2 rounded-r` |
| CodeBlock | `bg-slate-950 text-zinc-100` — unchanged from current but gains visual contrast from prose well |
| ImageContentBlock | image `rounded-lg`, caption `text-sm text-zinc-500 mt-2 text-center` |

---

## Data Layer Changes

### `[categorySlug]/[articleSlug]/+page.server.js`

Add a `getPostsByCategory` call after fetching the post:

```js
const categoryId = post.fields.category?.sys?.id;
const allCategoryPosts = categoryId ? await getPostsByCategory(categoryId, preview) : [];
const relatedPosts = allCategoryPosts
  .filter(p => p.sys.id !== post.sys.id)
  .slice(0, 3);

return { post, relatedPosts };
```

### `BlogPostContent.svelte`

- Accept new `relatedPosts` prop
- Import and render new `RelatedArticles` component in sidebar slot

---

## New Component: RelatedArticles.svelte

Props:
- `articles: Array` — up to 3 related posts
- `categorySlug: string` — for card links and "View all" link
- `categoryName: string` — for section heading

Renders a vertical stack of compact cards. On mobile renders as a full-width section below the prose well. On lg+ renders as the sticky right sidebar.

---

## Files to Change

| File | Change |
|------|--------|
| `src/lib/components/BlogPostContent.svelte` | Full redesign — dark header, two-column layout, prose well |
| `src/lib/components/ParagraphBlock.svelte` | Update text/link color tokens |
| `src/lib/components/BlockQuote.svelte` | Update to indigo left-border style |
| `src/lib/components/ImageContentBlock.svelte` | Update caption style |
| `src/lib/components/CodeBlock.svelte` | Verify bg-slate-950 works in new context |
| `src/routes/[categorySlug]/[articleSlug]/+page.server.js` | Add relatedPosts fetch |
| `src/lib/components/RelatedArticles.svelte` (new) | Compact sidebar card stack |

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| < lg | Single column: header, image, prose well, then related articles below |
| lg+ | Two-column: prose well left, related articles sidebar right (sticky) |
