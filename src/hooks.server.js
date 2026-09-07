// See https://kit.svelte.dev/docs/hooks#server-hooks for more information
export const handle = async ({ event, resolve }) => {
	return resolve(event);
};
