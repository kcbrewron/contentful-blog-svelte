/**
 * Contentful Images API URL builder utilities.
 * @see https://www.contentful.com/developers/docs/references/images-api/
 */

/**
 * @param {string|null|undefined} url
 * @returns {string}
 */
function normalizeContentfulUrl(url) {
	if (!url) return '';
	if (url.startsWith('//')) return 'https:' + url;
	return url;
}

/**
 * Builds a Contentful Images API URL with transformation parameters.
 *
 * @param {string|null|undefined} url - Raw Contentful asset URL (protocol-relative or HTTPS)
 * @param {Object} [opts]
 * @param {number} [opts.width] - Output width in pixels
 * @param {number} [opts.height] - Output height in pixels
 * @param {'webp'|'avif'|'jpg'|'png'|'gif'} [opts.format='webp'] - Output format
 * @param {number} [opts.quality=80] - Quality 1–100
 * @param {'fill'|'scale'|'crop'|'thumb'|'pad'} [opts.fit='fill'] - Resize behavior
 * @param {string} [opts.focus] - Focus area e.g. 'faces', 'center', 'top'
 * @returns {string} Fully-qualified HTTPS URL with query params, or '' for empty input
 */
export function buildContentfulImageUrl(url, opts = {}) {
	const normalized = normalizeContentfulUrl(url);
	if (!normalized) return '';

	const { width, height, format = 'webp', quality = 80, fit = 'fill', focus } = opts;

	const params = new URLSearchParams();
	if (width) params.set('w', String(width));
	if (height) params.set('h', String(height));
	params.set('fm', format);
	params.set('q', String(quality));
	params.set('fit', fit);
	if (focus) params.set('f', focus);

	return `${normalized}?${params.toString()}`;
}

/**
 * Builds a W-descriptor srcset string for responsive images.
 *
 * @param {string|null|undefined} url - Raw Contentful asset URL
 * @param {number[]|null} widths - Array of pixel widths e.g. [400, 800, 1200]
 * @param {Object} [opts] - Same options as buildContentfulImageUrl (width is overridden per entry)
 * @returns {string} srcset string or '' for empty input
 */
export function buildContentfulSrcset(url, widths, opts = {}) {
	if (!url || !widths || widths.length === 0) return '';
	return widths
		.map((w) => `${buildContentfulImageUrl(url, { ...opts, width: w })} ${w}w`)
		.join(', ');
}
