<script>
	import BlogPostCard from './BlogPostCard.svelte';

	/**
	 * @type {Array<any>}
	 */
	export let posts = [];

	/**
	 * @type {number}
	 */
	export let limit = 6;

	$: displayPosts = posts.slice(0, limit);
</script>

<section id="recent-articles" class="py-16 bg-white">
	<div class="container mx-auto px-4 max-w-6xl">
		<div class="text-center mb-12">
			<h2 class="text-4xl font-bold text-gray-900 mb-4">Recent Articles</h2>
			<p class="text-xl text-gray-600">Latest insights and thoughts from across all topics</p>
		</div>

		{#if displayPosts.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each displayPosts as post}
					<BlogPostCard {post} />
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-600 text-lg">No articles published yet. Check back soon!</p>
			</div>
		{/if}
	</div>
</section>
