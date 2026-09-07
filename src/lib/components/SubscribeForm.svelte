<script>
	import { enhance } from '$app/forms';
	import { TOPICS } from '$lib/subscribe/topics.js';

	/** @type {string} */
	export let siteKey = '';

	/** @type {'idle' | 'loading' | 'success' | 'error'} */
	let state = 'idle';
	let errorMessage = '';

	// All topics pre-selected per design decision
	/** @type {Record<string, boolean>} */
	let selectedTopics = Object.fromEntries(TOPICS.map((t) => [t.slug, true]));

	$: isLoading = state === 'loading';

	/**
	 * Turnstile widget container — used to reset after a failed submission.
	 * @type {HTMLDivElement | undefined}
	 */
	let turnstileContainer;

	/** @type {import('@sveltejs/kit').SubmitFunction} */
	function handleEnhance() {
		state = 'loading';

		return async ({ result, update }) => {
			if (result.type === 'success') {
				state = 'success';
			} else {
				state = 'error';
				errorMessage =
					result.type === 'failure'
						? /** @type {any} */ (result.data)?.error ?? 'Something went wrong. Please try again.'
						: 'Something went wrong. Please try again.';

				// Reset the Turnstile widget so the user can retry.
				// Read the widget ID Turnstile stamps on the container rather than passing
				// the element itself — the element reference can be stale after DOM patching.
				if (typeof window !== 'undefined' && window.turnstile && turnstileContainer) {
					const widgetId = turnstileContainer.dataset?.cfTurnstileWidgetId;
					try {
						if (widgetId) {
							window.turnstile.reset(widgetId);
						} else {
							window.turnstile.reset(turnstileContainer);
						}
					} catch {
						// Widget was already removed or expired — nothing to reset
					}
				}

				await update({ reset: false });
			}
		};
	}
</script>

<svelte:head>
	{#if siteKey}
		<script
			src="https://challenges.cloudflare.com/turnstile/v0/api.js"
			async
			defer
		></script>
	{/if}
</svelte:head>

{#if state === 'success'}
	<div class="flex flex-col items-start gap-4">
		<div class="w-12 h-12 rounded-full bg-brand-primary/15 flex items-center justify-center">
			<svg class="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</div>
		<p class="text-white font-semibold text-base">Check your inbox.</p>
		<p class="text-brand-text-subtle text-sm leading-relaxed">
			We've sent a confirmation link to your email. Click it to complete your subscription.
		</p>
	</div>
{:else}
	<form
		method="POST"
		action="/?/subscribe"
		use:enhance={handleEnhance}
		class="flex flex-col gap-4"
	>
		<!-- Email input -->
		<div>
			<label for="subscribe-email" class="sr-only">Email address</label>
			<input
				id="subscribe-email"
				name="email"
				type="email"
				required
				placeholder="you@example.com"
				disabled={isLoading}
				class="w-full h-12 px-4 rounded-lg bg-brand-border border border-brand-border-elevated text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
			/>
		</div>

		<!-- Topic checkboxes -->
		<fieldset>
			<legend class="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
				Topics
			</legend>
			<div class="flex flex-wrap gap-2">
				{#each TOPICS as topic}
					<label class="inline-flex items-center gap-2 cursor-pointer group">
						<input
							type="checkbox"
							name="topics"
							value={topic.slug}
							bind:checked={selectedTopics[topic.slug]}
							disabled={isLoading}
							class="w-4 h-4 rounded accent-brand-primary disabled:opacity-60"
						/>
						<span class="text-sm text-brand-text-muted group-hover:text-white transition-colors">{topic.label}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<!-- Turnstile widget (only rendered when a site key is configured) -->
		{#if siteKey}
			<div
				bind:this={turnstileContainer}
				class="cf-turnstile"
				data-sitekey={siteKey}
				data-theme="dark"
				data-size="flexible"
			></div>
		{/if}

		<!-- Error message -->
		{#if state === 'error'}
			<p class="text-red-400 text-sm" role="alert">{errorMessage}</p>
		{/if}

		<!-- Submit button -->
		<button
			type="submit"
			disabled={isLoading}
			class="w-full h-12 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-indigo-700 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
		>
			{#if isLoading}
				<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
				</svg>
				Subscribing…
			{:else}
				Subscribe to Newsletter
			{/if}
		</button>
	</form>
{/if}
