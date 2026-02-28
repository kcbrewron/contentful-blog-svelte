<script>
	import '../app.css';

	/**
	 * @type {{ data: { categories: Array<any> } }}
	 */
	export let data;

	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<div class="min-h-screen flex flex-col">
	<!-- Main Navigation -->
	<nav class="bg-white shadow-md sticky top-0 z-50" aria-label="Main navigation">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<div class="flex-shrink-0">
					<a href="/" class="flex items-center group" on:click={closeMenu}>
						<span class="text-xl tracking-tight font-mono"><span class="text-blue-600 font-bold">ron</span><span class="text-gray-900 font-bold">nelson</span><span class="text-gray-500 font-light">.dev</span></span>
					</a>
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						<a
							href="/"
							class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
						>
							Home
						</a>
						{#each data.categories as category}
							<a
								href="/category/{category.fields.slug}"
								class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
							>
								{category.fields.name}
							</a>
						{/each}
					</div>
				</div>
				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button
						type="button"
						class="text-gray-700 hover:text-gray-900 p-2 rounded-md transition-colors duration-150"
						aria-expanded={menuOpen}
						aria-controls="mobile-menu"
						aria-label={menuOpen ? 'Close main menu' : 'Open main menu'}
						on:click={toggleMenu}
					>
						{#if menuOpen}
							<!-- X icon -->
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<!-- Hamburger icon -->
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile menu panel -->
		{#if menuOpen}
			<div id="mobile-menu" class="md:hidden border-t border-gray-100">
				<div class="px-2 pt-2 pb-3 space-y-1">
					<a
						href="/"
						class="block text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
						on:click={closeMenu}
					>
						Home
					</a>
					{#each data.categories as category}
						<a
							href="/category/{category.fields.slug}"
							class="block text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
							on:click={closeMenu}
						>
							{category.fields.name}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</nav>

	<!-- Main Content -->
	<main class="flex-1">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="bg-gray-800 text-white py-8 mt-auto">
		<div class="container mx-auto px-4 text-center">
			<p>&copy; {new Date().getFullYear()} ronnelson.dev. All rights reserved.</p>
		</div>
	</footer>
</div>
