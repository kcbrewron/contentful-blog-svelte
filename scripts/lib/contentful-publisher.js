// Shared Contentful CMA publishing library.
//
// Article definition files import helpers from here and export a config
// object. The generic runner (scripts/publish-article.mjs) wires them
// together and calls publishArticle().
//
// Article definition shape — see scripts/articles/ for examples:
//
// export default {
//   title:               'Article Title',
//   slug:                'article-slug',
//   excerpt:             '...',
//   publishedDate:       null,           // defaults to today (YYYY-MM-DD)
//   tags:                [],
//   estimatedReadingTime: 8,
//   seoTitle:            '...',
//   seoDescription:      '...',
//   categorySearch:      ['tech', 'ai'], // keywords matched against name/slug
//   categoryIdOverride:  '',             // bypass auto-detect
//   authorName:          'Ron Nelson',   // substring match
//   authorIdOverride:    '',
//   imgDir:              null,           // path to image folder (abs or repo-relative)
//   content:             [],             // see block types below
// };
//
// ── Block types ───────────────────────────────────────────────────────────
//
// paragraphBlock:
//   { type: 'paragraphBlock', heading, paragraphs }
//   heading   — section title (string, optional)
//   paragraphs — array of paragraph nodes:
//     - string                     → plain paragraph
//     - [{ text, bold?, italic?, code? }, ...] → mixed-mark paragraph
//
// codeBlock:
//   { type: 'codeBlock', caption, language, code }
//
// imageBlock:
//   { type: 'imageBlock', heading, imageName, imageTitle, imagePosition, paragraphs }
//   imageName — key into the imgDir (e.g. 'hero' → imgDir/hero.png)
//   imageTitle — Contentful asset title
//   imagePosition — 'left' | 'right'
//
// heroImage:
//   { type: 'heroImage', imageName, imageTitle }
//   Sets the blogPost featuredImage field. Not added to content[].
//
// blockQuote:
//   { type: 'blockQuote', quote, author }

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const REPO_ROOT = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!TOKEN || !SPACE) {
  throw new Error('Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID — check .env at repo root.');
}

const BASE_API = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;
const UPLOAD_API = `https://upload.contentful.com/spaces/${SPACE}`;

// ── Low-level CMA helpers ──────────────────────────────────────────────────

export async function cma(pathSuffix, opts = {}) {
  const res = await fetch(`${BASE_API}${pathSuffix}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(opts.body && !(opts.body instanceof Buffer)
        ? { 'Content-Type': 'application/vnd.contentful.management.v1+json' }
        : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${opts.method || 'GET'} ${pathSuffix} -> ${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export function linkTo(entry) {
  return { sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id } };
}

export function linkToAsset(asset) {
  return { sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } };
}

// ── Rich-text builders ─────────────────────────────────────────────────────

export function para(text, mark) {
  return {
    nodeType: 'paragraph',
    data: {},
    content: [{ nodeType: 'text', value: text, marks: mark ? [{ type: mark }] : [], data: {} }],
  };
}

export function paraMixed(segments) {
  return {
    nodeType: 'paragraph',
    data: {},
    content: segments.map(s => ({
      nodeType: 'text',
      value: s.text,
      marks: [
        ...(s.bold ? [{ type: 'bold' }] : []),
        ...(s.italic ? [{ type: 'italic' }] : []),
        ...(s.code ? [{ type: 'code' }] : []),
      ],
      data: {},
    })),
  };
}

export function doc(...nodes) {
  return { nodeType: 'document', data: {}, content: nodes };
}

// Convert a paragraphs array (from article definition) to a Contentful doc.
// Each item is either:
//   - string: plain paragraph
//   - [{ text, bold?, italic?, code? }, ...]: mixed-mark paragraph
function paragraphsToDoc(paragraphs) {
  const nodes = (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).map(p => {
    if (typeof p === 'string') return para(p);
    if (Array.isArray(p)) return paraMixed(p);
    throw new Error(`Unknown paragraph format: ${JSON.stringify(p)}`);
  });
  return doc(...nodes);
}

// ── Contentful entry/asset operations ─────────────────────────────────────

export async function createBlock(contentType, fields) {
  const entry = await cma('/entries', {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': contentType },
    body: JSON.stringify({ fields }),
  });
  const published = await cma(`/entries/${entry.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(entry.sys.version) },
  });
  console.log(`  ✓ ${contentType} (${published.sys.id})`);
  return published;
}

const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function uploadImage(imgDir, fileName, title) {
  const filePath = path.isAbsolute(imgDir)
    ? path.join(imgDir, fileName)
    : path.join(REPO_ROOT, imgDir, fileName);

  const ext = path.extname(fileName).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'image/jpeg';

  const fileBuffer = fs.readFileSync(filePath);
  console.log(`  Upload ${fileName}: ${fileBuffer.length} bytes`);

  const uploadRes = await fetch(`${UPLOAD_API}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/octet-stream' },
    body: fileBuffer,
  });
  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status}: ${(await uploadRes.text()).slice(0, 300)}`);
  }
  const upload = await uploadRes.json();

  let asset = await cma('/assets', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        title: { 'en-US': title },
        file: {
          'en-US': {
            contentType,
            fileName,
            uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
          },
        },
      },
    }),
  });

  await cma(`/assets/${asset.sys.id}/files/en-US/process`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(asset.sys.version) },
  });

  let processed = null;
  for (let i = 0; i < 15; i++) {
    await sleep(2000);
    processed = await cma(`/assets/${asset.sys.id}`);
    if (processed.fields.file?.['en-US']?.url) break;
    processed = null;
  }
  if (!processed) throw new Error(`Asset ${asset.sys.id} never finished processing.`);

  const published = await cma(`/assets/${asset.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(processed.sys.version) },
  });
  console.log(`  ✓ asset published: ${fileName} (${published.sys.id})`);
  return published;
}

// ── Lookups ────────────────────────────────────────────────────────────────

export async function findCategory(keywords = [], idOverride = '') {
  if (idOverride) return cma(`/entries/${idOverride}`);
  const data = await cma('/entries?content_type=category&limit=1000');
  const match = data.items.find(c => {
    const name = (c.fields.name?.['en-US'] || '').toLowerCase();
    const slug = (c.fields.slug?.['en-US'] || '').toLowerCase();
    return keywords.some(k => name.includes(k) || slug.includes(k));
  });
  if (match) {
    console.log(`  Category: "${match.fields.name['en-US']}" (${match.sys.id})`);
    return match;
  }
  console.log('Could not auto-detect category. Available:');
  data.items.forEach(c => console.log(`  ${c.sys.id} | ${c.fields.name?.['en-US']}`));
  throw new Error('Set categoryIdOverride in the article definition and re-run.');
}

export async function findAuthor(name = 'Ron Nelson', idOverride = '') {
  if (idOverride) return cma(`/entries/${idOverride}`);
  const data = await cma('/entries?content_type=author&limit=1000');
  const match = data.items.find(a =>
    JSON.stringify(a.fields).toLowerCase().includes(name.toLowerCase())
  ) || data.items[0];
  if (match) {
    console.log(`  Author: ${match.sys.id}`);
    return match;
  }
  throw new Error('No author found. Set authorIdOverride in the article definition and re-run.');
}

// ── Main publish orchestrator ──────────────────────────────────────────────

export async function publishArticle(def) {
  const {
    title,
    slug,
    excerpt,
    publishedDate = new Date().toISOString().slice(0, 10),
    tags = [],
    estimatedReadingTime = 5,
    seoTitle,
    seoDescription,
    categorySearch = [],
    categoryIdOverride = '',
    authorName = 'Ron Nelson',
    authorIdOverride = '',
    imgDir = null,
    content = [],
  } = def;

  console.log(`\nPublishing: "${title}"`);
  console.log('─'.repeat(50));

  const [category, author] = await Promise.all([
    findCategory(categorySearch, categoryIdOverride),
    findAuthor(authorName, authorIdOverride),
  ]);

  // Upload all images referenced in content blocks first
  const imageCache = {};
  const heroBlock = content.find(b => b.type === 'heroImage');
  const allImageBlocks = content.filter(b => b.type === 'imageBlock' || b.type === 'heroImage');

  if (allImageBlocks.length > 0 && !imgDir) {
    throw new Error('Article definition references images but imgDir is not set.');
  }

  if (allImageBlocks.length > 0) {
    console.log('\nUploading images...');
  }
  for (const block of allImageBlocks) {
    const key = block.imageName;
    if (!imageCache[key]) {
      imageCache[key] = await uploadImage(imgDir, `${key}.png`, block.imageTitle || key);
    }
  }

  // Create content blocks (skip heroImage — it's only for featuredImage)
  console.log('\nCreating content blocks...');
  const contentEntries = [];
  for (const block of content) {
    if (block.type === 'heroImage') continue;

    let entry;
    switch (block.type) {
      case 'paragraphBlock':
        entry = await createBlock('paragraphBlock', {
          ...(block.heading ? { heading: { 'en-US': block.heading } } : {}),
          richContent: { 'en-US': paragraphsToDoc(block.paragraphs) },
        });
        break;

      case 'codeBlock':
        entry = await createBlock('codeBlock', {
          caption: { 'en-US': block.caption },
          language: { 'en-US': block.language },
          code: { 'en-US': block.code },
        });
        break;

      case 'imageBlock': {
        const asset = imageCache[block.imageName];
        entry = await createBlock('imageContentBlock', {
          ...(block.heading ? { heading: { 'en-US': block.heading } } : {}),
          image: { 'en-US': linkToAsset(asset) },
          imagePosition: { 'en-US': block.imagePosition || 'right' },
          ...(block.paragraphs
            ? { richContent: { 'en-US': paragraphsToDoc(block.paragraphs) } }
            : {}),
        });
        break;
      }

      case 'blockQuote':
        entry = await createBlock('blockQuote', {
          quote: { 'en-US': block.quote },
          author: { 'en-US': block.author },
        });
        break;

      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
    contentEntries.push(linkTo(entry));
  }

  // Create the blogPost entry as a draft
  console.log('\nCreating blogPost entry (draft)...');
  const postFields = {
    title: { 'en-US': title },
    slug: { 'en-US': slug },
    excerpt: { 'en-US': excerpt },
    category: { 'en-US': linkTo(category) },
    author: { 'en-US': linkTo(author) },
    publishedDate: { 'en-US': publishedDate },
    content: { 'en-US': contentEntries },
    ...(tags.length ? { tags: { 'en-US': tags } } : {}),
    ...(estimatedReadingTime ? { estimatedReadingTime: { 'en-US': estimatedReadingTime } } : {}),
    ...(seoTitle ? { seoTitle: { 'en-US': seoTitle } } : {}),
    ...(seoDescription ? { seoDescription: { 'en-US': seoDescription } } : {}),
    ...(heroBlock && imageCache[heroBlock.imageName]
      ? { featuredImage: { 'en-US': linkToAsset(imageCache[heroBlock.imageName]) } }
      : {}),
  };

  const blogPost = await cma('/entries', {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': 'blogPost' },
    body: JSON.stringify({ fields: postFields }),
  });

  console.log('\n=== Draft blogPost created (NOT published) ===');
  console.log(`Entry ID:   ${blogPost.sys.id}`);
  console.log(`Review at:  https://app.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}/entries/${blogPost.sys.id}`);
  console.log('\nAll content blocks published. Publish the blogPost from Contentful UI once reviewed.');

  return blogPost;
}
