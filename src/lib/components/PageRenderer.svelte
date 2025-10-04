<script>
	import NavigationBar from './NavigationBar.svelte';
	import SectionRenderer from './SectionRenderer.svelte';

	/**
	 * @type {{ fields: { title: string, slug: string, sections: Array<any>, navigationBar?: any, seoMetadata?: any } }}
	 */
	export let page;
</script>

<svelte:head>
	<title>{page.fields.title}</title>
	{#if page.fields.seoMetadata?.fields?.description}
		<meta name="description" content={page.fields.seoMetadata.fields.description} />
	{/if}
	{#if page.fields.seoMetadata?.fields?.keywords}
		<meta name="keywords" content={page.fields.seoMetadata.fields.keywords} />
	{/if}
</svelte:head>

{#if page.fields.navigationBar}
	<NavigationBar navigationBar={page.fields.navigationBar} />
{/if}

<main>
	<SectionRenderer sections={page.fields.sections} />
</main>
