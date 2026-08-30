<script>
	import { buildContentfulImageUrl } from '$lib/contentful/imageUtils.js';

	/**
	 * @type {Object}
	 */
	export let category = {};

	/**
	 * @type {number}
	 */
	export let totalPosts = 0;

	/**
	 * @type {number}
	 */
	export let avgReadingTime = 8;

	$: label = category.fields?.label || category.fields?.name || '';
	$: heroTitle = category.fields?.heroTitle || category.fields?.name || '';
	$: heroDescription = category.fields?.heroDescription || category.fields?.description || '';
	$: themeColor = category.fields?.themeColor || 'indigo';

</script>

<section class="relative bg-gradient-to-b from-slate-950 to-slate-900 pt-20 pb-16 lg:pt-28 lg:pb-20" data-theme={themeColor}>
	<!-- Breadcrumb -->
	<div class="mx-auto max-w-7xl px-6 lg:px-8 mb-12">
		<nav class="flex items-center gap-2 text-sm">
			<a
				href="/"
				class="text-zinc-400 hover:text-white transition-colors"
			>
				Home
			</a>
			<span class="text-zinc-600">/</span>
			<span class="text-zinc-300">{label}</span>
		</nav>
	</div>

	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Badge with indicator -->
		<div class="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2" style="background: var(--theme-badge-bg); color: var(--theme-badge-text);">
			<div class="h-2 w-2 rounded-full" style="background: var(--theme-dot);"></div>
			<span class="text-xs font-semibold uppercase tracking-wider">{label}</span>
		</div>

		<!-- Main heading -->
		<h1 class="mb-6 max-w-3xl text-5xl lg:text-6xl font-bold text-white leading-tight lg:leading-tight tracking-tight">
			{heroTitle}
		</h1>

		<!-- Description -->
		<p class="mb-8 max-w-2xl text-lg text-zinc-300 leading-relaxed">
			{heroDescription}
		</p>

		<!-- Metadata -->
		<div class="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
				</svg>
				<span>{totalPosts} {totalPosts === 1 ? 'article' : 'articles'}</span>
			</div>
			<div class="h-4 w-px bg-zinc-700"></div>
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{avgReadingTime} min average read</span>
			</div>
		</div>
	</div>
</section>
