<script>
	import Prism from 'prismjs';
	import 'prismjs/components/prism-markup';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-jsx';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-tsx';
	import 'prismjs/components/prism-bash';
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-yaml';
	import 'prismjs/components/prism-toml';
	import 'prismjs/components/prism-sql';

	/**
	 * @type {{ fields: { caption: string, code: string, language: string } }}
	 */
	export let section;

	/** Maps common shorthand aliases to Prism language keys */
	const languageAliases = {
		js: 'javascript',
		ts: 'typescript',
		sh: 'bash',
		shell: 'bash',
		html: 'markup',
		xml: 'markup',
		svelte: 'markup'
	};

	/**
	 * @param {string} text
	 * @returns {string}
	 */
	function escapeHtml(text) {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	$: rawLanguage = (section.fields.language || 'plaintext').toLowerCase();
	$: language = languageAliases[rawLanguage] ?? rawLanguage;

	$: highlightedCode = (() => {
		const grammar = Prism.languages[language];
		if (grammar) {
			return Prism.highlight(section.fields.code, grammar, language);
		}
		return escapeHtml(section.fields.code);
	})();
</script>

<section class="py-6 bg-gray-900">
	<div class="container mx-auto px-4 max-w-4xl">
		<div class="flex items-center justify-between mb-3">
			<p class="text-xs font-mono uppercase tracking-widest text-gray-400">
				{section.fields.caption}
			</p>
			<span class="text-xs text-gray-500 uppercase font-mono" aria-hidden="true">{rawLanguage}</span>
		</div>
		<div class="relative">
			<pre
				class="bg-gray-800 rounded-lg p-6 overflow-x-auto"
				tabindex="0"
				role="region"
				aria-label="{section.fields.caption} code example"
			><code class="language-{language} text-sm font-mono">{@html highlightedCode}</code></pre>
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
