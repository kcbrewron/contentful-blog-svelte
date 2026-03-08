<script>
	export let data;
</script>

<svelte:head>
	<title>Unsubscribed — ronnelson.dev</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center px-6 py-24">
	<div class="max-w-md w-full text-center">
		{#if data.status === 'success'}
			<div class="w-16 h-16 rounded-full bg-brand-border flex items-center justify-center mx-auto mb-8">
				<svg class="w-8 h-8 text-brand-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-white mb-4">You've been unsubscribed.</h1>
			<p class="text-brand-text-subtle text-base leading-relaxed mb-8">
				Sorry to see you go. You won't receive any more emails from ronnelson.dev.
			</p>
			<p class="text-brand-text-subtle text-sm mb-8">
				Changed your mind? You can always <a href="/#subscribe" class="text-brand-primary hover:underline">subscribe again</a>.
			</p>

		{:else if data.status === 'unavailable'}
			<div class="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-8">
				<svg class="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-white mb-4">Not available.</h1>
			<p class="text-brand-text-subtle text-base leading-relaxed mb-8">
				Unsubscribe is not available in this environment.
			</p>

		{:else}
			<div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-8">
				<svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-white mb-4">Link not recognized.</h1>
			<p class="text-brand-text-subtle text-base leading-relaxed mb-8">
				This unsubscribe link was not recognized. You may have already been removed, or the link may be invalid.
			</p>
		{/if}

		<a
			href="/"
			class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-border text-brand-text-muted text-sm font-semibold hover:text-white transition-colors duration-150"
		>
			Back to ronnelson.dev
		</a>
	</div>
</div>
