<script>
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { richTextOptions } from '$lib/contentful/richTextOptions.js';

	/**
	 * @type {{ fields: { heading: string, richContent?: any, content?: string, alignment?: string } }}
	 */
	export let section;

	$: alignment = section.fields.alignment || 'left';
	$: alignmentClass = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	}[alignment];

	// Use richContent if available, otherwise fallback to plain content
	$: htmlContent = section.fields.richContent
		? documentToHtmlString(section.fields.richContent, richTextOptions)
		: `<p>${section.fields.content || ''}</p>`;
</script>

<section class="py-6 bg-white">
	<div class="container mx-auto px-4 max-w-4xl">
		<h2 class="text-3xl font-bold mb-6 text-gray-900 {alignmentClass}">{section.fields.heading}</h2>
		<div class="prose prose-lg {alignmentClass}">
			{@html htmlContent}
		</div>
	</div>
</section>

