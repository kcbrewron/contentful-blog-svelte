# Image Optimization Design — LCP / Core Web Vitals
**Date:** 2026-03-01
**Status:** Approved

## Problem

All images in the app are served as raw Contentful CDN URLs with no transformation parameters, no loading priority hints, no responsive srcset, and no lazy loading. This causes:

- Hero images on every page type (homepage, blog post, category) fully block LCP
- Full-resolution images (potentially 3000px+) delivered to mobile viewports
- No WebP/AVIF delivery — browsers receive JPEG/PNG regardless of support
- No `width`/`height` attributes → CLS risk while images load
- No `preconnect` to `images.ctfassets.net` → cold TCP on first image request
- Below-the-fold card images eagerly loaded alongside critical hero images

## LCP Candidates by Page

| Page | LCP Element | Component |
|---|---|---|
| Homepage | First hero background image (50vw quadrant) | `Hero.svelte` |
| Blog post | Full-width featured image | `BlogPostContent.svelte` |
| Category | Full-width background hero image | `CategoryHero.svelte` |

## Approach: Shared Contentful Image Utility (Option B)

A thin utility module centralizes all Contentful Image API URL construction. Components remain flexible in markup while eliminating all URL-building duplication.

**Rejected alternatives:**
- Option A (inline params per component): URL logic duplicated across 6 files
- Option C (ContentfulImage.svelte component): Adds abstraction layer without benefit; images differ too much in context (background overlay vs card vs full-width hero)

---

## Design

### 1. `src/lib/contentful/imageUtils.js` (new file)

**`buildContentfulImageUrl(url, opts)`**

Accepts a raw Contentful asset URL (protocol-relative `//images.ctfassets.net/...` or full HTTPS) and returns a fully-qualified HTTPS URL with Contentful Image API query parameters.

```
opts defaults:
  format:  'webp'
  quality: 80
  fit:     'fill'
  width:   (none — omitted if not specified)
  height:  (none — omitted if not specified)
  focus:   (none)
```

Null-safe: returns `''` on empty/null input.

**`buildContentfulSrcset(url, widths, opts)`**

Generates a W-descriptor srcset string by calling `buildContentfulImageUrl` once per width:

```
buildContentfulSrcset(url, [400, 800, 1200])
→ "https://images.ctfassets.net/...?w=400&fm=webp&q=80 400w,
   https://images.ctfassets.net/...?w=800&fm=webp&q=80 800w,
   https://images.ctfassets.net/...?w=1200&fm=webp&q=80 1200w"
```

### 2. `src/app.html`

Add preconnect hint before `%sveltekit.head%`:
```html
<link rel="preconnect" href="https://images.ctfassets.net" />
```

Opens TCP+TLS to Contentful's image CDN before any HTML parsing reaches the first `<img>` tag. Expected saving: ~200–400ms on cold connections.

### 3. `src/routes/+page.server.js`

Change `featuredImages` from `string[]` to `{ url: string, width: number, height: number }[]`:

```js
const featuredImages = recentPosts
  .slice(0, 4)
  .map((post) => {
    const file = post.fields.featuredImage?.fields?.file;
    return file ? {
      url: file.url,
      width: file.details?.image?.width,
      height: file.details?.image?.height
    } : null;
  })
  .filter(Boolean);
```

### 4. Component Updates

#### `Hero.svelte`
- Accept `featuredImages` as `{ url, width, height }[]` (breaking change from string[])
- First image (`index === 0`): `fetchpriority="high"`, no lazy
- Images 1–3: `loading="lazy"`, `decoding="async"`
- All images: srcset at `[400, 800, 1200]`, `sizes="(min-width:1024px) 50vw, 100vw"`
- All images: `width` and `height` from object

#### `BlogPostContent.svelte`
- Featured image: `fetchpriority="high"`, no lazy
- `srcset` at `[800, 1200, 1600]`, `sizes="(min-width:1280px) 1152px, 100vw"`
- Author avatar: `loading="lazy"`, `decoding="async"`, `width="48"` `height="48"`, srcset at `[48, 96]`

#### `CategoryHero.svelte`
- Hero background image: `fetchpriority="high"`, no lazy
- `srcset` at `[800, 1200, 1600]`, `sizes="100vw"`

#### `BlogPostCard.svelte`
- All card images: `loading="lazy"`, `decoding="async"`
- `srcset` at `[400, 800]`, `sizes="(min-width:768px) 40vw, 100vw"`

#### `ImageContentBlock.svelte`
- Content images: `loading="lazy"`, `decoding="async"`
- `srcset` at `[400, 800]`, `sizes="(min-width:768px) 50vw, 100vw"`

#### `AboutSection.svelte`
- Avatar: `loading="lazy"`, `decoding="async"`, srcset at `[96, 192]`, `sizes="48px"`

### 5. Unit Tests (`tests/unit/imageUtils.test.js`)

New test file covering:
- `buildContentfulImageUrl` with null/empty URL → returns `''`
- Protocol-relative URL `//images.ctfassets.net/...` → upgraded to `https://`
- Default params applied (webp, q=80, fit=fill)
- Override params (avif format, quality 60, custom width)
- `buildContentfulSrcset` output format (W descriptors, correct URL per width)
- `buildContentfulSrcset` with empty widths → returns `''`

---

## Expected Impact

| Metric | Before | Expected After |
|---|---|---|
| LCP (hero) | Full original image, no priority signal | WebP at correct viewport size, `fetchpriority=high` |
| Image bytes (mobile) | ~300–600KB JPEG at 2000px+ | ~40–80KB WebP at 400px |
| CLS from images | Risk (no width/height) | Eliminated (explicit dimensions) |
| Below-fold eager loads | All images | None — all below-fold lazy |
| Time to first byte of hero | Waits for HTML parse + CSS | Preconnect head-start |

## Files Changed

| File | Change type |
|---|---|
| `src/lib/contentful/imageUtils.js` | **New** |
| `tests/unit/imageUtils.test.js` | **New** |
| `src/app.html` | Edit — add preconnect |
| `src/routes/+page.server.js` | Edit — featuredImages shape |
| `src/lib/components/Hero.svelte` | Edit — props + img attributes |
| `src/lib/components/BlogPostContent.svelte` | Edit — img attributes |
| `src/lib/components/CategoryHero.svelte` | Edit — img attributes |
| `src/lib/components/BlogPostCard.svelte` | Edit — img attributes |
| `src/lib/components/ImageContentBlock.svelte` | Edit — img attributes |
| `src/lib/components/AboutSection.svelte` | Edit — img attributes |
