<script>
	import BlogPostCard from './BlogPostCard.svelte';

	/**
	 * @type {{ fields: { name: string, slug: string, description: string, themeColor: string } }}
	 */
	export let category;

	/**
	 * @type {Array<any>}
	 */
	export let posts = [];

	/**
	 * @type {number}
	 */
	export let limit = 3;

	/**
	 * @type {string}
	 */
	export let id = '';

	$: displayPosts = posts.slice(0, limit);
	$: themeColor = category.fields.themeColor || 'blue';

	const colorClasses = {
		blue: 'text-brand-primary',
		green: 'text-green-600',
		purple: 'text-purple-600',
		red: 'text-red-600',
		orange: 'text-orange-600'
	};

	$: titleColor = colorClasses[themeColor] || colorClasses.blue;
</script>

<section class="bg-brand-darker text-white py-20" {id}>
	<div class="max-w-7xl mx-auto px-20">
		<!-- Section Header -->
		<div class="flex items-start justify-between gap-8 mb-16">
			<div class="flex-1">
				<h2 class="text-3xl md:text-4xl font-black text-white mb-3">{category.fields.name}</h2>
				{#if category.fields.description}
					<p class="text-base text-brand-text-subtle max-w-2xl">{category.fields.description}</p>
				{/if}
			</div>
			<a
				href="/{category.fields.slug}"
				class="hidden md:inline-flex items-center text-brand-primary hover:text-white font-semibold text-sm whitespace-nowrap flex-shrink-0 transition-colors duration-150"
				aria-label="View all {category.fields.name} articles"
			>
				View all
				<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</a>
		</div>

		<!-- Article Grid -->
		{#if displayPosts.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{#each displayPosts as post}
					<BlogPostCard {post} variant="grid" />
				{/each}
			</div>

			<!-- Mobile View All Link -->
			<div class="md:hidden flex justify-center">
				<a
					href="/{category.fields.slug}"
					class="inline-flex items-center text-brand-primary hover:text-white font-semibold text-sm transition-colors duration-150"
					aria-label="View all {category.fields.name} articles"
				>
					View all
					<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>
		{:else}
			<p class="text-brand-text-subtle text-center py-12">No articles in this category yet.</p>
		{/if}
	</div>
</section>
