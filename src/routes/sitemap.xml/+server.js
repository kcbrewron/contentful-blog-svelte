import { getAllCategories, getAllBlogSlugs } from '$lib/contentful/queries.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
  const base = 'https://www.ronnelson.dev';

  // Gather dynamic paths
  const [categories, slugs] = await Promise.all([
    getAllCategories(),
    getAllBlogSlugs()
  ]);

  const urls = new Set();

  // always include root
  urls.add(base);
  // include categories
  categories.forEach((cat) => {
    if (cat.fields?.slug) {
      urls.add(`${base}/category/${cat.fields.slug}`);
    }
  });

  // include posts
  slugs.forEach((slug) => {
    urls.add(`${base}/blog/${slug}`);
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
