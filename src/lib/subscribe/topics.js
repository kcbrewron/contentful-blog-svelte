/**
 * Canonical topic definitions for the newsletter subscription system.
 * Single source of truth used by: form validation, email templates, and the subscribe form UI.
 *
 * @typedef {Object} Topic
 * @property {string} slug - URL/DB identifier (matches Contentful category slug)
 * @property {string} label - Short display label for the subscribe form
 * @property {string} emailLabel - Full label used in email templates
 */

/** @type {Topic[]} */
export const TOPICS = [
	{ slug: 'architecture', label: 'Architecture', emailLabel: 'Cloud & Software Architecture' },
	{ slug: 'leadership', label: 'Leadership', emailLabel: 'Leading Effective Teams' },
	{ slug: 'life', label: 'Life', emailLabel: 'Beyond the Terminal' }
];

/**
 * Valid topic slugs — used for server-side form validation.
 * @type {Set<string>}
 */
export const VALID_TOPIC_SLUGS = new Set(TOPICS.map((t) => t.slug));

/**
 * Lookup map from slug to emailLabel — used in email templates.
 * @type {Record<string, string>}
 */
export const TOPIC_EMAIL_LABELS = Object.fromEntries(TOPICS.map((t) => [t.slug, t.emailLabel]));
