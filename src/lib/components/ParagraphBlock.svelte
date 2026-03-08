<script>
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { richTextOptions } from '$lib/contentful/richTextOptions.js';

	/**
	 * @type {{ fields: { heading: string, richContent?: any, content?: string, alignment?: string } }}
	 */
	export let section;

	/**
	 * When true, renders with dark color tokens (for use inside dark prose well)
	 * @type {boolean}
	 */
	export let dark = false;

	$: alignment = section.fields.alignment || 'left';
	$: alignmentClass = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	}[alignment];

	$: htmlContent = section.fields.richContent
		? documentToHtmlString(section.fields.richContent, richTextOptions)
		: `<p>${section.fields.content || ''}</p>`;
</script>

<section class="py-6 {dark ? '' : 'bg-white'}">
	<div class="{dark ? '' : 'container mx-auto px-4 max-w-4xl'}">
		<h2 class="text-3xl font-bold mb-6 {dark ? 'text-white' : 'text-gray-900'} {alignmentClass}">
			{section.fields.heading}
		</h2>
		<div class="prose {dark ? 'prose-dark' : ''} prose-lg {alignmentClass}">
			{@html htmlContent}
		</div>
	</div>
</section>
