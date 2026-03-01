<script>
	/**
	 * @type {{ title?: string, subtitle?: string, description?: string, ctaText?: string, ctaUrl?: string }}
	 */
	export let heroData = {
		title: 'Ron Nelson',
		subtitle: 'Cloud & Software Architecture',
		description:
			'Practical insights on edge-native architecture, distributed systems design, AI workloads, and building on the Cloudflare platform.',
		ctaText: 'Explore Articles',
		ctaUrl: '#Cloud%20&%20Software%20Architecture'
	};

	/**
	 * @type {Array<{name: string, slug: string}>}
	 */
	export let categories = [];

	/**
	 * @type {Array<string>}
	 */
	export let featuredImages = [];
</script>

<section class="relative text-white py-24 overflow-hidden min-h-[600px] flex items-center">
	<!-- Image Collage Background -->
	{#if featuredImages.length > 0}
		<div class="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2" aria-hidden="true">
			{#each featuredImages.slice(0, 4) as imageUrl, index}
				<div class="relative overflow-hidden animate-fade-in" style="animation-delay: {index * 100}ms">
					<img
						src={imageUrl}
						alt=""
						class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
					/>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Gradient Overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-purple-900/95"></div>

	<!-- Additional texture overlay for depth -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

	<div class="relative container mx-auto px-4 max-w-6xl z-10">
		<div class="text-center">
			<h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in drop-shadow-lg">
				{heroData.title}
			</h1>

			{#if heroData.subtitle}
				<p class="text-2xl md:text-3xl font-light mb-6 opacity-95 drop-shadow-md animate-slide-up">
					{heroData.subtitle}
				</p>
			{/if}

			{#if heroData.description}
				<p class="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-95 leading-relaxed drop-shadow-md animate-slide-up" style="animation-delay: 100ms">
					{heroData.description}
				</p>
			{/if}

			<!-- Category quick links -->
			{#if categories.length > 0}
				<div class="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up" style="animation-delay: 200ms">
					{#each categories as category}
						<a
							href="/{category.slug}"
							class="px-5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
						>
							{category.name}
						</a>
					{/each}
				</div>
			{/if}

			{#if heroData.ctaText && heroData.ctaUrl}
				<div class="animate-slide-up" style="animation-delay: 300ms">
					<a
						href={heroData.ctaUrl}
						class="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
					>
						{heroData.ctaText}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</a>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.8s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-up {
		animation: slide-up 0.8s ease-out forwards;
		opacity: 0;
	}
</style>
