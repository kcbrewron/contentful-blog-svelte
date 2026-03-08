<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';

	/**
	 * @type {Object|null}
	 */
	export let article = null;

	/**
	 * @type {string}
	 */
	export let categorySlug = '';

	$: slug = article?.fields?.slug || '';
	$: title = article?.fields?.title || '';
	$: excerpt = article?.fields?.excerpt || '';
	$: publishedDate = article?.fields?.publishedDate
		? new Date(article.fields.publishedDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
		: '';
	$: readingTime = article?.fields?.readingTimeMinutes || 8;
	$: author = article?.fields?.author?.fields?.name || 'Ron Nelson';
	$: isExternal = article?.sys?.contentType?.sys?.id === 'externalArticle';
	$: articleHref = isExternal
		? (article?.fields?.externalUrl || '#')
		: `/${categorySlug}/${slug}`;

	$: imageUrl = article?.fields?.featuredImage?.fields?.file?.url
		? buildContentfulImageUrl(article.fields.featuredImage.fields.file.url, {
				width: 1200,
				height: 600,
				fit: 'fill',
				format: 'webp',
				quality: 85
			})
		: '';

	// Debug logging
	// $: if (article) {
	// 	console.log('FeaturedArticleCluster - Article data:', {
	// 		title: article.fields?.title,
	// 		featuredImage: article.fields?.featuredImage,
	// 		imageUrl: imageUrl
	// 	});
	// }
</script>

{#if article}
	<section class="bg-slate-950 px-6 py-16 lg:px-8 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
				<!-- Featured image -->
				<div class="relative overflow-hidden rounded-xl aspect-video lg:aspect-auto lg:h-96 bg-slate-800">
					{#if imageUrl}
						<img
							src={imageUrl}
							alt={title}
							class="h-full w-full object-cover"
							loading="lazy"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
					{:else}
						<div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
							<svg class="h-16 w-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
					{/if}
				</div>

				<!-- Featured content -->
				<div class="flex flex-col justify-center">
					<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-300 uppercase tracking-wider w-fit">
						<div class="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
						Featured
					</div>

					<h2 class="mb-4 text-4xl lg:text-5xl font-bold text-white leading-tight">
						{title}
					</h2>

					{#if excerpt}
						<p class="mb-6 text-lg text-zinc-300 leading-relaxed">
							{excerpt}
						</p>
					{/if}

					<!-- Article metadata -->
					<div class="mb-8 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
						<div class="flex items-center gap-2">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span>{publishedDate}</span>
						</div>
						<div class="h-4 w-px bg-zinc-700"></div>
						<div class="flex items-center gap-2">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>{readingTime} min read</span>
						</div>
						<div class="h-4 w-px bg-zinc-700"></div>
						<div class="flex items-center gap-2">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>by {author}</span>
						</div>
					</div>

					<!-- Read more button -->
					<a
						href={articleHref}
						target={isExternal ? '_blank' : undefined}
						rel={isExternal ? 'noopener noreferrer' : undefined}
						class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors w-fit"
					>
						{isExternal ? `Read on ${article?.fields?.platform || 'External Site'}` : 'Read Article'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}
