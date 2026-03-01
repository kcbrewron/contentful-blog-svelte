import { getAllCategories, getAllBlogPostsForSitemap } from '$lib/contentful/queries.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
  const base = 'https://www.ronnelson.dev';

  const [categories, posts] = await Promise.all([
    getAllCategories(),
    getAllBlogPostsForSitemap()
  ]);

  const urls = new Set();

  // Root
  urls.add(base);

  // Category landing pages at /{categorySlug}
  categories.forEach((cat) => {
    if (cat.fields?.slug) {
      urls.add(`${base}/${cat.fields.slug}`);
    }
  });

  // Article pages at /{categorySlug}/{articleSlug}
  posts.forEach(({ slug, categorySlug }) => {
    urls.add(`${base}/${categorySlug}/${slug}`);
  });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    Array.from(urls)
      .map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`)
      .join('\n') +
    `\n</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
