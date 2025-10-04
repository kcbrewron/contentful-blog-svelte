<script>
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

	/**
	 * @type {{ fields: { heading: string, richContent?: any, content?: string, image: any, imagePosition: string } }}
	 */
	export let section;

	$: imagePosition = section.fields.imagePosition || 'left';
	$: imageUrl = section.fields.image?.fields?.file?.url;
	$: imageAlt = section.fields.image?.fields?.description || section.fields.image?.fields?.title || '';

	// Use richContent if available, otherwise fallback to plain content
	$: htmlContent = section.fields.richContent
		? documentToHtmlString(section.fields.richContent)
		: section.fields.content
			? `<p>${section.fields.content}</p>`
			: '';
</script>

<section class="py-12 bg-white">
	<div class="container mx-auto px-4 max-w-6xl">
		<h2 class="text-3xl font-bold mb-8 text-gray-900">{section.fields.heading}</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
			{#if imagePosition === 'left'}
				<div class="order-1">
					{#if imageUrl}
						<img src={imageUrl} alt={imageAlt} class="w-full h-auto rounded-lg shadow-lg" />
					{/if}
				</div>
				{#if htmlContent}
					<div class="order-2 prose prose-lg">
						{@html htmlContent}
					</div>
				{/if}
			{:else}
				{#if htmlContent}
					<div class="order-2 md:order-1 prose prose-lg">
						{@html htmlContent}
					</div>
				{/if}
				<div class="order-1 md:order-2">
					{#if imageUrl}
						<img src={imageUrl} alt={imageAlt} class="w-full h-auto rounded-lg shadow-lg" />
					{/if}
				</div>
			{/if}
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
