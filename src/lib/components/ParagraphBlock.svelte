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
	:global(.prose h1) {
		font-size: 2.25rem;
		font-weight: 800;
		line-height: 2.5rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: #111827;
	}
	:global(.prose h2) {
		font-size: 1.875rem;
		font-weight: 700;
		line-height: 2.25rem;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		color: #111827;
	}
	:global(.prose h3) {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 2rem;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
		color: #111827;
	}
	:global(.prose h4) {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.75rem;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		color: #111827;
	}
	:global(.prose p) {
		margin-bottom: 1rem;
	}
	:global(.prose ul, .prose ol) {
		margin-top: 0.5rem;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}
	:global(.prose ul) {
		list-style-type: disc;
	}
	:global(.prose ol) {
		list-style-type: decimal;
	}
	:global(.prose li) {
		margin-bottom: 0.5rem;
	}
	:global(.prose a) {
		color: #2563eb;
		text-decoration: none;
	}
	:global(.prose a:hover) {
		text-decoration: underline;
	}
	:global(.prose strong) {
		font-weight: 700;
		color: #111827;
	}
	:global(.prose em) {
		font-style: italic;
	}
</style>
