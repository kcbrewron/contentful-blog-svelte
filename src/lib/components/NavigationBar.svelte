<script>
	/**
	 * @typedef {Object} NavigationItem
	 * @property {string} label
	 * @property {string} url
	 */

	/**
	 * @type {{ fields: { title: string, navigationItems: Array<{fields: NavigationItem}> } }}
	 */
	export let navigationBar;
</script>

{#if navigationBar}
	<nav class="bg-white shadow-md" aria-label="{navigationBar.fields.title} navigation">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<div class="flex-shrink-0">
					<span class="text-xl font-bold text-gray-800">{navigationBar.fields.title}</span>
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						{#each navigationBar.fields.navigationItems || [] as item}
							<a
								href={item.fields.url}
								class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								{item.fields.label}
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</nav>
{/if}
