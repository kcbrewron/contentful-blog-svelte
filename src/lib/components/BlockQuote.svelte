<script>
	/**
	 * @type {{ fields: { quote: string, author?: string, authorTitle?: string } }}
	 */
	export let section;

	/**
	 * When true, renders with dark color tokens (for use inside dark prose well)
	 * @type {boolean}
	 */
	export let dark = false;
</script>

<section class="py-6 {dark ? '' : 'bg-white'}">
	<div class="{dark ? '' : 'container mx-auto px-4 max-w-4xl'}">
		<blockquote
			class="border-l-4 {dark
				? 'border-indigo-500 pl-6 bg-slate-800/50 py-3 rounded-r-lg'
				: 'border-gray-200 pl-5'}"
		>
			<p class="text-lg {dark ? 'text-zinc-300' : 'text-gray-600'} italic leading-relaxed">
				{section.fields.quote}
			</p>
			{#if section.fields.author}
				<footer class="mt-3">
					<p class="text-sm {dark ? 'text-zinc-400' : 'text-gray-700'} not-italic">
						— <span class="font-semibold">{section.fields.author}</span>{#if section.fields.authorTitle},
							<span class="{dark ? 'text-zinc-500' : 'text-gray-500'} font-normal"
								>{section.fields.authorTitle}</span
							>{/if}
					</p>
				</footer>
			{/if}
		</blockquote>
	</div>
</section>
