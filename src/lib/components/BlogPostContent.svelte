<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
	import SectionRenderer from './SectionRenderer.svelte';
	import { page } from '$app/stores';

	/**
	 * @type {{ fields: { title: string, excerpt: string, featuredImage: any, publishedDate: string, updatedDate?: string, estimatedReadingTime: number, author: any, category: any, content: Array<any>, tags?: Array<string>, seoTitle: string, seoDescription: string } }}
	 */
	export let post;

	$: featuredImageUrl = post.fields.featuredImage?.fields?.file?.url;
	$: authorName = post.fields.author?.fields?.name || 'Unknown';
	$: authorImage = post.fields.author?.fields?.image?.fields?.file?.url;
	$: categoryName = post.fields.category?.fields?.name || '';
	$: categorySlug = post.fields.category?.fields?.slug || '';
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

<article class="bg-white">
	<!-- Article Header -->
	<header class="py-12 bg-gray-50">
		<div class="container mx-auto px-4 max-w-4xl">
			<div class="mb-6">
				<a href="/{categorySlug}" class="text-blue-600 hover:underline font-medium">
					{categoryName}
				</a>
			</div>
			<h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{post.fields.title}</h1>
			<p class="text-xl text-gray-600 mb-8">{post.fields.excerpt}</p>

			<div class="flex items-center gap-6 text-sm text-gray-600">
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
				<div>
					<div class="font-medium text-gray-900">{authorName}</div>
					<div class="flex items-center gap-3">
						<time datetime={post.fields.publishedDate}>{formattedDate}</time>
						<span>•</span>
						<span>{post.fields.estimatedReadingTime} min read</span>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Featured Image -->
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

	<!-- Article Content -->
	<div class="py-8">
		<SectionRenderer sections={post.fields.content} />
	</div>

	<!-- Article Footer -->
	<footer class="border-t border-gray-200 py-8">
		<div class="container mx-auto px-4 max-w-4xl">
			{#if updatedDate}
				<p class="text-sm text-gray-600 mb-6">Last updated: {updatedDate}</p>
			{/if}

			{#if post.fields.tags && post.fields.tags.length > 0}
				<div class="mb-6">
					<p class="text-sm font-semibold text-gray-700 mb-1">Tags</p>
					<p class="text-sm text-gray-600">{post.fields.tags.join(' · ')}</p>
				</div>
			{/if}

			<div class="flex items-center justify-between pt-6 border-t border-gray-200">
				<a href="/{categorySlug}" class="text-blue-600 hover:underline">
					← Back to {categoryName}
				</a>
			</div>
		</div>
	</footer>
</article>
