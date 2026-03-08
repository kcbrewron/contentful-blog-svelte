/**
 * Handles instant unsubscribe from the one-click link sent in emails.
 *
 * @param {{ url: URL, platform?: { env?: any } }} event
 * @returns {Promise<{ status: 'success' | 'invalid' | 'unavailable' }>}
 */
export async function load({ url, platform }) {
	const token = url.searchParams.get('token') ?? '';
	const env = platform?.env;

	if (!token) {
		return { status: 'invalid' };
	}

	if (!env?.SUBSCRIBERS_DB) {
		return { status: 'unavailable' };
	}

	try {
		// Single UPDATE — idempotent, no prior SELECT needed.
		// meta.changes === 0 means the token was not found.
		const result = await env.SUBSCRIBERS_DB.prepare(
			"UPDATE subscribers SET status = 'unsubscribed' WHERE unsubscribe_token = ?"
		)
			.bind(token)
			.run();

		if (result.meta.changes === 0) {
			return { status: 'invalid' };
		}

		return { status: 'success' };
	} catch (error) {
		console.error('Unsubscribe error:', error);
		return { status: 'invalid' };
	}
}
