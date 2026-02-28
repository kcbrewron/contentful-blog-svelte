<script>
	import CategoryHero from './CategoryHero.svelte';
	import CategoryIntro from './CategoryIntro.svelte';
	import BlogPostCard from './BlogPostCard.svelte';
	import SectionRenderer from './SectionRenderer.svelte';

	/**
	 * @type {{ fields: { name: string, description: string, heroTitle: string, heroDescription?: string, themeColor: string, featuredPosts?: Array<any>, flexibleSections?: Array<any>, seoTitle: string, seoDescription: string } }}
	 */
	export let category;

	/**
	 * @type {Array<any>}
	 */
	export let posts = [];
</script>

<svelte:head>
	<title>{category.fields.seoTitle}</title>
	<meta name="description" content={category.fields.seoDescription} />
</svelte:head>

<CategoryHero {category} />

<CategoryIntro {category} />

<!-- Featured Posts Section -->
{#if category.fields.featuredPosts && category.fields.featuredPosts.length > 0}
	<section class="py-12 bg-gray-50">
		<div class="container mx-auto px-4 max-w-6xl">
			<h2 class="text-3xl font-bold mb-8">Featured Articles</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each category.fields.featuredPosts as post}
					<BlogPostCard {post} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Flexible Sections -->
{#if category.fields.flexibleSections && category.fields.flexibleSections.length > 0}
	<SectionRenderer sections={category.fields.flexibleSections} />
{/if}

<!-- All Posts in Category -->
<section class="py-12 bg-white">
	<div class="container mx-auto px-4 max-w-6xl">
		<h2 class="text-3xl font-bold mb-8">All {category.fields.name} Articles</h2>
		{#if posts.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each posts as post}
					<BlogPostCard {post} />
				{/each}
			</div>
		{:else}
			<p class="text-gray-600 text-center py-12">No articles found in this category yet.</p>
		{/if}
	</div>
</section>
