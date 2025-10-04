// See https://kit.svelte.dev/docs/hooks#client-hooks for more information
export const handleError = ({ error, event }) => {
	console.error('Client error:', error);
	return {
		message: 'An unexpected error occurred.',
		code: error?.code ?? 'UNKNOWN'
	};
};
