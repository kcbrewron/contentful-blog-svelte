<script>
	import { page } from '$app/stores';

	$: status = $page.status;
	$: is404 = status === 404;

	const messages = {
		404: {
			code: '404',
			headline: 'Page not found.',
			body: "You followed a broken link, mistyped the URL, or this content was quietly deprecated without a redirect. It happens to the best of us.",
			quip: "Error: Cannot read properties of 'route' (reading 'content')",
			cta: 'Back to home'
		},
		500: {
			code: '500',
			headline: 'Something went wrong on our end.',
			body: "Our servers hit an unexpected exception. The logs have been consulted, the blame has been assigned, and someone is definitely looking into it.",
			quip: "UnhandledPromiseRejection: We'll fix it before standup. Probably.",
			cta: 'Back to home'
		}
	};

	$: error = messages[status] ?? {
		code: String(status),
		headline: 'An unexpected error occurred.',
		body: "We're not entirely sure what happened here, but we're mildly concerned.",
		quip: `HTTP ${status}: ¯\\_(ツ)_/¯`,
		cta: 'Back to home'
	};
</script>

<svelte:head>
	<title>{error.code} — {error.headline} | ronnelson.dev</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center px-4 py-24">
	<div class="max-w-2xl w-full text-center">

		<!-- Status code -->
		<p class="font-mono text-8xl md:text-9xl font-bold text-blue-600 leading-none mb-6 select-none" aria-hidden="true">
			{error.code}
		</p>

		<!-- Headline -->
		<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
			{error.headline}
		</h1>

		<!-- Body -->
		<p class="text-lg text-gray-600 mb-8 leading-relaxed">
			{error.body}
		</p>

		<!-- Dev humor quip -->
		<div class="bg-gray-900 rounded-lg px-6 py-4 mb-10 text-left" role="note" aria-label="Error detail">
			<p class="font-mono text-sm text-red-400 leading-relaxed">{error.quip}</p>
			<p class="font-mono text-xs text-gray-500 mt-1">at ronnelson.dev (somewhere in the call stack)</p>
		</div>

		<!-- Actions -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/"
				class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-150 shadow-md"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				{error.cta}
			</a>
			{#if !is404}
				<button
					type="button"
					class="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors duration-150"
					on:click={() => window.location.reload()}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Try again
				</button>
			{/if}
		</div>

	</div>
</div>
