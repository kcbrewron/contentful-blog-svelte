// Replaces the pipeline + architecture diagram assets in place (same asset
// IDs), so the already-published blogPost entry picks up the new images
// with no entry edits needed.
//
// Run from the repo root:  node scripts/update-images-article-1.mjs
//
// v3: talks to the Contentful Content Management REST API directly via
// fetch() instead of the contentful-management SDK, to sidestep the
// ESM/CJS interop issues that SDK was hitting in this environment. Prints
// verification at every step.

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(REPO_ROOT, 'docs', 'blog-assets', 'dvmchart-part-1');

dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!TOKEN || !SPACE) {
  throw new Error('Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID — check .env at repo root.');
}

const API = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;
const UPLOAD_API = `https://upload.contentful.com/spaces/${SPACE}`;

async function cma(pathSuffix, opts = {}) {
  const res = await fetch(`${API}${pathSuffix}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(opts.body && !(opts.body instanceof Buffer) ? { 'Content-Type': 'application/vnd.contentful.management.v1+json' } : {}),
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

// Title matching turned out to be unsafe — there are duplicate assets in
// this space with identical titles (leftovers from the original publish
// run). These IDs were pulled directly off the live page's rendered <img>
// src, so they're guaranteed to be the ones the blogPost entry actually
// references, regardless of how many same-titled duplicates exist.
const KNOWN_ASSET_IDS = {
  'audit pipeline': '3TJ43arv3nFob26nmsLMUi',
  'three Workers': '7AtPFjXisvwA49mTFroC2d',
};

async function findAssetByTitle(needle) {
  const knownId = KNOWN_ASSET_IDS[needle];
  if (knownId) {
    const asset = await cma(`/assets/${knownId}`);
    console.log(`Using known asset for "${needle}": ${asset.sys.id} (v${asset.sys.version}) — "${asset.fields?.title?.['en-US']}"`);
    return asset;
  }
  const data = await cma('/assets?limit=1000');
  const matches = data.items.filter(a =>
    (a.fields?.title?.['en-US'] || '').toLowerCase().includes(needle.toLowerCase())
  );
  if (matches.length === 0) {
    console.log(`Could not find an asset with title containing "${needle}". Existing assets:`);
    data.items.forEach(a => console.log(' -', a.sys.id, '|', a.fields?.title?.['en-US']));
    throw new Error(`No asset match for "${needle}".`);
  }
  if (matches.length > 1) {
    console.log(`WARNING: ${matches.length} assets match "${needle}" — using the first:`);
    matches.forEach(a => console.log('   -', a.sys.id, '|', a.fields?.title?.['en-US']));
  }
  console.log(`Found asset for "${needle}": ${matches[0].sys.id} (v${matches[0].sys.version})`);
  return matches[0];
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function replaceAssetFile(asset, fileName) {
  const filePath = path.join(IMG_DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  console.log(`Read ${fileName}: ${fileBuffer.length} bytes`);

  // 1. Create an Upload (binary body, separate upload.contentful.com host).
  const uploadRes = await fetch(`${UPLOAD_API}/uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/octet-stream',
    },
    body: fileBuffer,
  });
  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status} ${uploadRes.statusText}: ${(await uploadRes.text()).slice(0, 300)}`);
  }
  const upload = await uploadRes.json();
  console.log(`Created upload: ${upload.sys.id}`);

  // 2. Re-fetch the asset for a fresh version number, then PATCH the file field.
  let current = await cma(`/assets/${asset.sys.id}`);
  current.fields.file = current.fields.file || {};
  current.fields.file['en-US'] = {
    contentType: 'image/png',
    fileName,
    uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
  };
  const updated = await cma(`/assets/${asset.sys.id}`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(current.sys.version) },
    body: JSON.stringify({ fields: current.fields }),
  });
  console.log(`Updated asset field (now v${updated.sys.version}), processing...`);

  // 3. Kick off processing.
  await cma(`/assets/${asset.sys.id}/files/en-US/process`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(updated.sys.version) },
  });

  // 4. Poll until the file has a real URL (processing finished).
  let processed;
  for (let attempt = 0; attempt < 15; attempt++) {
    await sleep(2000);
    processed = await cma(`/assets/${asset.sys.id}`);
    const url = processed.fields.file?.['en-US']?.url;
    if (url) {
      console.log(`Processed after ~${(attempt + 1) * 2}s. File path: ...${url.slice(-70)}`);
      break;
    }
    processed = null;
  }
  if (!processed) throw new Error(`Asset ${asset.sys.id} never finished processing (no file URL after 30s).`);

  // 5. Publish at the latest version.
  const published = await cma(`/assets/${asset.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(processed.sys.version) },
  });
  console.log(`Published v${published.sys.publishedVersion}.`);

  // 6. Verify by re-fetching fresh.
  const verify = await cma(`/assets/${asset.sys.id}`);
  const verifyUrl = verify.fields.file?.['en-US']?.url || '';
  console.log(`VERIFIED live asset ${asset.sys.id}: published v${verify.sys.publishedVersion}, file path ...${verifyUrl.slice(-70)}`);
  return verify;
}

async function main() {
  console.log('=== Pipeline image ===');
  const pipelineAsset = await findAssetByTitle('audit pipeline');
  await replaceAssetFile(pipelineAsset, 'pipeline.png');

  console.log('\n=== Architecture image ===');
  const archAsset = await findAssetByTitle('three Workers');
  await replaceAssetFile(archAsset, 'architecture.png');

  console.log('\nDone. Both diagrams updated and verified live. Hard-refresh the page to see them.');
}

main().catch(e => {
  console.error('\nFAILED:', e.message || e);
  process.exit(1);
});