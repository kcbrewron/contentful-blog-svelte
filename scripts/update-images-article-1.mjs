// Replaces the pipeline + architecture diagram assets in place (same asset
// IDs), so the already-published blogPost entry picks up the new images
// with no entry edits needed.
//
// Run from the repo root:  node scripts/update-images-article-1.mjs

import contentful from 'contentful-management';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(REPO_ROOT, 'docs', 'blog-assets', 'dvmchart-part-1');

dotenv.config({ path: path.join(REPO_ROOT, '.env') });

async function findAssetByTitle(env, needle) {
  const { items } = await env.getAssets();
  const match = items.find(a =>
    (a.fields.title?.['en-US'] || '').toLowerCase().includes(needle.toLowerCase())
  );
  if (!match) {
    console.log(`Could not find an asset with title containing "${needle}". Existing assets:`);
    items.forEach(a => console.log(' -', a.sys.id, '|', a.fields.title?.['en-US']));
    throw new Error(`No asset match for "${needle}" — check titles above.`);
  }
  return match;
}

async function replaceAssetFile(env, asset, fileName) {
  const filePath = path.join(IMG_DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);

  const upload = await env.createUpload({ file: fileBuffer });

  let fresh = await env.getAsset(asset.sys.id);
  fresh.fields.file['en-US'] = {
    contentType: 'image/png',
    fileName,
    uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
  };
  let updated = await fresh.update();
  updated = await updated.processForAllLocales();

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      updated = await updated.publish();
      break;
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise(r => setTimeout(r, 2000));
      updated = await env.getAsset(asset.sys.id);
    }
  }
  console.log(`Replaced + republished asset ${asset.sys.id} with ${fileName}`);
  return updated;
}

async function main() {
  const client = contentful.createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN });
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);

  const pipelineAsset = await findAssetByTitle(env, 'audit pipeline');
  await replaceAssetFile(env, pipelineAsset, 'pipeline.png');

  const archAsset = await findAssetByTitle(env, 'three Workers');
  await replaceAssetFile(env, archAsset, 'architecture.png');

  console.log('\nDone. Both diagrams updated in place — refresh the live page (hard refresh / clear cache) to see the new versions.');
}

main().catch(e => {
  console.error('\nFAILED:', e.message || e);
  process.exit(1);
});
