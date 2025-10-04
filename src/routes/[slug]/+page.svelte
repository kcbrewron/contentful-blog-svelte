<script>
	import PageRenderer from '$lib/components/PageRenderer.svelte';

	/**
	 * @type {{ data: { page: any } }}
	 */
	export let data;
</script>

<PageRenderer page={data.page} />
