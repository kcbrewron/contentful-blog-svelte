import { buildContentfulImageUrl, buildContentfulSrcset } from '$lib/contentful/imageUtils.js';

const PROTO_URL = '//images.ctfassets.net/abc/xyz/photo.jpg';
const HTTPS_URL = 'https://images.ctfassets.net/abc/xyz/photo.jpg';

describe('buildContentfulImageUrl', () => {
	it('returns empty string for null input', () => {
		expect(buildContentfulImageUrl(null)).toBe('');
	});

	it('returns empty string for empty string input', () => {
		expect(buildContentfulImageUrl('')).toBe('');
	});

	it('returns empty string for undefined input', () => {
		expect(buildContentfulImageUrl(undefined)).toBe('');
	});

	it('upgrades protocol-relative URL to HTTPS', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result.startsWith('https:')).toBe(true);
	});

	it('preserves an existing HTTPS URL', () => {
		const result = buildContentfulImageUrl(HTTPS_URL);
		expect(result.startsWith('https://images.ctfassets.net')).toBe(true);
	});

	it('applies default format webp', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).toContain('fm=webp');
	});

	it('applies default quality 80', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).toContain('q=80');
	});

	it('applies default fit fill', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).toContain('fit=fill');
	});

	it('appends width param when provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { width: 800 });
		expect(result).toContain('w=800');
	});

	it('appends height param when provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { height: 600 });
		expect(result).toContain('h=600');
	});

	it('omits width param when not provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).not.toContain('w=');
	});

	it('omits height param when not provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).not.toContain('h=');
	});

	it('allows format override to avif', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { format: 'avif' });
		expect(result).toContain('fm=avif');
	});

	it('allows quality override', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { quality: 60 });
		expect(result).toContain('q=60');
	});

	it('appends focus param when provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL, { focus: 'faces' });
		expect(result).toContain('f=faces');
	});

	it('omits focus param when not provided', () => {
		const result = buildContentfulImageUrl(PROTO_URL);
		expect(result).not.toContain('f=');
	});
});

describe('buildContentfulSrcset', () => {
	it('returns empty string for null URL', () => {
		expect(buildContentfulSrcset(null, [400, 800])).toBe('');
	});

	it('returns empty string for empty string URL', () => {
		expect(buildContentfulSrcset('', [400, 800])).toBe('');
	});

	it('returns empty string for empty widths array', () => {
		expect(buildContentfulSrcset(PROTO_URL, [])).toBe('');
	});

	it('returns empty string for null widths', () => {
		expect(buildContentfulSrcset(PROTO_URL, null)).toBe('');
	});

	it('generates one entry per width', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400, 800, 1200]);
		const parts = result.split(', ');
		expect(parts).toHaveLength(3);
	});

	it('uses W-descriptor format for each entry', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400, 800]);
		const parts = result.split(', ');
		expect(parts[0]).toMatch(/400w$/);
		expect(parts[1]).toMatch(/800w$/);
	});

	it('embeds correct width param in each URL', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400, 800, 1200]);
		expect(result).toContain('w=400');
		expect(result).toContain('w=800');
		expect(result).toContain('w=1200');
	});

	it('passes additional opts to each URL', () => {
		const result = buildContentfulSrcset(PROTO_URL, [400], { format: 'avif', quality: 70 });
		expect(result).toContain('fm=avif');
		expect(result).toContain('q=70');
	});
});
