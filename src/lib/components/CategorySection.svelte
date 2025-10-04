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
	export let limit = 2;

	/**
	 * @type {string}
	 */
	export let id = '';

	$: displayPosts = posts.slice(0, limit);
	$: themeColor = category.fields.themeColor || 'blue';

	const colorClasses = {
		blue: 'text-blue-600',
		green: 'text-green-600',
		purple: 'text-purple-600',
		red: 'text-red-600',
		orange: 'text-orange-600'
	};

	const bgColorClasses = {
		blue: 'bg-blue-50',
		green: 'bg-green-50',
		purple: 'bg-purple-50',
		red: 'bg-red-50',
		orange: 'bg-orange-50'
	};

	$: titleColor = colorClasses[themeColor] || colorClasses.blue;
	$: bgColor = bgColorClasses[themeColor] || bgColorClasses.blue;
</script>

<section class="py-12 {bgColor}" {id}>
	<div class="container mx-auto px-4 max-w-6xl">
		<div class="flex items-start justify-between gap-8 mb-8">
			<div class="flex-1 max-w-4xl">
				<h2 class="text-3xl font-bold {titleColor} mb-2">{category.fields.name}</h2>
				<p class="text-gray-600">{category.fields.description}</p>
			</div>
			<a
				href="/category/{category.fields.slug}"
				class="hidden md:inline-flex items-center {titleColor} hover:underline font-medium whitespace-nowrap flex-shrink-0 pt-1"
			>
				View all
				<svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</a>
		</div>

		{#if displayPosts.length > 0}
			<div class="space-y-6">
				{#each displayPosts as post}
					<BlogPostCard {post} variant="horizontal" />
				{/each}
			</div>
		{:else}
			<p class="text-gray-600 text-center py-8">No articles in this category yet.</p>
		{/if}
	</div>
</section>
