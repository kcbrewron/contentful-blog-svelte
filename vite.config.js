import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		include: ['tests/unit/**/*.test.js'],
		globals: true,
		environment: 'node',
		alias: {
			$lib: '/src/lib',
			'$env/dynamic/private': '/tests/unit/__mocks__/env.js',
			'$env/static/private': '/tests/unit/__mocks__/env.js'
		}
	}
});
