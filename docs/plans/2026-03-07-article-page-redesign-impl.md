# Article Page Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the full article reading experience to match the dark slate/zinc/indigo design language of the category cluster pages, with a two-column layout (prose well + related articles sidebar) on large screens.

**Architecture:** `BlogPostContent.svelte` is fully redesigned with a dark header (mirrors ClusterHero), full-width featured image, and a two-column body — prose well on `bg-slate-900` left, `RelatedArticles` sidebar right (sticky on lg+, stacks below on mobile). Content block components (`ParagraphBlock`, `BlockQuote`, `ImageContentBlock`, `CodeBlock`) each receive a `dark` boolean prop forwarded from `SectionRenderer` so they render correctly inside the dark prose well without breaking existing `PageRenderer` usage. A `.prose-dark` CSS modifier is added to `app.css` to invert the custom prose color tokens.

**Tech Stack:** SvelteKit, TailwindCSS 3 (no Typography plugin — custom `.prose` CSS), Contentful, `buildContentfulImageUrl` / `buildContentfulSrcset` from `$lib/contentful/imageUtils.js`

---

## Task 1: Add `.prose-dark` to `app.css`

**Files:**
- Modify: `src/app.css`

**Step 1: Add the dark prose modifier block**

After the existing `.prose` block (around line 267, before the Prism section), insert:

```css
/* ─── Dark prose variant ────────────────────────────────────────────────────── */
/* Used inside the dark prose well in BlogPostContent */

.prose-dark {
  color: #e4e4e7; /* zinc-200 */
}

.prose-dark h1,
.prose-dark h2,
.prose-dark h3,
.prose-dark h4,
.prose-dark h5 {
  color: #ffffff;
}

.prose-dark h6 {
  color: #d4d4d8; /* zinc-300 */
}

.prose-dark a {
  color: #818cf8; /* indigo-400 */
  text-decoration: underline;
}

.prose-dark a:hover {
  color: #a5b4fc; /* indigo-300 */
  text-decoration: none;
}

.prose-dark strong {
  color: #f4f4f5; /* zinc-100 */
}

.prose-dark hr {
  border-top-color: #3f3f46; /* zinc-700 */
}

.prose-dark code {
  background-color: #1e1e2e;
  color: #e4e4e7;
  border-color: #3f3f46;
}

.prose-dark blockquote {
  border-left-color: #6366f1; /* indigo-500 */
  color: #d4d4d8; /* zinc-300 */
}

.prose-dark th {
  background-color: #1e293b; /* slate-800 */
  color: #f4f4f5;
  border-bottom-color: #3f3f46;
}

.prose-dark td {
  color: #d4d4d8;
  border-bottom-color: #27272a; /* zinc-800 */
}

.prose-dark tbody tr:nth-child(even) {
  background-color: #1e293b;
}

.prose-dark .prose-table-wrapper {
  border-color: #3f3f46;
}
```

**Step 2: Verify dev server compiles without errors**

Run: `npm run dev`
Expected: Server starts, no CSS errors in terminal.

**Step 3: Commit**

```bash
git add src/app.css
git commit -m "style: add prose-dark modifier for dark prose well"
```

---

## Task 2: Create `RelatedArticles.svelte`

**Files:**
- Create: `src/lib/components/RelatedArticles.svelte`

**Step 1: Write the component**

```svelte
<script>
	import { buildContentfulImageUrl } from '$lib/contentful/imageUtils.js';

	/**
	 * @type {Array<any>}
	 */
	export let articles = [];

	/**
	 * @type {string}
	 */
	export let categorySlug = '';

	/**
	 * @type {string}
	 */
	export let categoryName = '';

	/**
	 * @param {any} article
	 * @returns {string}
	 */
	function getImageUrl(article) {
		const url = article?.fields?.featuredImage?.fields?.file?.url;
		if (!url) return '';
		return buildContentfulImageUrl(url, {
			width: 640,
			height: 360,
			fit: 'fill',
			format: 'webp',
			quality: 80
		});
	}

	/**
	 * @param {any} article
	 * @returns {string}
	 */
	function getFormattedDate(article) {
		const date = article?.fields?.publishedDate;
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#if articles.length > 0}
	<div>
		<h2 class="text-lg font-bold text-white mb-4">More from {categoryName}</h2>

		<div class="flex flex-col gap-4">
			{#each articles as article (article.sys.id)}
				{@const slug = article?.fields?.slug || ''}
				{@const title = article?.fields?.title || ''}
				{@const imageUrl = getImageUrl(article)}
				{@const date = getFormattedDate(article)}
				{@const readingTime = article?.fields?.readingTimeMinutes || 5}

				<a
					href="/{categorySlug}/{slug}"
					class="group flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-slate-900 transition-all hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10"
				>
					{#if imageUrl}
						<div class="relative h-40 overflow-hidden">
							<img
								src={imageUrl}
								alt={title}
								class="h-full w-full object-cover transition-transform group-hover:scale-105"
								loading="lazy"
								decoding="async"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
							></div>
						</div>
					{:else}
						<div class="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
							<svg
								class="h-10 w-10 text-zinc-700"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
					{/if}

					<div class="p-4">
						<h3
							class="text-sm font-semibold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors mb-2"
						>
							{title}
						</h3>
						<div class="flex items-center gap-2 text-xs text-zinc-500">
							<span>{date}</span>
							<span>·</span>
							<span>{readingTime} min read</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<a
			href="/{categorySlug}"
			class="mt-6 inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
		>
			View all {categoryName} articles
			<svg
				class="h-4 w-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 7l5 5m0 0l-5 5m5-5H6"
				/>
			</svg>
		</a>
	</div>
{/if}
```

**Step 2: Commit**

```bash
git add src/lib/components/RelatedArticles.svelte
git commit -m "feat: add RelatedArticles sidebar component"
```

---

## Task 3: Fetch `relatedPosts` in the article server loader

**Files:**
- Modify: `src/routes/[categorySlug]/[articleSlug]/+page.server.js`

**Step 1: Update the load function**

Replace the entire file with:

```javascript
import { getBlogPostBySlug, getPostsByCategory } from '$lib/contentful/queries.js';
import { error } from '@sveltejs/kit';

/**
 * Load blog post and related posts from the same category
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.categorySlug - Category slug
 * @param {string} params.params.articleSlug - Article slug
 * @param {Object} params.url - Request URL
 * @returns {Promise<{post: Object, relatedPosts: Array}>}
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	const post = await getBlogPostBySlug(params.articleSlug, preview);

	if (!post) {
		throw error(404, { message: 'Article not found' });
	}

	const postCategorySlug = post.fields.category?.fields?.slug;
	if (postCategorySlug !== params.categorySlug) {
		throw error(404, { message: 'Article not found in this category' });
	}

	const categoryId = post.fields.category?.sys?.id;
	const allCategoryPosts = categoryId ? await getPostsByCategory(categoryId, preview) : [];
	const relatedPosts = allCategoryPosts
		.filter((p) => p.sys.id !== post.sys.id)
		.slice(0, 3);

	return { post, relatedPosts };
}
```

**Step 2: Commit**

```bash
git add src/routes/[categorySlug]/[articleSlug]/+page.server.js
git commit -m "feat: fetch related posts by category in article loader"
```

---

## Task 4: Pass `relatedPosts` from the page route

**Files:**
- Modify: `src/routes/[categorySlug]/[articleSlug]/+page.svelte`

**Step 1: Update the page to pass relatedPosts**

Replace the entire file with:

```svelte
<script>
	import BlogPostContent from '$lib/components/BlogPostContent.svelte';

	/**
	 * @type {{ data: { post: any, relatedPosts: Array<any> } }}
	 */
	export let data;
</script>

<BlogPostContent post={data.post} relatedPosts={data.relatedPosts} />
```

**Step 2: Commit**

```bash
git add src/routes/[categorySlug]/[articleSlug]/+page.svelte
git commit -m "feat: pass relatedPosts to BlogPostContent"
```

---

## Task 5: Add `dark` prop forwarding to `SectionRenderer`

**Files:**
- Modify: `src/lib/components/SectionRenderer.svelte`

**Step 1: Add the dark prop and forward it**

Replace the entire file with:

```svelte
<script>
	import ParagraphBlock from './ParagraphBlock.svelte';
	import ImageContentBlock from './ImageContentBlock.svelte';
	import BlockQuote from './BlockQuote.svelte';
	import CodeBlock from './CodeBlock.svelte';

	/**
	 * @type {Array<any>}
	 */
	export let sections = [];

	/**
	 * When true, section components render with dark color tokens
	 * @type {boolean}
	 */
	export let dark = false;

	/**
	 * Maps content type IDs to their corresponding components
	 * @param {string} contentType
	 */
	function getComponentForSection(contentType) {
		const componentMap = {
			paragraphBlock: ParagraphBlock,
			imageContentBlock: ImageContentBlock,
			blockQuote: BlockQuote,
			codeBlock: CodeBlock
		};

		return componentMap[contentType] || null;
	}
</script>

{#if sections && sections.length > 0}
	{#each sections as section}
		{#if section.sys?.contentType?.sys?.id}
			{@const Component = getComponentForSection(section.sys.contentType.sys.id)}
			{#if Component}
				<svelte:component this={Component} {section} {dark} />
			{:else}
				<div class="py-4 px-4 {dark ? 'bg-slate-800 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}">
					Unknown section type: {section.sys.contentType.sys.id}
				</div>
			{/if}
		{/if}
	{/each}
{:else}
	<div class="py-12 text-center {dark ? 'text-zinc-500' : 'text-gray-600'}">
		No content sections available.
	</div>
{/if}
```

**Step 2: Commit**

```bash
git add src/lib/components/SectionRenderer.svelte
git commit -m "feat: forward dark prop through SectionRenderer"
```

---

## Task 6: Update `ParagraphBlock` for dark mode

**Files:**
- Modify: `src/lib/components/ParagraphBlock.svelte`

**Step 1: Replace the component**

```svelte
<script>
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { richTextOptions } from '$lib/contentful/richTextOptions.js';

	/**
	 * @type {{ fields: { heading: string, richContent?: any, content?: string, alignment?: string } }}
	 */
	export let section;

	/**
	 * When true, renders with dark color tokens (for use inside dark prose well)
	 * @type {boolean}
	 */
	export let dark = false;

	$: alignment = section.fields.alignment || 'left';
	$: alignmentClass = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	}[alignment];

	$: htmlContent = section.fields.richContent
		? documentToHtmlString(section.fields.richContent, richTextOptions)
		: `<p>${section.fields.content || ''}</p>`;
</script>

<section class="py-6 {dark ? '' : 'bg-white'}">
	<div class="{dark ? '' : 'container mx-auto px-4 max-w-4xl'}">
		<h2 class="text-3xl font-bold mb-6 {dark ? 'text-white' : 'text-gray-900'} {alignmentClass}">
			{section.fields.heading}
		</h2>
		<div class="prose {dark ? 'prose-dark' : ''} prose-lg {alignmentClass}">
			{@html htmlContent}
		</div>
	</div>
</section>
```

**Step 2: Commit**

```bash
git add src/lib/components/ParagraphBlock.svelte
git commit -m "feat: add dark prop to ParagraphBlock"
```

---

## Task 7: Update `BlockQuote` for dark mode

**Files:**
- Modify: `src/lib/components/BlockQuote.svelte`

**Step 1: Replace the component**

```svelte
<script>
	/**
	 * @type {{ fields: { quote: string, author?: string, authorTitle?: string } }}
	 */
	export let section;

	/**
	 * When true, renders with dark color tokens (for use inside dark prose well)
	 * @type {boolean}
	 */
	export let dark = false;
</script>

<section class="py-6 {dark ? '' : 'bg-white'}">
	<div class="{dark ? '' : 'container mx-auto px-4 max-w-4xl'}">
		<blockquote
			class="border-l-4 {dark
				? 'border-indigo-500 pl-6 bg-slate-800/50 py-3 rounded-r-lg'
				: 'border-gray-200 pl-5'}"
		>
			<p class="text-lg {dark ? 'text-zinc-300' : 'text-gray-600'} italic leading-relaxed">
				{section.fields.quote}
			</p>
			{#if section.fields.author}
				<footer class="mt-3">
					<p class="text-sm {dark ? 'text-zinc-400' : 'text-gray-700'} not-italic">
						— <span class="font-semibold">{section.fields.author}</span>{#if section.fields.authorTitle},
							<span class="{dark ? 'text-zinc-500' : 'text-gray-500'} font-normal"
								>{section.fields.authorTitle}</span
							>{/if}
					</p>
				</footer>
			{/if}
		</blockquote>
	</div>
</section>
```

**Step 2: Commit**

```bash
git add src/lib/components/BlockQuote.svelte
git commit -m "feat: add dark prop to BlockQuote"
```

---

## Task 8: Update `ImageContentBlock` for dark mode

**Files:**
- Modify: `src/lib/components/ImageContentBlock.svelte`

**Step 1: Replace the component**

```svelte
<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { richTextOptions } from '$lib/contentful/richTextOptions.js';

	/**
	 * @type {{ fields: { heading: string, richContent?: any, content?: string, image: any, imagePosition: string } }}
	 */
	export let section;

	/**
	 * When true, renders with dark color tokens (for use inside dark prose well)
	 * @type {boolean}
	 */
	export let dark = false;

	$: imagePosition = section.fields.imagePosition || 'left';
	$: imageUrl = section.fields.image?.fields?.file?.url;
	$: imageAlt = section.fields.image?.fields?.description || section.fields.image?.fields?.title || '';

	$: htmlContent = section.fields.richContent
		? documentToHtmlString(section.fields.richContent, richTextOptions)
		: section.fields.content
			? `<p>${section.fields.content}</p>`
			: '';
</script>

<section class="py-6 {dark ? '' : 'bg-white'}">
	<div class="{dark ? '' : 'container mx-auto px-4 max-w-4xl'}">
		<h2 class="text-3xl font-bold mb-8 {dark ? 'text-white' : 'text-gray-900'}">
			{section.fields.heading}
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
			{#if imagePosition === 'left'}
				<div class="order-1">
					{#if imageUrl}
						<img
							src={buildContentfulImageUrl(imageUrl, { width: 800 })}
							srcset={buildContentfulSrcset(imageUrl, [400, 800])}
							sizes="(min-width:768px) 50vw, 100vw"
							alt={imageAlt}
							loading="lazy"
							decoding="async"
							class="w-full h-auto rounded-lg {dark ? 'shadow-lg shadow-black/40' : 'shadow-lg'}"
						/>
					{/if}
				</div>
				{#if htmlContent}
					<div class="order-2 prose {dark ? 'prose-dark' : ''} prose-lg">
						{@html htmlContent}
					</div>
				{/if}
			{:else}
				{#if htmlContent}
					<div class="order-2 md:order-1 prose {dark ? 'prose-dark' : ''} prose-lg">
						{@html htmlContent}
					</div>
				{/if}
				<div class="order-1 md:order-2">
					{#if imageUrl}
						<img
							src={buildContentfulImageUrl(imageUrl, { width: 800 })}
							srcset={buildContentfulSrcset(imageUrl, [400, 800])}
							sizes="(min-width:768px) 50vw, 100vw"
							alt={imageAlt}
							loading="lazy"
							decoding="async"
							class="w-full h-auto rounded-lg {dark ? 'shadow-lg shadow-black/40' : 'shadow-lg'}"
						/>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>
```

**Step 2: Commit**

```bash
git add src/lib/components/ImageContentBlock.svelte
git commit -m "feat: add dark prop to ImageContentBlock"
```

---

## Task 9: Update `CodeBlock` to use slate tokens

**Files:**
- Modify: `src/lib/components/CodeBlock.svelte`

**Step 1: Update background classes only**

Change line 55: `<section class="py-6 bg-gray-900">` → `<section class="py-6 bg-slate-950">`
Change line 65: `class="bg-gray-800 rounded-lg p-6 overflow-x-auto"` → `class="bg-slate-900 rounded-lg p-6 overflow-x-auto"`

Also add the unused `dark` prop so Svelte doesn't warn when `SectionRenderer` passes it:

After `export let section;` add:
```javascript
/** @type {boolean} */
export let dark = false;
```

**Step 2: Commit**

```bash
git add src/lib/components/CodeBlock.svelte
git commit -m "style: update CodeBlock to slate-950/slate-900 background tokens"
```

---

## Task 10: Redesign `BlogPostContent.svelte`

**Files:**
- Modify: `src/lib/components/BlogPostContent.svelte`

**Step 1: Replace the entire component**

```svelte
<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
	import SectionRenderer from './SectionRenderer.svelte';
	import RelatedArticles from './RelatedArticles.svelte';
	import { page } from '$app/stores';

	/**
	 * @type {{ fields: { title: string, excerpt: string, featuredImage: any, publishedDate: string, updatedDate?: string, estimatedReadingTime: number, author: any, category: any, content: Array<any>, tags?: Array<string>, seoTitle: string, seoDescription: string } }}
	 */
	export let post;

	/**
	 * @type {Array<any>}
	 */
	export let relatedPosts = [];

	$: featuredImageUrl = post.fields.featuredImage?.fields?.file?.url;
	$: authorName = post.fields.author?.fields?.name || 'Unknown';
	$: authorImage = post.fields.author?.fields?.image?.fields?.file?.url;
	$: categoryName = post.fields.category?.fields?.name || '';
	$: categorySlug = post.fields.category?.fields?.slug || '';
	$: themeColor = post.fields.category?.fields?.themeColor || 'indigo';
	$: tags = post.fields.tags || [];
	$: formattedDate = new Date(post.fields.publishedDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	$: updatedDate = post.fields.updatedDate
		? new Date(post.fields.updatedDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
		  })
		: null;
	$: featuredImageWidth = post.fields.featuredImage?.fields?.file?.details?.image?.width;
	$: featuredImageHeight = post.fields.featuredImage?.fields?.file?.details?.image?.height;

	const colorClasses = {
		indigo: { badge: 'bg-indigo-900/30 text-indigo-300', dot: 'bg-indigo-500' },
		amber: { badge: 'bg-amber-900/30 text-amber-300', dot: 'bg-amber-500' },
		emerald: { badge: 'bg-emerald-900/30 text-emerald-300', dot: 'bg-emerald-500' },
		purple: { badge: 'bg-purple-900/30 text-purple-300', dot: 'bg-purple-500' },
		blue: { badge: 'bg-blue-900/30 text-blue-300', dot: 'bg-blue-500' }
	};

	$: colors = colorClasses[themeColor] || colorClasses.indigo;
</script>

<svelte:head>
	<title>{post.fields.seoTitle}</title>
	<meta name="description" content={post.fields.seoDescription} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={post.fields.title} />
	<meta property="og:description" content={post.fields.excerpt} />
	{#if featuredImageUrl}
		<meta property="og:image" content={featuredImageUrl} />
	{/if}
</svelte:head>

<article class="bg-slate-950">
	<!-- Article Header -->
	<header class="relative bg-gradient-to-b from-slate-950 to-slate-900 pt-20 pb-16 lg:pt-28 lg:pb-20">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<!-- Breadcrumb -->
			<nav class="flex items-center gap-2 text-sm mb-12" aria-label="Article breadcrumb">
				<a href="/" class="text-zinc-400 hover:text-white transition-colors">Home</a>
				<span class="text-zinc-600" aria-hidden="true">/</span>
				<a href="/{categorySlug}" class="text-zinc-400 hover:text-white transition-colors"
					>{categoryName}</a
				>
				<span class="text-zinc-600" aria-hidden="true">/</span>
				<span class="text-zinc-300 truncate max-w-xs">{post.fields.title}</span>
			</nav>

			<!-- Category badge -->
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full {colors.badge} px-4 py-2"
			>
				<div class="h-2 w-2 rounded-full {colors.dot}"></div>
				<span class="text-xs font-semibold uppercase tracking-wider">{categoryName}</span>
			</div>

			<!-- Title -->
			<h1
				class="mb-6 max-w-4xl text-5xl lg:text-6xl font-bold text-white leading-tight lg:leading-tight tracking-tight"
			>
				{post.fields.title}
			</h1>

			<!-- Tag pills -->
			{#if tags.length > 0}
				<div class="mb-6 flex flex-wrap gap-2">
					{#each tags as tag}
						<span
							class="bg-slate-800 border border-zinc-700 text-zinc-300 text-xs rounded-full px-3 py-1"
							>{tag}</span
						>
					{/each}
				</div>
			{/if}

			<!-- Excerpt -->
			{#if post.fields.excerpt}
				<p class="mb-8 max-w-2xl text-lg text-zinc-300 leading-relaxed">
					{post.fields.excerpt}
				</p>
			{/if}

			<!-- Author row -->
			<div class="flex items-center gap-4 text-sm text-zinc-400">
				{#if authorImage}
					<img
						src={buildContentfulImageUrl(authorImage, {
							width: 96,
							height: 96,
							fit: 'thumb',
							focus: 'faces'
						})}
						srcset={buildContentfulSrcset(authorImage, [48, 96], {
							fit: 'thumb',
							focus: 'faces'
						})}
						sizes="48px"
						alt={authorName}
						width="48"
						height="48"
						loading="lazy"
						decoding="async"
						class="w-12 h-12 rounded-full"
					/>
				{/if}
				<div>
					<div class="font-medium text-white">{authorName}</div>
					<div class="flex items-center gap-3">
						<time datetime={post.fields.publishedDate}>{formattedDate}</time>
						<span aria-hidden="true">·</span>
						<span>{post.fields.estimatedReadingTime} min read</span>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Featured Image -->
	{#if featuredImageUrl}
		<div class="bg-slate-950 px-6 lg:px-8 py-10">
			<div class="mx-auto max-w-7xl">
				<img
					src={buildContentfulImageUrl(featuredImageUrl, { width: 1200 })}
					srcset={buildContentfulSrcset(featuredImageUrl, [800, 1200, 1600])}
					sizes="(min-width:1280px) 1152px, 100vw"
					alt={post.fields.featuredImage?.fields?.description || post.fields.title}
					width={featuredImageWidth}
					height={featuredImageHeight}
					fetchpriority="high"
					class="w-full h-auto rounded-xl shadow-lg"
				/>
			</div>
		</div>
	{/if}

	<!-- Two-column body -->
	<div class="bg-slate-950 px-6 lg:px-8 py-12">
		<div class="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<!-- Main column: prose well -->
			<div class="min-w-0">
				<div
					class="bg-slate-900 rounded-xl border border-zinc-800 px-8 py-10 lg:px-12 lg:py-12"
				>
					<SectionRenderer sections={post.fields.content} dark={true} />
				</div>

				<!-- Article bottom -->
				<div class="mt-8 flex flex-wrap items-center justify-between gap-4">
					{#if updatedDate}
						<p class="text-sm text-zinc-500">Last updated: {updatedDate}</p>
					{/if}
					<a
						href="/{categorySlug}"
						class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
					>
						← Back to {categoryName}
					</a>
				</div>
			</div>

			<!-- Sidebar: related articles -->
			<aside class="lg:sticky lg:top-24 lg:self-start">
				<RelatedArticles articles={relatedPosts} {categorySlug} {categoryName} />
			</aside>
		</div>
	</div>
</article>
```

**Step 2: Start dev server and verify visually**

Run: `npm run dev`

Navigate to any article URL (e.g. `/technology/some-article-slug`). Check:
- [ ] Dark gradient header with breadcrumb, badge, title, tag pills, excerpt, author row
- [ ] Featured image renders full-width with rounded corners
- [ ] Prose well is `bg-slate-900` with readable `zinc-200` body text
- [ ] Related articles sidebar appears on the right (lg+), stacks below on mobile
- [ ] Back-to-category link at bottom of main column
- [ ] `CodeBlock` renders on `bg-slate-950` / `bg-slate-900`
- [ ] `BlockQuote` has indigo left border
- [ ] No white background boxes anywhere in the article

**Step 3: Commit**

```bash
git add src/lib/components/BlogPostContent.svelte
git commit -m "feat: redesign article page with dark chrome and prose well layout"
```

---

## Task 11: Export `RelatedArticles` from `index.js`

**Files:**
- Modify: `src/lib/components/index.js`

**Step 1: Add RelatedArticles to the barrel export**

Open `src/lib/components/index.js` and add:
```javascript
export { default as RelatedArticles } from './RelatedArticles.svelte';
```

**Step 2: Commit**

```bash
git add src/lib/components/index.js
git commit -m "chore: export RelatedArticles from components index"
```

---

## Task 12: Final verification

**Step 1: Run unit tests**

```bash
npm test
```
Expected: All 52 existing tests pass. (These tests cover `queries.js` and `imageUtils.js` — no new unit tests needed for these UI components.)

**Step 2: Verify responsive layout**

In browser devtools, toggle to mobile viewport (< 1024px). Confirm:
- Related articles appear **below** the prose well, not to the side
- Sidebar has no fixed width forcing horizontal scroll

**Step 3: Check PageRenderer pages are unaffected**

Navigate to a non-blog page (e.g. `/about` if it exists). Confirm:
- ParagraphBlock, BlockQuote, etc. still render with light styling (dark=false default)

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete article page dark redesign with related articles sidebar"
```
