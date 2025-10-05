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
