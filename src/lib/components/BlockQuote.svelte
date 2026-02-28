<script>
	/**
	 * @type {{ fields: { quote: string, author?: string, authorTitle?: string } }}
	 */
	export let section;
</script>

<section class="py-6 bg-white">
	<div class="container mx-auto px-4 max-w-4xl">
		<blockquote class="border-l-4 border-gray-200 pl-5">
			<p class="text-lg text-gray-600 italic leading-relaxed">{section.fields.quote}</p>
			{#if section.fields.author}
				<footer class="mt-3">
					<p class="text-sm text-gray-700 not-italic">
						— <span class="font-semibold">{section.fields.author}</span>{#if section.fields.authorTitle},
							<span class="text-gray-500 font-normal">{section.fields.authorTitle}</span>{/if}
					</p>
				</footer>
			{/if}
		</blockquote>
	</div>
</section>
