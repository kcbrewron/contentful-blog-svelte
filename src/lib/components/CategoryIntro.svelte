<script>
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
	import { richTextOptions } from '$lib/contentful/richTextOptions.js';

	/**
	 * @type {{ fields: { themeColor: string, introContent?: any, topicSections?: Array<any> } }}
	 */
	export let category;

	$: themeColor = category.fields.themeColor || 'blue';
	$: introHtml = category.fields.introContent
		? documentToHtmlString(category.fields.introContent, richTextOptions)
		: null;
	$: topicSections = category.fields.topicSections ?? [];
	$: hasContent = introHtml || topicSections.length > 0;

	const accentText = {
		blue: 'text-blue-600',
		green: 'text-green-600',
		purple: 'text-purple-600',
		red: 'text-red-600',
		orange: 'text-orange-600'
	};

	const accentBg = {
		blue: 'bg-blue-50',
		green: 'bg-green-50',
		purple: 'bg-purple-50',
		red: 'bg-red-50',
		orange: 'bg-orange-50'
	};

	const accentBorder = {
		blue: 'border-blue-200',
		green: 'border-green-200',
		purple: 'border-purple-200',
		red: 'border-red-200',
		orange: 'border-orange-200'
	};

	const accentDot = {
		blue: 'bg-blue-500',
		green: 'bg-green-500',
		purple: 'bg-purple-500',
		red: 'bg-red-500',
		orange: 'bg-orange-500'
	};

	$: textClass = accentText[themeColor] || accentText.blue;
	$: bgClass = accentBg[themeColor] || accentBg.blue;
	$: borderClass = accentBorder[themeColor] || accentBorder.blue;
	$: dotClass = accentDot[themeColor] || accentDot.blue;
</script>

{#if hasContent}
	<section class="py-14 bg-white border-b border-gray-100">
		<div class="container mx-auto px-4 max-w-4xl">

			<!-- Intro rich text -->
			{#if introHtml}
				<div class="prose prose-lg max-w-none mb-12 text-gray-700">
					{@html introHtml}
				</div>
			{/if}

			<!-- Topic sections -->
			{#if topicSections.length > 0}
				<div class="space-y-6">
					<h2 class="text-sm font-semibold uppercase tracking-widest text-gray-400">
						Topics in this category
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each topicSections as section}
							{@const fields = section.fields}
							<div class="rounded-lg border {borderClass} {bgClass} p-6">
								<h3 class="text-base font-semibold {textClass} mb-2">{fields.title}</h3>
								{#if fields.description}
									<p class="text-sm text-gray-600 mb-4 leading-relaxed">{fields.description}</p>
								{/if}
								{#if fields.links && fields.links.length > 0}
									<ul class="space-y-2">
										{#each fields.links as link}
											<li class="flex items-start gap-2">
												<span class="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0 {dotClass}" aria-hidden="true"></span>
												<a
													href={link.fields.url}
													class="text-sm text-gray-700 hover:{textClass} underline underline-offset-2 decoration-gray-300 hover:decoration-current transition-colors"
												>
													{link.fields.label}
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

		</div>
	</section>
{/if}
