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
			<div class="mb-6 inline-flex items-center gap-2 rounded-full {colors.badge} px-4 py-2">
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
