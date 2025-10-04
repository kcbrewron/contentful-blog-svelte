<script>
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

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
		? documentToHtmlString(section.fields.richContent)
		: `<p>${section.fields.content || ''}</p>`;
</script>

<section class="py-12 bg-white">
	<div class="container mx-auto px-4 max-w-6xl">
		<h2 class="text-3xl font-bold mb-6 text-gray-900 {alignmentClass}">{section.fields.heading}</h2>
		<div class="prose prose-lg max-w-none {alignmentClass}">
			{@html htmlContent}
		</div>
	</div>
</section>

<style>
	:global(.prose) {
		color: #374151;
	}
	:global(.prose h1, .prose h2, .prose h3, .prose h4) {
		color: #111827;
	}
	:global(.prose a) {
		color: #2563eb;
		text-decoration: none;
	}
	:global(.prose a:hover) {
		text-decoration: underline;
	}
</style>
