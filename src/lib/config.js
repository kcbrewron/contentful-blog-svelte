/**
 * Canonical site configuration constants.
 * These are used in server-side code where env vars are not appropriate
 * (e.g. email templates, sitemap, structured data).
 */

export const SITE_NAME = 'ronnelson.dev';
export const FROM_ADDRESS = 'ron@ronnelson.dev';

/**
 * Canonical base URL — no trailing slash, no www.
 * Cloudflare routes ronnelson.dev → www.ronnelson.dev (or vice-versa) via a redirect rule,
 * so pick one and be consistent. Update here if the canonical domain changes.
 */
export const BASE_URL = 'https://ronnelson.dev';
