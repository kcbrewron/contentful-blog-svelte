<script>
	import ContentCluster from '$lib/components/ContentCluster.svelte';
	import PageRenderer from '$lib/components/PageRenderer.svelte';

	/**
	 * @type {{ data: { type: string, category?: any, posts?: Array<any>, page?: any } }}
	 */
	export let data;
</script>

{#if data.type === 'category'}
	<ContentCluster category={data.category} posts={data.posts} />
{:else}
	<PageRenderer page={data.page} />
{/if}
