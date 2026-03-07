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
						<div
							class="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center"
						>
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
							<span aria-hidden="true">·</span>
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
			View all {categoryName} articles →
		</a>
	</div>
{/if}
