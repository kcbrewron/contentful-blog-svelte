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
	<!-- Navigation Bar -->
	<nav class="bg-brand-dark border-b border-brand-border sticky top-0 z-50 py-4" aria-label="Main navigation">
		<div class="max-w-7xl mx-auto px-20">
			<div class="flex items-center justify-between h-18">
				<!-- Logo -->
				<div class="flex-shrink-0">
					<a href="/" class="flex items-center gap-1 group" on:click={closeMenu}>
						<span class="text-xl tracking-tight font-sans">
							<span class="text-white font-bold">ron</span><span class="text-brand-primary font-light">nelson</span><span class="text-brand-text-muted font-light">.dev</span>
						</span>
					</a>
				</div>

				<!-- Desktop Navigation Links -->
				<div class="hidden md:block">
					<div class="flex items-center gap-10">
						{#each data.categories as category}
							<a
								href="/{category.fields.slug}"
								class="text-brand-text-muted hover:text-white text-sm font-medium transition-colors duration-150"
							>
								{category.fields.name}
							</a>
						{/each}
					</div>
				</div>

				<!-- CTA Button + Mobile Menu Button -->
				<div class="flex items-center gap-4">
					<a href="/#subscribe" class="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-indigo-700 transition-colors duration-150">
						Subscribe
					</a>
					
					<!-- Mobile menu button -->
					<div class="md:hidden">
						<button
							type="button"
							class="text-brand-text-muted hover:text-white p-2 rounded-md transition-colors duration-150"
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
		</div>

		<!-- Mobile menu panel -->
		{#if menuOpen}
			<div id="mobile-menu" class="md:hidden border-t border-brand-border bg-brand-dark">
				<div class="px-4 py-4 space-y-2">
					{#each data.categories as category}
						<a
							href="/{category.fields.slug}"
							class="block text-brand-text-muted hover:text-white hover:bg-brand-border/20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
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
	<footer class="bg-brand-darker text-white mt-auto border-t border-brand-border">
		<div class="max-w-7xl mx-auto px-20 py-16">
			<!-- Footer Top Section -->
			<div class="flex flex-col md:flex-row justify-between gap-12 mb-12">
				<!-- Brand Column -->
				<div class="flex flex-col gap-4 w-full md:w-80">
					<a href="/" class="inline-flex items-center gap-1 w-fit">
						<span class="text-base font-sans">
							<span class="text-white font-bold">ron</span><span class="text-brand-primary font-light">nelson</span><span class="text-brand-text-muted font-light">.dev</span>
						</span>
					</a>
					<p class="text-brand-text-subtle text-sm leading-relaxed">
						Practical insights on Cloudflare Workers, distributed systems, and building production software.
					</p>
				</div>

				<!-- Navigation Column 1 -->
				<div class="flex flex-col gap-4 flex-1">
					<h3 class="text-white font-semibold text-sm uppercase tracking-wide">Categories</h3>
					<nav class="flex flex-col gap-3">
						{#each data.categories as category}
							<a
								href="/{category.fields.slug}"
								class="text-brand-text-muted hover:text-white text-sm transition-colors duration-150"
							>
								{category.fields.name}
							</a>
						{/each}
					</nav>
				</div>

				<!-- Navigation Column 2 -->
				<div class="flex flex-col gap-4 flex-1">
					<h3 class="text-white font-semibold text-sm uppercase tracking-wide">Resources</h3>
					<nav class="flex flex-col gap-3">
						<a href="/sitemap.xml" class="text-brand-text-muted hover:text-white text-sm transition-colors duration-150">
							Sitemap
						</a>
						<button class="text-brand-text-muted hover:text-white text-sm transition-colors duration-150 text-left" aria-label="RSS Feed is not yet available">
							RSS Feed
						</button>
						<button class="text-brand-text-muted hover:text-white text-sm transition-colors duration-150 text-left" aria-label="Contact is not yet available">
							Contact
						</button>
					</nav>
				</div>
			</div>

			<!-- Footer Divider -->
			<div class="h-px bg-brand-border mb-8"></div>

			<!-- Footer Bottom Section -->
			<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
				<p class="text-brand-text-subtle text-xs">&copy; {new Date().getFullYear()} ronnelson.dev. All rights reserved.</p>
				<p class="text-brand-text-dimmer text-xs">Built with Cloudflare Workers & Contentful</p>
			</div>
		</div>
	</footer>
</div>
