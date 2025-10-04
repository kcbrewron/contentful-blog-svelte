<script>
	import Hero from '$lib/components/Hero.svelte';
	import CategorySection from '$lib/components/CategorySection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';

	/**
	 * @type {{ data: { categories: Array<any>, categoryPosts: Object, featuredImages: Array<string> } }}
	 */
	export let data;

	// Transform categories for Hero component
	$: categoryLinks = data.categories.map((cat) => ({
		name: cat.fields.name,
		slug: cat.fields.slug
	}));
</script>

<svelte:head>
	<title>Ron Nelson - Software Engineer & Technical Leader</title>
	<meta
		name="description"
		content="Sharing insights on software development, leadership, and the journey of continuous learning."
	/>
</svelte:head>

<Hero categories={categoryLinks} featuredImages={data.featuredImages} />

<!-- Category Sections with Recent Articles -->
{#each data.categories as category, index}
	<CategorySection
		{category}
		posts={data.categoryPosts[category.sys.id] || []}
		limit={2}
		id={index === 0 ? 'technology' : ''}
	/>
{/each}

<AboutSection />
