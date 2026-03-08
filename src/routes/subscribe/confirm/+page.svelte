<script>
	export let data;
</script>

<svelte:head>
	<title>
		{data.status === 'success' ? "You're subscribed — ronnelson.dev" : 'Confirmation error — ronnelson.dev'}
	</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center px-6 py-24">
	<div class="max-w-md w-full text-center">
		{#if data.status === 'success'}
			<div class="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-8">
				<svg class="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-white mb-4">You're subscribed.</h1>
			<p class="text-brand-text-subtle text-base leading-relaxed mb-8">
				{data.email ? `${data.email} is now confirmed.` : 'Your email is confirmed.'}
				Welcome to ronnelson.dev — you'll receive new posts directly in your inbox.
			</p>

		{:else if data.status === 'unavailable'}
			<div class="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-8">
				<svg class="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-white mb-4">Almost there.</h1>
			<p class="text-brand-text-subtle text-base leading-relaxed mb-8">
				Confirmation is not available in this environment. In production your subscription would be confirmed here.
			</p>

		{:else}
			<div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-8">
				<svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-white mb-4">Link expired.</h1>
			<p class="text-brand-text-subtle text-base leading-relaxed mb-8">
				This confirmation link has already been used or has expired. If you haven't confirmed yet, try subscribing again.
			</p>
		{/if}

		<a
			href="/"
			class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-indigo-700 transition-colors duration-150"
		>
			Back to ronnelson.dev
		</a>
	</div>
</div>
