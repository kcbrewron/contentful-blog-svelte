<script>
	import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';

	/**
	 * @type {{ title?: string, subtitle?: string, description?: string, ctaText?: string, ctaUrl?: string }}
	 */
	export let heroData = {
		title: 'Edge-Native, Distributed Systems, Real Production',
		subtitle: '',
		description:
			'Practical insights on Cloudflare Workers, distributed architecture, AI workloads, and the real-world decisions behind building production systems — by Ron Nelson.',
		ctaText: 'Explore Articles',
		ctaUrl: '/#featured'
	};

	/**
	 * @type {Array<{name: string, slug: string}>}
	 */
	export let categories = [];

	/**
	 * @type {Array<{url: string, width: number|null, height: number|null}>}
	 */
	export let featuredImages = [];

	/**
	 * @type {number}
	 */
	export let articleCount = 0;
</script>

<section class="bg-brand-dark text-white py-24 md:py-32 lg:py-[140px]">
	<div class="max-w-7xl mx-auto px-20">
		<!-- Hero Badge -->
		<div class="mb-8">
			<div class="inline-flex items-center gap-2 bg-brand-border rounded-full px-3.5 py-1.5">
				<svg class="w-3 h-3 fill-brand-primary" viewBox="0 0 12 12" aria-hidden="true">
					<circle cx="6" cy="6" r="4" />
				</svg>
				<span class="text-xs font-semibold text-brand-primary uppercase tracking-wide">New insights</span>
			</div>
		</div>

		<!-- Main Headline -->
		<div class="mb-8 max-w-3xl">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight md:leading-tight lg:leading-tight tracking-tight mb-6">
				Edge-Native,<br />
				Distributed Systems,<br />
				<span class="text-brand-primary">Real Production</span>
			</h1>
		</div>

		<!-- Subtitle/Description -->
		{#if heroData.description}
			<div class="max-w-2xl mb-12">
				<p class="text-base md:text-lg text-brand-text-subtle leading-relaxed">
					{heroData.description}
				</p>
			</div>
		{/if}

		<!-- CTAs -->
		<div class="flex flex-col sm:flex-row items-start gap-4 mb-16">
			<a
				href={heroData.ctaUrl}
				class="inline-flex items-center justify-center px-7 py-3.5 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-150"
			>
				{heroData.ctaText}
			</a>
			<button
				class="inline-flex items-center justify-center px-7 py-3.5 border border-brand-border text-brand-text-muted rounded-lg hover:text-white hover:border-brand-text-muted transition-colors duration-150"
				aria-label="Learn about the blog"
			>
				Learn more
			</button>
		</div>

		<!-- Stats Section -->
		{#if categories.length > 0 || articleCount > 0}
			<div class="flex flex-col sm:flex-row items-start gap-8 max-w-2xl">
				<div>
					<div class="text-2xl md:text-3xl font-bold text-white mb-1">{categories.length}</div>
					<p class="text-xs md:text-sm text-brand-text-muted uppercase tracking-wide">Topics</p>
				</div>
				<div class="hidden sm:block w-10 h-px bg-brand-border self-center"></div>
				<div>
					<div class="text-2xl md:text-3xl font-bold text-white mb-1">{articleCount}</div>
					<p class="text-xs md:text-sm text-brand-text-muted uppercase tracking-wide">Articles</p>
				</div>
				<div class="hidden sm:block w-10 h-px bg-brand-border self-center"></div>
				<div>
					<div class="text-2xl md:text-3xl font-bold text-white mb-1">Edge</div>
					<p class="text-xs md:text-sm text-brand-text-muted uppercase tracking-wide">Deployed</p>
				</div>
			</div>
		{/if}
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
