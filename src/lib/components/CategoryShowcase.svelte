<script>
	/**
	 * @type {Array<any>}
	 */
	export let categories = [];

	/**
	 * @type {Object<string, number>}
	 */
	export let categoryPostCounts = {};
</script>

<section class="py-16 bg-gray-50">
	<div class="container mx-auto px-4 max-w-6xl">
		<div class="text-center mb-12">
			<h2 class="text-4xl font-bold text-gray-900 mb-4">Explore Topics</h2>
			<p class="text-xl text-gray-600">Dive into specific areas of interest</p>
		</div>

		{#if categories.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#each categories as category}
					{@const themeColor = category.fields.themeColor || 'blue'}
					{@const postCount = categoryPostCounts[category.sys.id] || 0}

					<a
						href="/{category.fields.slug}"
						data-theme={themeColor}
						class="group block text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
						style="background: linear-gradient(to bottom right, var(--theme-gradient-from), var(--theme-gradient-to));"
					>
						<div class="p-8">
							<h3 class="text-2xl font-bold mb-3">{category.fields.name}</h3>
							<p class="text-white opacity-90 mb-4 line-clamp-2">
								{category.fields.description}
							</p>
							<div class="flex items-center justify-between">
								<span class="text-sm opacity-75">
									{postCount} {postCount === 1 ? 'article' : 'articles'}
								</span>
								<span class="text-2xl group-hover:translate-x-2 transition-transform" aria-hidden="true">→</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<p class="text-center text-gray-600">No categories available.</p>
		{/if}
	</div>
</section>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	a:hover {
		filter: brightness(0.9);
	}
</style>
