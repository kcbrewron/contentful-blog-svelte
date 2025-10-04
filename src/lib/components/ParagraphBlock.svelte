<script>
	/**
	 * @type {{ fields: { heading: string, content: string, alignment?: string } }}
	 */
	export let section;

	$: alignment = section.fields.alignment || 'left';
	$: alignmentClass = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	}[alignment];
</script>

<section class="py-12 bg-white">
	<div class="container mx-auto px-4 max-w-6xl">
		<h2 class="text-3xl font-bold mb-6 text-gray-900 {alignmentClass}">{section.fields.heading}</h2>
		<div class="prose prose-lg max-w-none {alignmentClass}">
			<p class="text-gray-700 whitespace-pre-wrap">{section.fields.content}</p>
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
