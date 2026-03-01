# Image Optimization (LCP / Core Web Vitals) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve LCP on homepage, blog post, and category pages by serving WebP at correct viewport sizes with proper fetch priority, lazy loading, and a `preconnect` to the Contentful image CDN.

**Architecture:** A single shared utility (`imageUtils.js`) builds Contentful Image API URLs and srcset strings. Each component imports these helpers and adds `fetchpriority`, `loading`, `decoding`, `srcset`, and `sizes` attributes appropriate to whether the image is above-the-fold (LCP candidate) or below. No new UI component is added.

**Tech Stack:** SvelteKit, Contentful Image API (URL params), Vitest (unit tests), TailwindCSS (no changes needed)

---

## Context You Need

- **Contentful image URLs** come from the SDK as `//images.ctfassets.net/...` (protocol-relative). They must be upgraded to `https://` before adding query params.
- **Contentful Image API** transforms are applied via query string: `?w=800&fm=webp&q=80&fit=fill`
- **Image dimensions** are returned by the Contentful SDK at `file.details.image.width` / `file.details.image.height` when queries use `include: 2` or higher (all queries in this app do).
- **Test command:** `yarn test:unit` (runs Vitest over `tests/unit/**/*.test.js`)
- **Test globals:** `describe`, `it`, `expect` are available globally — no need to import them in test files.
- **$lib alias** resolves to `src/lib` in tests (configured in `vite.config.js`).

---

## Task 1: Write failing tests for `imageUtils.js`

**Files:**
- Create: `tests/unit/imageUtils.test.js`

**Step 1: Create the test file**

```js
// tests/unit/imageUtils.test.js
import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';

const PROTO_URL = '//images.ctfassets.net/abc/xyz/photo.jpg';
const HTTPS_URL = 'https://images.ctfassets.net/abc/xyz/photo.jpg';

describe('buildContentfulImageUrl', () => {
	it('returns empty string for null input', () => {
		expect(buildContentfulImageUrl(null)).toBe('');
	});

	it('returns empty string for empty string input', () => {
		expect(buildContentfulImageUrl('')).toBe('');
	});

	it('returns empty string for undefined input', () => {
		expect(buildContentfulImageUrl(undefined)).toBe('');
	});

	it('upgrades protocol-relative URL to HTTPS', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result.startsWith('https:')).toBe(true);
	});

	it('preserves an existing HTTPS URL', () => {
		const result = buildContentfulImageUrl(HTTPS_URL);
		expect(result.startsWith('https://images.ctfassets.net')).toBe(true);
	});

	it('applies default format webp', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).toContain('fm=webp');
	});

	it('applies default quality 80', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).toContain('q=80');
	});

	it('applies default fit fill', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).toContain('fit=fill');
	});

	it('appends width param when provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { width: 800 });
		expect(result).toContain('w=800');
	});

	it('appends height param when provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { height: 600 });
		expect(result).toContain('h=600');
	});

	it('omits width param when not provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).not.toContain('w=');
	});

	it('omits height param when not provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).not.toContain('h=');
	});

	it('allows format override to avif', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { format: 'avif' });
		expect(result).toContain('fm=avif');
	});

	it('allows quality override', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { quality: 60 });
		expect(result).toContain('q=60');
	});

	it('appends focus param when provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { focus: 'faces' });
		expect(result).toContain('f=faces');
	});

	it('omits focus param when not provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).not.toContain('f=');
	});
});

describe('buildContentfulSrcset', () => {
	it('returns empty string for null URL', () => {
		expect(buildContentfulSrcset(null, [400, 800])).toBe('');
	});

	it('returns empty string for empty string URL', () => {
		expect(buildContentfulSrcset('', [400, 800])).toBe('');
	});

	it('returns empty string for empty widths array', () => {
		expect(buildContentfulSrcset(PROTO_URL, [])).toBe('');
	});

	it('returns empty string for null widths', () => {
		expect(buildContentfulSrcset(PROTO_URL, null)).toBe('');
	});

	it('generates one entry per width', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400, 800, 1200]);
		const parts = result.split(', ');
		expect(parts).toHaveLength(3);
	});

	it('uses W-descriptor format for each entry', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400, 800]);
		const parts = result.split(', ');
		expect(parts[0]).toMatch(/400w$/);
		expect(parts[1]).toMatch(/800w$/);
	});

	it('embeds correct width param in each URL', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400, 800, 1200]);
		expect(result).toContain('w=400');
		expect(result).toContain('w=800');
		expect(result).toContain('w=1200');
	});

	it('passes additional opts to each URL', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400], { format: 'avif', quality: 70 });
		expect(result).toContain('fm=avif');
		expect(result).toContain('q=70');
	});
});
```

**Step 2: Run tests to verify they fail**

```bash
yarn test:unit
```

Expected: All tests fail with `Cannot find module '$lib/contentful/imageUtils.js'`

---

## Task 2: Implement `imageUtils.js`

**Files:**
- Create: `src/lib/contentful/imageUtils.js`

**Step 1: Create the utility**

```js
// src/lib/contentful/imageUtils.js

/**
 * Contentful Images API URL builder utilities.
 * @see https://www.contentful.com/developers/docs/references/images-api/
 */

/**
 * @param {string|null|undefined} url
 * @returns {string}
 */
function normalizeContentfulUrl(url) {
	if (!url) return '';
	if (url.startsWith('//')) return 'https:' + url;
	return url;
}

/**
 * Builds a Contentful Images API URL with transformation parameters.
 *
 * @param {string|null|undefined} url - Raw Contentful asset URL (protocol-relative or HTTPS)
 * @param {Object} [opts]
 * @param {number} [opts.width] - Output width in pixels
 * @param {number} [opts.height] - Output height in pixels
 * @param {'webp'|'avif'|'jpg'|'png'|'gif'} [opts.format='webp'] - Output format
 * @param {number} [opts.quality=80] - Quality 1–100
 * @param {'fill'|'scale'|'crop'|'thumb'|'pad'} [opts.fit='fill'] - Resize behavior
 * @param {string} [opts.focus] - Focus area e.g. 'faces', 'center', 'top'
 * @returns {string} Fully-qualified HTTPS URL with query params, or '' for empty input
 */
export function buildContentfulImageUrl(url, opts = {}) {
	const normalized = normalizeContentfulUrl(url);
	if (!normalized) return '';

	const { width, height, format = 'webp', quality = 80, fit = 'fill', focus } = opts;

	const params = new URLSearchParams();
	if (width) params.set('w', String(width));
	if (height) params.set('h', String(height));
	params.set('fm', format);
	params.set('q', String(quality));
	params.set('fit', fit);
	if (focus) params.set('f', focus);

	return `${normalized}?${params.toString()}`;
}

/**
 * Builds a W-descriptor srcset string for responsive images.
 *
 * @param {string|null|undefined} url - Raw Contentful asset URL
 * @param {number[]|null} widths - Array of pixel widths e.g. [400, 800, 1200]
 * @param {Object} [opts] - Same options as buildContentfulImageUrl (width is overridden per entry)
 * @returns {string} srcset string or '' for empty input
 */
export function buildContentfulSrcset(url, widths, opts = {}) {
	if (!url || !widths || widths.length === 0) return '';
	return widths
		.map((w) => `${buildContentfulImageUrl(url, { ...opts, width: w })} ${w}w`)
		.join(', ');
}
```

**Step 2: Run tests to verify they pass**

```bash
yarn test:unit
```

Expected: All 25 existing tests + all new imageUtils tests pass. Look for output like:

```
✓ tests/unit/imageUtils.test.js (22 tests)
```

**Step 3: Commit**

```bash
git add src/lib/contentful/imageUtils.js tests/unit/imageUtils.test.js
git commit -m "feat: add Contentful image utility for URL transforms and srcset"
```

---

## Task 3: Add preconnect to Contentful image CDN

**Files:**
- Modify: `src/app.html`

**Step 1: Add the preconnect link**

In `src/app.html`, add this line immediately after the existing Google Fonts preconnect lines (after line 8, before `%sveltekit.head%`):

```html
<link rel="preconnect" href="https://images.ctfassets.net" />
```

The `<head>` section should look like:

```html
<head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="preconnect" href="https://images.ctfassets.net" />
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
    />
    %sveltekit.head%
</head>
```

**Step 2: Commit**

```bash
git add src/app.html
git commit -m "perf: add preconnect hint for images.ctfassets.net CDN"
```

---

## Task 4: Update `+page.server.js` — pass image dimensions with featured images

**Files:**
- Modify: `src/routes/+page.server.js`

**Why:** `Hero.svelte` needs intrinsic image dimensions to set `width`/`height` attributes and prevent CLS. The Contentful SDK returns dimensions at `file.details.image.width/height` when `include: 2+` is used — all queries already do this.

**Step 1: Update the `featuredImages` extraction**

Find this block (lines 43–46):

```js
const featuredImages = recentPosts
    .slice(0, 4)
    .map((post) => post.fields.featuredImage?.fields?.file?.url)
    .filter(Boolean);
```

Replace it with:

```js
const featuredImages = recentPosts
    .slice(0, 4)
    .map((post) => {
        const file = post.fields.featuredImage?.fields?.file;
        if (!file?.url) return null;
        return {
            url: file.url,
            width: file.details?.image?.width ?? null,
            height: file.details?.image?.height ?? null
        };
    })
    .filter(Boolean);
```

**Step 2: Commit**

```bash
git add src/routes/+page.server.js
git commit -m "feat: include image dimensions in homepage featuredImages data"
```

---

## Task 5: Update `Hero.svelte` — LCP priority on first image

**Files:**
- Modify: `src/lib/components/Hero.svelte`

**Context:** The homepage hero shows 4 images in a 2×2 grid behind a gradient overlay. The first image (`index === 0`) is the LCP candidate — it gets `fetchpriority="high"` and no lazy loading. Images 1–3 are below or beside the fold and get `loading="lazy"`.

**Step 1: Add import and update the script block**

The current `<script>` block ends at line 23. Add the import as the first line of the script:

```svelte
<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';

	/**
	 * @type {{ title?: string, subtitle?: string, description?: string, ctaText?: string, ctaUrl?: string }}
	 */
	export let heroData = {
		title: 'Ron Nelson',
		subtitle: 'Cloud & Software Architecture',
		description:
			'Practical insights on edge-native architecture, distributed systems design, AI workloads, and building on the Cloudflare platform.',
		ctaText: 'Explore Articles',
		ctaUrl: '#Cloud%20&%20Software%20Architecture'
	};

	/**
	 * @type {Array<{name: string, slug: string}>}
	 */
	export let categories = [];

	/**
	 * @type {Array<{url: string, width: number|null, height: number|null}>}
	 */
	export let featuredImages = [];
</script>
```

**Step 2: Update the image loop**

Find the `{#each featuredImages...}` block (lines 29–38):

```svelte
{#each featuredImages.slice(0, 4) as imageUrl, index}
    <div class="relative overflow-hidden animate-fade-in" style="animation-delay: {index * 100}ms">
        <img
            src={imageUrl}
            alt=""
            class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
        />
    </div>
{/each}
```

Replace with:

```svelte
{#each featuredImages.slice(0, 4) as image, index}
    <div class="relative overflow-hidden animate-fade-in" style="animation-delay: {index * 100}ms">
        <img
            src={buildContentfulImageUrl(image.url, { width: 800 })}
            srcset={buildContentfulSrcset(image.url, [400, 800, 1200])}
            sizes="(min-width:1024px) 50vw, 100vw"
            alt=""
            width={image.width ?? undefined}
            height={image.height ?? undefined}
            fetchpriority={index === 0 ? 'high' : undefined}
            loading={index === 0 ? undefined : 'lazy'}
            decoding={index === 0 ? undefined : 'async'}
            class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
        />
    </div>
{/each}
```

**Step 3: Verify dev server renders correctly**

```bash
npm run dev
```

Open http://localhost:5173 in browser. In DevTools → Network → Img, confirm:
- First hero image has `fetchpriority: high` in request headers
- Hero image URLs contain `?w=800&fm=webp&q=80&fit=fill`
- Images 2–4 are `loading: lazy`

**Step 4: Commit**

```bash
git add src/lib/components/Hero.svelte
git commit -m "perf: optimize Hero images with fetchpriority, WebP srcset, lazy loading"
```

---

## Task 6: Update `BlogPostContent.svelte` — LCP priority on featured image

**Files:**
- Modify: `src/lib/components/BlogPostContent.svelte`

**Context:** The featured image on a blog post page is the LCP element. It must be `fetchpriority="high"` with no lazy loading. The author avatar is small and below the featured image — lazy load it.

**Step 1: Add import to script block**

Add as first line inside `<script>`:

```js
import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
```

**Step 2: Add reactive dimension variables**

After the existing `$:` declarations, add:

```js
$: featuredImageWidth = post.fields.featuredImage?.fields?.file?.details?.image?.width;
$: featuredImageHeight = post.fields.featuredImage?.fields?.file?.details?.image?.height;
```

**Step 3: Update the featured image tag**

Find (lines 70–74):

```svelte
{#if featuredImageUrl}
    <div class="w-full max-w-6xl mx-auto px-4 py-8">
        <img src={featuredImageUrl} alt={post.fields.featuredImage?.fields?.description || post.fields.title} class="w-full h-auto rounded-lg shadow-lg" />
    </div>
{/if}
```

Replace with:

```svelte
{#if featuredImageUrl}
    <div class="w-full max-w-6xl mx-auto px-4 py-8">
        <img
            src={buildContentfulImageUrl(featuredImageUrl, { width: 1200 })}
            srcset={buildContentfulSrcset(featuredImageUrl, [800, 1200, 1600])}
            sizes="(min-width:1280px) 1152px, 100vw"
            alt={post.fields.featuredImage?.fields?.description || post.fields.title}
            width={featuredImageWidth}
            height={featuredImageHeight}
            fetchpriority="high"
            class="w-full h-auto rounded-lg shadow-lg"
        />
    </div>
{/if}
```

**Step 4: Update the author avatar**

Find (lines 54–55):

```svelte
{#if authorImage}
    <img src={authorImage} alt={authorName} class="w-12 h-12 rounded-full" />
{/if}
```

Replace with:

```svelte
{#if authorImage}
    <img
        src={buildContentfulImageUrl(authorImage, { width: 96, height: 96, fit: 'thumb', focus: 'faces' })}
        srcset={buildContentfulSrcset(authorImage, [48, 96], { fit: 'thumb', focus: 'faces' })}
        sizes="48px"
        alt={authorName}
        width="48"
        height="48"
        loading="lazy"
        decoding="async"
        class="w-12 h-12 rounded-full"
    />
{/if}
```

**Step 5: Commit**

```bash
git add src/lib/components/BlogPostContent.svelte
git commit -m "perf: optimize blog post featured image LCP with fetchpriority and WebP srcset"
```

---

## Task 7: Update `CategoryHero.svelte` — LCP priority on hero background

**Files:**
- Modify: `src/lib/components/CategoryHero.svelte`

**Step 1: Add import**

Add as first line inside `<script>`:

```js
import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
```

**Step 2: Update the hero image tag**

Find (lines 22–26):

```svelte
{#if heroImageUrl}
    <div class="absolute inset-0 opacity-20" aria-hidden="true">
        <img src={heroImageUrl} alt="" class="w-full h-full object-cover" />
    </div>
{/if}
```

Replace with:

```svelte
{#if heroImageUrl}
    <div class="absolute inset-0 opacity-20" aria-hidden="true">
        <img
            src={buildContentfulImageUrl(heroImageUrl, { width: 1600 })}
            srcset={buildContentfulSrcset(heroImageUrl, [800, 1200, 1600])}
            sizes="100vw"
            alt=""
            fetchpriority="high"
            class="w-full h-full object-cover"
        />
    </div>
{/if}
```

**Step 3: Commit**

```bash
git add src/lib/components/CategoryHero.svelte
git commit -m "perf: optimize CategoryHero background image with fetchpriority and WebP srcset"
```

---

## Task 8: Update `BlogPostCard.svelte` — lazy load card images

**Files:**
- Modify: `src/lib/components/BlogPostCard.svelte`

**Context:** Card images are never LCP candidates — they appear in grids below the hero. All get `loading="lazy"` and `decoding="async"`. There are two variants (horizontal and vertical) each with their own `<img>` tag.

**Step 1: Add import**

Add as first line inside `<script>`:

```js
import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
```

**Step 2: Update the horizontal variant image** (lines 41–46)

Find:

```svelte
<img
    src={featuredImageUrl}
    alt=""
    class="w-full h-48 md:h-full object-cover hover:opacity-90 transition-opacity"
/>
```

Replace with:

```svelte
<img
    src={buildContentfulImageUrl(featuredImageUrl, { width: 800 })}
    srcset={buildContentfulSrcset(featuredImageUrl, [400, 800])}
    sizes="(min-width:768px) 40vw, 100vw"
    alt=""
    loading="lazy"
    decoding="async"
    class="w-full h-48 md:h-full object-cover hover:opacity-90 transition-opacity"
/>
```

**Step 3: Update the vertical variant image** (lines 125–130)

Find:

```svelte
<img
    src={featuredImageUrl}
    alt=""
    class="w-full h-48 object-cover hover:opacity-90 transition-opacity"
/>
```

Replace with:

```svelte
<img
    src={buildContentfulImageUrl(featuredImageUrl, { width: 800 })}
    srcset={buildContentfulSrcset(featuredImageUrl, [400, 800])}
    sizes="(min-width:768px) 40vw, 100vw"
    alt=""
    loading="lazy"
    decoding="async"
    class="w-full h-48 object-cover hover:opacity-90 transition-opacity"
/>
```

**Step 4: Commit**

```bash
git add src/lib/components/BlogPostCard.svelte
git commit -m "perf: lazy load blog post card images with WebP srcset"
```

---

## Task 9: Update `ImageContentBlock.svelte` — lazy load content images

**Files:**
- Modify: `src/lib/components/ImageContentBlock.svelte`

**Context:** These are inline article content images, always below the featured image. There are two `<img>` tags (one for `imagePosition === 'left'`, one for right). Both are identical markup.

**Step 1: Add import**

Add as first line inside `<script>`:

```js
import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
```

**Step 2: Update both image tags**

There are two identical `<img>` tags in the template (lines 29 and 45). Replace both instances of:

```svelte
<img src={imageUrl} alt={imageAlt} class="w-full h-auto rounded-lg shadow-lg" />
```

With:

```svelte
<img
    src={buildContentfulImageUrl(imageUrl, { width: 800 })}
    srcset={buildContentfulSrcset(imageUrl, [400, 800])}
    sizes="(min-width:768px) 50vw, 100vw"
    alt={imageAlt}
    loading="lazy"
    decoding="async"
    class="w-full h-auto rounded-lg shadow-lg"
/>
```

**Step 3: Run all unit tests to confirm nothing broken**

```bash
yarn test:unit
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add src/lib/components/ImageContentBlock.svelte
git commit -m "perf: lazy load content block images with WebP srcset"
```

---

## Task 10: Final verification

**Step 1: Build and check for errors**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 2: Run unit tests one final time**

```bash
yarn test:unit
```

Expected: All tests pass.

**Step 3: Manual LCP check in dev**

```bash
npm run dev
```

In Chrome DevTools → Lighthouse → Performance (Mobile):
- Run audit on homepage (`/`)
- Check LCP — should now be the hero image with WebP format
- Network tab → Img filter: verify `fm=webp` in all image URLs
- Network tab: verify `images.ctfassets.net` shows as preconnected (lower TTFB on first image)

**Step 4: Update memory**

After confirming everything works, update `C:\Users\kcbrewron\.claude\projects\c--Users-kcbrewron-contentful-blog-svelte\memory\MEMORY.md` to add:

```markdown
## Image Optimization (added 2026-03-01)
- `src/lib/contentful/imageUtils.js` — buildContentfulImageUrl / buildContentfulSrcset utilities
- All hero images use fetchpriority="high", no lazy loading
- All card/content images use loading="lazy" decoding="async"
- WebP format at quality=80 via Contentful Image API (?fm=webp&q=80)
- Preconnect to images.ctfassets.net added to app.html
- Tests: tests/unit/imageUtils.test.js
```
