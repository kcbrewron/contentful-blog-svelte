<script>
	/**
	 * @type {{ fields: { caption: string, code: string, language: string } }}
	 */
	export let section;

	$: language = section.fields.language || 'plaintext';
</script>

<section class="py-12 bg-gray-900">
	<div class="container mx-auto px-4 max-w-6xl">
		<h3 class="text-xl font-semibold mb-4 text-gray-100">{section.fields.caption}</h3>
		<div class="relative">
			<div class="absolute top-3 right-3 text-xs text-gray-400 uppercase font-mono">
				{language}
			</div>
			<pre
				class="bg-gray-800 rounded-lg p-6 overflow-x-auto"><code class="language-{language} text-sm text-gray-100 font-mono">{section.fields.code}</code></pre>
		</div>
	</div>
</section>

<style>
	pre {
		margin: 0;
	}
	code {
		display: block;
		white-space: pre;
		word-wrap: normal;
	}
</style>
