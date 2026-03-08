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
	 * @type {number}
	 */
	export let itemsPerPage = 6;

	/**
	 * @type {number}
	 */
	export let currentPage = 1;

	let sortBy = 'recent';
	let filterTag = 'all';

	$: totalPages = Math.ceil(articles.length / itemsPerPage);
	$: startIndex = (currentPage - 1) * itemsPerPage;
	$: endIndex = startIndex + itemsPerPage;

	$: sorted = [...articles].sort((a, b) => {
		if (sortBy === 'recent') {
			return new Date(b.fields?.publishedDate || 0) - new Date(a.fields?.publishedDate || 0);
		}
		if (sortBy === 'oldest') {
			return new Date(a.fields?.publishedDate || 0) - new Date(b.fields?.publishedDate || 0);
		}
		return 0;
	});

	$: paginatedArticles = sorted.slice(startIndex, endIndex);

	function getImageUrl(article) {
		if (article?.fields?.featuredImage?.fields?.file?.url) {
			return buildContentfulImageUrl(article.fields.featuredImage.fields.file.url, {
				width: 600,
				height: 400,
				fit: 'fill',
				format: 'webp',
				quality: 85
			});
		}
		return '';
	}

	function handlePageChange(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	const pageNumbers = Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);
</script>

<section class="bg-slate-950 px-6 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-7xl">
		<!-- Grid header with title and filters -->
		<div class="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
			<h2 class="text-3xl lg:text-4xl font-bold text-white">All Articles</h2>

			<!-- Sort controls -->
			<div class="flex items-center gap-4">
				<label for="sort" class="text-sm font-medium text-zinc-300">Sort by:</label>
				<select
					id="sort"
					bind:value={sortBy}
					class="rounded-lg border border-zinc-700 bg-slate-900 px-4 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
				>
					<option value="recent">Most Recent</option>
					<option value="oldest">Oldest First</option>
				</select>
			</div>
		</div>

		<!-- Articles grid -->
		<div class="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each paginatedArticles as article (article.sys.id)}
				{@const slug = article.fields?.slug || ''}
				{@const title = article.fields?.title || ''}
				{@const excerpt = article.fields?.excerpt || ''}
				{@const publishedDate = article.fields?.publishedDate
					? new Date(article.fields.publishedDate).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})
					: ''}
				{@const imageUrl = getImageUrl(article)}
				{@const readingTime = article.fields?.readingTimeMinutes || 5}
				{@const isExternal = article.sys?.contentType?.sys?.id === 'externalArticle'}
				{@const articleHref = isExternal ? (article.fields?.externalUrl || '#') : `/${categorySlug}/${slug}`}

				<a
					href={articleHref}
					target={isExternal ? '_blank' : undefined}
					rel={isExternal ? 'noopener noreferrer' : undefined}
					class="group flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-slate-900 transition-all hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10"
				>
					<!-- Image container -->
					<div class="relative overflow-hidden h-48 bg-gradient-to-br from-slate-800 to-slate-900">
						{#if imageUrl}
							<img
								src={imageUrl}
								alt={title}
								class="h-full w-full object-cover transition-transform group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div class="h-full w-full flex items-center justify-center">
								<svg class="h-12 w-12 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
						{/if}
						<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
					</div>

					<!-- Card content -->
					<div class="flex flex-col flex-1 p-5">
						<!-- Title -->
						<h3 class="mb-2 line-clamp-2 text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
							{title}
						</h3>

						<!-- Excerpt -->
						{#if excerpt}
							<p class="mb-4 line-clamp-2 text-sm text-zinc-400">
								{excerpt}
							</p>
						{/if}

						<!-- Metadata footer -->
						<div class="mt-auto flex items-center justify-between text-xs text-zinc-500">
							<span>{publishedDate}</span>
							<span>{readingTime} min read</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-center gap-3 pt-8">
				<!-- Previous button -->
				<button
					on:click={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					class="flex items-center gap-2 rounded-lg border border-zinc-700 bg-slate-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-indigo-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Previous
				</button>

				<!-- Page numbers -->
				{#each pageNumbers as pageNum}
					{@const isActive = pageNum === currentPage}
					<button
						on:click={() => handlePageChange(pageNum)}
						class="h-10 w-10 rounded-lg border transition-all {isActive
							? 'border-indigo-500 bg-indigo-600 text-white'
							: 'border-zinc-700 bg-slate-900 text-zinc-300 hover:border-indigo-500 hover:text-white'}"
					>
						{pageNum}
					</button>
				{/each}

				<!-- Ellipsis and last page if needed -->
				{#if totalPages > pageNumbers.length}
					<span class="text-zinc-500">...</span>
					{#if totalPages > 3}
						<button
							on:click={() => handlePageChange(totalPages)}
							class="h-10 w-10 rounded-lg border border-zinc-700 bg-slate-900 text-zinc-300 transition-all hover:border-indigo-500 hover:text-white"
						>
							{totalPages}
						</button>
					{/if}
				{/if}

				<!-- Next button -->
				<button
					on:click={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="flex items-center gap-2 rounded-lg border border-zinc-700 bg-slate-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-indigo-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		{/if}
	</div>
</section>
