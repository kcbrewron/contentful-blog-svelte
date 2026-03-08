<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { richTextOptions } from '$lib/contentful/richTextOptions.js';

	/**
	 * @type {{ fields: { heading: string, richContent?: any, content?: string, image: any, imagePosition: string } }}
	 */
	export let section;

	/**
	 * When true, renders with dark color tokens (for use inside dark prose well)
	 * @type {boolean}
	 */
	export let dark = false;

	$: imagePosition = section.fields.imagePosition || 'left';
	$: imageUrl = section.fields.image?.fields?.file?.url;
	$: imageAlt = section.fields.image?.fields?.description || section.fields.image?.fields?.title || '';

	$: htmlContent = section.fields.richContent
		? documentToHtmlString(section.fields.richContent, richTextOptions)
		: section.fields.content
			? `<p>${section.fields.content}</p>`
			: '';
</script>

<section class="py-6 {dark ? '' : 'bg-white'}">
	<div class="{dark ? '' : 'container mx-auto px-4 max-w-4xl'}">
		<h2 class="text-3xl font-bold mb-8 {dark ? 'text-white' : 'text-gray-900'}">
			{section.fields.heading}
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
			{#if imagePosition === 'left'}
				<div class="order-1">
					{#if imageUrl}
						<img
							src={buildContentfulImageUrl(imageUrl, { width: 800 })}
							srcset={buildContentfulSrcset(imageUrl, [400, 800])}
							sizes="(min-width:768px) 50vw, 100vw"
							alt={imageAlt}
							loading="lazy"
							decoding="async"
							class="w-full h-auto rounded-lg {dark ? 'shadow-lg shadow-black/40' : 'shadow-lg'}"
						/>
					{/if}
				</div>
				{#if htmlContent}
					<div class="order-2 prose {dark ? 'prose-dark' : ''} prose-lg">
						{@html htmlContent}
					</div>
				{/if}
			{:else}
				{#if htmlContent}
					<div class="order-2 md:order-1 prose {dark ? 'prose-dark' : ''} prose-lg">
						{@html htmlContent}
					</div>
				{/if}
				<div class="order-1 md:order-2">
					{#if imageUrl}
						<img
							src={buildContentfulImageUrl(imageUrl, { width: 800 })}
							srcset={buildContentfulSrcset(imageUrl, [400, 800])}
							sizes="(min-width:768px) 50vw, 100vw"
							alt={imageAlt}
							loading="lazy"
							decoding="async"
							class="w-full h-auto rounded-lg {dark ? 'shadow-lg shadow-black/40' : 'shadow-lg'}"
						/>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>
