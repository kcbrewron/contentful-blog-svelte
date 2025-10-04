<script>
	import CategoryLanding from '$lib/components/CategoryLanding.svelte';

	/**
	 * @type {{ data: { category: any, posts: Array<any> } }}
	 */
	export let data;
</script>

<CategoryLanding category={data.category} posts={data.posts} />
