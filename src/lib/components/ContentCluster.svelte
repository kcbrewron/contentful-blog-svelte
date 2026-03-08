<script>
	import ClusterHero from './ClusterHero.svelte';
	import FeaturedArticleCluster from './FeaturedArticleCluster.svelte';
	import ArticleGridCluster from './ArticleGridCluster.svelte';

	/**
	 * @type {{ fields: { name: string, slug: string, label: string, description: string, heroTitle: string, heroDescription: string, themeColor: string, seoTitle: string, seoDescription: string } }}
	 */
	export let category = {};

	/**
	 * @type {Array<any>}
	 */
	export let posts = [];

	$: categorySlug = category.fields?.slug || '';
	$: seoTitle = category.fields?.seoTitle || category.fields?.name || 'Content Cluster';
	$: seoDescription = category.fields?.seoDescription || category.fields?.description || '';

	// Calculate reading times and get featured post
	$: totalReadingTime = posts.reduce((sum, post) => sum + (post.fields?.readingTimeMinutes || 5), 0);
	$: avgReadingTime = Math.round(totalReadingTime / Math.max(posts.length, 1));
	$: featuredPost = posts.length > 0 ? posts[0] : null;
	$: remainingPosts = posts.slice(1);
</script>

<svelte:head>
	<title>{seoTitle}</title>
	<meta name="description" content={seoDescription} />
</svelte:head>

<!-- Hero Section -->
<ClusterHero
	{category}
	totalPosts={posts.length}
	{avgReadingTime}
/>

<!-- Featured Article -->
{#if featuredPost}
	<FeaturedArticleCluster
		article={featuredPost}
		{categorySlug}
	/>
{/if}

<!-- Article Grid Section -->
<ArticleGridCluster
	articles={remainingPosts}
	{categorySlug}
	itemsPerPage={6}
/>
