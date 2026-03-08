/**
 * Generates a cryptographically random URL-safe token.
 * Uses the Web Crypto API which is available in all modern runtimes
 * including Cloudflare Workers.
 *
 * @returns {string} A UUID string suitable for use as a one-time token
 */
export function generateToken() {
	return crypto.randomUUID();
}
