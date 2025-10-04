<script>
	import '../app.css';

	/**
	 * @type {{ data: { categories: Array<any> } }}
	 */
	export let data;
</script>

<div class="min-h-screen flex flex-col">
	<!-- Main Navigation -->
	<nav class="bg-white shadow-md sticky top-0 z-50">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<div class="flex-shrink-0">
					<a href="/" class="flex items-center space-x-2">
						<span class="text-2xl font-bold text-blue-600">ron</span>
						<span class="text-2xl font-bold text-gray-900">nelson</span>
						<span class="text-2xl font-light text-gray-500">.dev</span>
					</a>
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						<a
							href="/"
							class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							Home
						</a>
						{#each data.categories as category}
							<a
								href="/category/{category.fields.slug}"
								class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
						class="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2"
						aria-expanded="false"
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
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
