<script>
	/**
	 * @type {Array<any>}
	 */
	export let categories = [];

	/**
	 * @type {Object<string, number>}
	 */
	export let categoryPostCounts = {};

	const colorClasses = {
		blue: 'from-blue-500 to-blue-600',
		green: 'from-green-500 to-green-600',
		purple: 'from-purple-500 to-purple-600',
		red: 'from-red-500 to-red-600',
		orange: 'from-orange-500 to-orange-600'
	};

	const hoverClasses = {
		blue: 'hover:from-blue-600 hover:to-blue-700',
		green: 'hover:from-green-600 hover:to-green-700',
		purple: 'hover:from-purple-600 hover:to-purple-700',
		red: 'hover:from-red-600 hover:to-red-700',
		orange: 'hover:from-orange-600 hover:to-orange-700'
	};
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
					{@const gradientClass = colorClasses[themeColor] || colorClasses.blue}
					{@const hoverClass = hoverClasses[themeColor] || hoverClasses.blue}
					{@const postCount = categoryPostCounts[category.sys.id] || 0}

					<a
						href="/category/{category.fields.slug}"
						class="group block bg-gradient-to-br {gradientClass} {hoverClass} text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
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
</style>
