<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { richTextOptions } from '$lib/contentful/richTextOptions.js';

	/**
	 * @type {{ section: { fields: { heading: string, richContent?: any, content?: string, image: any, imagePosition: string } }, dark?: boolean }}
	 */
	const { section, dark = false } = $props();

	let lightboxOpen = $state(false);

	function openLightbox() {
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function handleKeydown(/** @type {KeyboardEvent} */ e) {
		if (e.key === 'Escape') closeLightbox();
	}

	const imagePosition = $derived(section.fields.imagePosition || 'left');
	const imageUrl = $derived(section.fields.image?.fields?.file?.url);
	const imageAlt = $derived(section.fields.image?.fields?.description || section.fields.image?.fields?.title || '');

	const htmlContent = $derived(
		section.fields.richContent
			? documentToHtmlString(section.fields.richContent, richTextOptions)
			: section.fields.content
				? `<p>${section.fields.content}</p>`
				: ''
	);
</script>

<svelte:window onkeydown={lightboxOpen ? handleKeydown : undefined} />

<section class="py-6 {dark ? '' : 'bg-white'}">
	<div class="{dark ? '' : 'container mx-auto px-4 max-w-4xl'}">
		<h2 class="text-3xl font-bold mb-8 {dark ? 'text-white' : 'text-gray-900'}">
			{section.fields.heading}
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
			{#if imagePosition === 'left'}
				<div class="order-1">
					{#if imageUrl}
						<button
							type="button"
							class="group relative block w-full cursor-zoom-in rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
							onclick={openLightbox}
							aria-label="View larger image: {imageAlt || section.fields.heading}"
						>
							<img
								src={buildContentfulImageUrl(imageUrl, { width: 800 })}
								srcset={buildContentfulSrcset(imageUrl, [400, 800])}
								sizes="(min-width:768px) 50vw, 100vw"
								alt={imageAlt}
								loading="lazy"
								decoding="async"
								class="w-full h-auto rounded-lg {dark ? 'shadow-lg shadow-black/40' : 'shadow-lg'}"
							/>
							<span
								class="pointer-events-none absolute inset-0 rounded-lg bg-black/0 transition-colors group-hover:bg-black/5"
								aria-hidden="true"
							></span>
							<span
								class="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
								aria-hidden="true"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
								</svg>
							</span>
						</button>
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
						<button
							type="button"
							class="group relative block w-full cursor-zoom-in rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
							onclick={openLightbox}
							aria-label="View larger image: {imageAlt || section.fields.heading}"
						>
							<img
								src={buildContentfulImageUrl(imageUrl, { width: 800 })}
								srcset={buildContentfulSrcset(imageUrl, [400, 800])}
								sizes="(min-width:768px) 50vw, 100vw"
								alt={imageAlt}
								loading="lazy"
								decoding="async"
								class="w-full h-auto rounded-lg {dark ? 'shadow-lg shadow-black/40' : 'shadow-lg'}"
							/>
							<span
								class="pointer-events-none absolute inset-0 rounded-lg bg-black/0 transition-colors group-hover:bg-black/5"
								aria-hidden="true"
							></span>
							<span
								class="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
								aria-hidden="true"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
								</svg>
							</span>
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

{#if lightboxOpen && imageUrl}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10"
		role="dialog"
		aria-modal="true"
		aria-label={imageAlt || section.fields.heading}
		onclick={closeLightbox}
	>
		<button
			type="button"
			class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
			onclick={closeLightbox}
			aria-label="Close"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 6 6 18M6 6l12 12" />
			</svg>
		</button>
		<img
			src={buildContentfulImageUrl(imageUrl, { width: 1600, quality: 90 })}
			alt={imageAlt}
			class="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		/>
	</div>
{/if}
