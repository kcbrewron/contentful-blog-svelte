<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
	/**
	 * @type {{ fields: { title: string, slug?: string, externalUrl?: string, excerpt: string, featuredImage: any, publishedDate: string, estimatedReadingTime?: number, author: any, category: any, platform?: string }, sys: { contentType: { sys: { id: string } } } }}
	 */
	export let post;

	/**
	 * @type {'vertical' | 'horizontal' | 'grid'}
	 */
	export let variant = 'vertical';

	$: isExternal = post.sys.contentType.sys.id === 'externalArticle';
	$: postUrl = isExternal ? post.fields.externalUrl : `/${categorySlug}/${post.fields.slug}`;
	$: isExternalLink = isExternal;
	$: featuredImageUrl = post.fields.featuredImage?.fields?.file?.url;
	$: authorName = post.fields.author?.fields?.name || 'Unknown';
	$: categoryName = post.fields.category?.fields?.name || '';
	$: categorySlug = post.fields.category?.fields?.slug || '';
	$: platform = post.fields.platform || null;
	$: formattedDate = new Date(post.fields.publishedDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

{#if variant === 'horizontal'}
	<article
		class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row"
	>
		{#if featuredImageUrl}
			<!-- Image link is hidden from a11y tree — title link below is the primary link -->
			<a
				href={postUrl}
				class="block md:w-2/5 flex-shrink-0"
				tabindex="-1"
				aria-hidden="true"
				target={isExternalLink ? '_blank' : undefined}
				rel={isExternalLink ? 'noopener noreferrer' : undefined}
			>
				<img
					src={buildContentfulImageUrl(featuredImageUrl, { width: 800 })}
					srcset={buildContentfulSrcset(featuredImageUrl, [400, 800])}
					sizes="(min-width:768px) 40vw, 100vw"
					alt=""
					loading="lazy"
					decoding="async"
					class="w-full h-48 md:h-full object-cover hover:opacity-90 transition-opacity"
				/>
			</a>
		{/if}

		<div class="p-6 flex-1 flex flex-col justify-between">
			<div>
				<div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
					<a href="/{categorySlug}" class="text-blue-600 hover:underline font-medium">
						{categoryName}
					</a>
					<span aria-hidden="true">•</span>
					<time datetime={post.fields.publishedDate}>{formattedDate}</time>
					{#if post.fields.estimatedReadingTime}
						<span aria-hidden="true">•</span>
						<span>{post.fields.estimatedReadingTime} min read</span>
					{/if}
					{#if platform}
						<span aria-hidden="true">•</span>
						<span
							class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
						>
							{platform}
						</span>
					{/if}
				</div>

				<h3 class="text-2xl font-bold mb-3">
					<a
						href={postUrl}
						class="hover:text-blue-600 transition-colors"
						target={isExternalLink ? '_blank' : undefined}
						rel={isExternalLink ? 'noopener noreferrer' : undefined}
					>
						{post.fields.title}
						{#if isExternalLink}
							<svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
							<span class="sr-only">(opens in new tab)</span>
						{/if}
					</a>
				</h3>

				<p class="text-gray-600 mb-4 line-clamp-3">{post.fields.excerpt}</p>
			</div>

			<div class="flex items-center justify-between mt-4">
				<span class="text-sm text-gray-600">by {authorName}</span>
				<a
					href={postUrl}
					class="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
					target={isExternalLink ? '_blank' : undefined}
					rel={isExternalLink ? 'noopener noreferrer' : undefined}
				>
					{isExternalLink ? 'Read on ' + platform : 'Read more'}
					<span class="sr-only">{isExternalLink ? '(opens in new tab)' : post.fields.title}</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7-7"
						/>
					</svg>
				</a>
			</div>
		</div>
	</article>
{:else if variant === 'grid'}
	<article class="bg-brand-darker rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-brand-border hover:border-brand-primary/50">
		{#if featuredImageUrl}
			<!-- Image link is hidden from a11y tree — title link below is the primary link -->
			<a href={postUrl} class="block relative overflow-hidden bg-brand-darker h-48" tabindex="-1" aria-hidden="true" target={isExternalLink ? '_blank' : undefined} rel={isExternalLink ? 'noopener noreferrer' : undefined}>
				<img
					src={buildContentfulImageUrl(featuredImageUrl, { width: 600 })}
					srcset={buildContentfulSrcset(featuredImageUrl, [400, 600, 800])}
					sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
					alt=""
					loading="lazy"
					decoding="async"
					class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
				/>
			</a>
		{/if}

		<div class="p-6 flex flex-col">
			<!-- Category Label -->
			<div class="mb-3">
				<a href="/{categorySlug}" class="inline-block text-xs font-semibold text-brand-primary uppercase tracking-wide hover:text-white transition-colors">
					{categoryName}
				</a>
			</div>

			<!-- Title -->
			<h3 class="text-lg font-bold mb-3 flex-1">
				<a
					href={postUrl}
					class="text-white hover:text-brand-primary transition-colors line-clamp-2"
					target={isExternalLink ? '_blank' : undefined}
					rel={isExternalLink ? 'noopener noreferrer' : undefined}
				>
					{post.fields.title}
					{#if isExternalLink}
						<svg class="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
						<span class="sr-only">(opens in new tab)</span>
					{/if}
				</a>
			</h3>

			<!-- Description -->
			<p class="text-sm text-brand-text-subtle mb-4 line-clamp-2">{post.fields.excerpt}</p>

			<!-- Footer -->
			<div class="pt-4 border-t border-brand-border">
				<div class="flex items-center justify-between text-xs text-brand-text-muted">
					<div class="flex items-center gap-2">
						{#if post.fields.estimatedReadingTime}
							<span>{post.fields.estimatedReadingTime} min read</span>
							<span aria-hidden="true">•</span>
						{/if}
						<time datetime={post.fields.publishedDate}>{formattedDate.split(',')[0]}</time>
					</div>
					<a
						href={postUrl}
						class="text-brand-primary hover:text-white transition-colors font-medium flex items-center gap-1"
						target={isExternalLink ? '_blank' : undefined}
						rel={isExternalLink ? 'noopener noreferrer' : undefined}
					>
						<span class="sr-only">{post.fields.title}</span>
						<span aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	</article>
{:else}
	<article
		class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
	>
	{#if featuredImageUrl}
		<!-- Image link is hidden from a11y tree — title link below is the primary link -->
		<a href={postUrl} class="block" tabindex="-1" aria-hidden="true" target={isExternalLink ? '_blank' : undefined} rel={isExternalLink ? 'noopener noreferrer' : undefined}>
			<img
				src={buildContentfulImageUrl(featuredImageUrl, { width: 800 })}
				srcset={buildContentfulSrcset(featuredImageUrl, [400, 800])}
				sizes="(min-width:768px) 40vw, 100vw"
				alt=""
				loading="lazy"
				decoding="async"
				class="w-full h-48 object-cover hover:opacity-90 transition-opacity"
			/>
		</a>
	{/if}

	<div class="p-6">
		<div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
			<a href="/{categorySlug}" class="text-blue-600 hover:underline font-medium">
				{categoryName}
			</a>
			<span aria-hidden="true">•</span>
			<time datetime={post.fields.publishedDate}>{formattedDate}</time>
			{#if post.fields.estimatedReadingTime}
				<span aria-hidden="true">•</span>
				<span>{post.fields.estimatedReadingTime} min read</span>
			{/if}
			{#if platform}
				<span aria-hidden="true">•</span>
				<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
					{platform}
				</span>
			{/if}
		</div>

		<h2 class="text-2xl font-bold mb-3">
			<a href={postUrl} class="hover:text-blue-600 transition-colors" target={isExternalLink ? '_blank' : undefined} rel={isExternalLink ? 'noopener noreferrer' : undefined}>
				{post.fields.title}
				{#if isExternalLink}
					<svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
					<span class="sr-only">(opens in new tab)</span>
				{/if}
			</a>
		</h2>

		<p class="text-gray-600 mb-4 line-clamp-3">{post.fields.excerpt}</p>

		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-600">by {authorName}</span>
			<a
				href={postUrl}
				class="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
				target={isExternalLink ? '_blank' : undefined}
				rel={isExternalLink ? 'noopener noreferrer' : undefined}
			>
				{isExternalLink ? 'Read on ' + platform : 'Read more'}
				<span class="sr-only">{isExternalLink ? '(opens in new tab)' : post.fields.title}</span>
				<span aria-hidden="true"> →</span>
			</a>
		</div>
	</div>
	</article>
{/if}

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
