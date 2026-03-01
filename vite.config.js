import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Only pick up files inside tests/unit/ so Playwright e2e files are not
		// mistakenly included in the Vitest run.
		include: ['tests/unit/**/*.test.js'],

		// Expose describe/it/expect/vi/beforeEach globally so test files do not
		// need to import them (mirrors Jest ergonomics).
		globals: true,

		// Run tests in a Node environment — no browser DOM required for pure
		// logic and API utility tests.
		environment: 'node',

		// Resolve SvelteKit path aliases and the private env module so that
		// source files can be imported without the full SvelteKit build pipeline.
		alias: {
			$lib: '/src/lib',
			'$env/dynamic/private': '/tests/unit/__mocks__/env.js',
			'$env/static/private': '/tests/unit/__mocks__/env.js'
		}
	}
});
