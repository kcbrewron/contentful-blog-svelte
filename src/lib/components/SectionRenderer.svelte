<script>
	import ParagraphBlock from './ParagraphBlock.svelte';
	import ImageContentBlock from './ImageContentBlock.svelte';
	import BlockQuote from './BlockQuote.svelte';
	import CodeBlock from './CodeBlock.svelte';

	/**
	 * @type {Array<any>}
	 */
	export let sections = [];

	/**
	 * When true, section components render with dark color tokens
	 * @type {boolean}
	 */
	export let dark = false;

	/**
	 * Maps content type IDs to their corresponding components
	 * @param {string} contentType
	 */
	function getComponentForSection(contentType) {
		const componentMap = {
			paragraphBlock: ParagraphBlock,
			imageContentBlock: ImageContentBlock,
			blockQuote: BlockQuote,
			codeBlock: CodeBlock
		};

		return componentMap[contentType] || null;
	}
</script>

{#if sections && sections.length > 0}
	{#each sections as section}
		{#if section.sys?.contentType?.sys?.id}
			{@const Component = getComponentForSection(section.sys.contentType.sys.id)}
			{#if Component}
				<svelte:component this={Component} {section} {dark} />
			{:else}
				<div class="py-4 px-4 {dark ? 'bg-slate-800 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}">
					Unknown section type: {section.sys.contentType.sys.id}
				</div>
			{/if}
		{/if}
	{/each}
{:else}
	<div class="py-12 text-center {dark ? 'text-zinc-500' : 'text-gray-600'}">
		No content sections available.
	</div>
{/if}
