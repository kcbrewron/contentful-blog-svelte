<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';
	/**
	 * @type {{ fields: { name: string, heroTitle: string, heroDescription?: string, heroImage?: any, themeColor: string } }}
	 */
	export let category;

	$: themeColor = category.fields.themeColor || 'blue';
	$: heroImageUrl = category.fields.heroImage?.fields?.file?.url;

	const colorClasses = {
		blue: 'bg-blue-600',
		green: 'bg-green-600',
		purple: 'bg-purple-600',
		red: 'bg-red-600',
		orange: 'bg-orange-600'
	};

	$: bgClass = colorClasses[themeColor] || colorClasses.blue;
</script>

<section class="relative {bgClass} text-white py-20">
	{#if heroImageUrl}
		<div class="absolute inset-0 opacity-20" aria-hidden="true">
			<img
				src={buildContentfulImageUrl(heroImageUrl, { width: 1600 })}
				srcset={buildContentfulSrcset(heroImageUrl, [800, 1200, 1600])}
				sizes="100vw"
				alt=""
				fetchpriority="high"
				class="w-full h-full object-cover"
			/>
		</div>
	{/if}

	<div class="relative container mx-auto px-4 max-w-6xl">
		<div class="text-center">
			<h1 class="text-5xl md:text-6xl font-bold mb-6">{category.fields.heroTitle}</h1>
			{#if category.fields.heroDescription}
				<p class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
					{category.fields.heroDescription}
				</p>
			{/if}
		</div>
	</div>
</section>
