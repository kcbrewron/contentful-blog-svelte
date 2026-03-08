const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Cloudflare's published "always passes" test secret key.
 * When this value is in use, Turnstile verification is skipped server-side.
 * See: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
export const TURNSTILE_ALWAYS_PASSES_SECRET = '1x0000000000000000000000000000000AA';

/**
 * Verifies a Cloudflare Turnstile token against the siteverify API.
 *
 * @param {string} token - The cf-turnstile-response token from the form
 * @param {string} secretKey - The Turnstile secret key from env
 * @param {string | null} ip - The client IP (CF-Connecting-IP header)
 * @returns {Promise<boolean>} True if the token is valid
 */
export async function verifyTurnstile(token, secretKey, ip) {
	/** @type {Record<string, string>} */
	const body = {
		secret: secretKey,
		response: token
	};

	if (ip) {
		body.remoteip = ip;
	}

	const response = await fetch(SITEVERIFY_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		return false;
	}

	/** @type {{ success: boolean }} */
	const data = await response.json();
	return data.success === true;
}
