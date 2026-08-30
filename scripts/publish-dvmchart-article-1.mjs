// One-shot publisher for "DVMChart Part 1: The Problem That Had to Protect
// Doctors From Day One" — creates content-block entries, uploads the three
// diagrams as assets, and creates the blogPost entry as a DRAFT (not
// published) so it can be reviewed in Contentful before going live.
//
// Run from the repo root:  node scripts/publish-dvmchart-article-1.mjs
//
// This must be run directly on your machine (not through the Cowork device
// bridge) — api.contentful.com isn't reachable from that sandbox.

import contentful from 'contentful-management';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(REPO_ROOT, 'docs', 'blog-assets', 'dvmchart-part-1');

// Load .env from the repo root explicitly, so this still works regardless of
// which directory you run `node` from (e.g. from inside scripts/).
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

// Leave blank to auto-detect; set manually if auto-detect can't find a match.
const CATEGORY_ID_OVERRIDE = '';
const AUTHOR_ID_OVERRIDE = '';

function para(text, mark) {
  return {
    nodeType: 'paragraph',
    data: {},
    content: [{ nodeType: 'text', value: text, marks: mark ? [{ type: mark }] : [], data: {} }],
  };
}

// segments: [{text, bold?}]
function paraMixed(segments) {
  return {
    nodeType: 'paragraph',
    data: {},
    content: segments.map(s => ({
      nodeType: 'text',
      value: s.text,
      marks: s.bold ? [{ type: 'bold' }] : [],
      data: {},
    })),
  };
}

function doc(...paragraphs) {
  return { nodeType: 'document', data: {}, content: paragraphs };
}

async function findCategory(env) {
  if (CATEGORY_ID_OVERRIDE) return env.getEntry(CATEGORY_ID_OVERRIDE);
  const { items } = await env.getEntries({ content_type: 'category' });
  const match = items.find(c => {
    const name = (c.fields.name?.['en-US'] || '').toLowerCase();
    const slug = (c.fields.slug?.['en-US'] || '').toLowerCase();
    return (name.includes('cloud') && name.includes('architecture')) || slug.includes('cloud');
  });
  if (match) {
    console.log(`Category: using "${match.fields.name['en-US']}" (${match.sys.id})`);
    return match;
  }
  console.log('Could not auto-detect a category. Existing categories:');
  items.forEach(c => console.log(' -', c.sys.id, '|', c.fields.name?.['en-US']));
  throw new Error('Set CATEGORY_ID_OVERRIDE at the top of this script and re-run.');
}

async function findAuthor(env) {
  if (AUTHOR_ID_OVERRIDE) return env.getEntry(AUTHOR_ID_OVERRIDE);
  const { items } = await env.getEntries({ content_type: 'author' });
  const match = items.find(a =>
    JSON.stringify(a.fields).toLowerCase().includes('ron nelson')
  ) || items[0];
  if (match) {
    console.log(`Author: using entry ${match.sys.id} (${JSON.stringify(match.fields).slice(0, 80)}...)`);
    return match;
  }
  console.log('Could not find any author entry. Existing authors:');
  items.forEach(a => console.log(' -', a.sys.id, '|', JSON.stringify(a.fields)));
  throw new Error('Set AUTHOR_ID_OVERRIDE at the top of this script and re-run.');
}

async function uploadImage(env, fileName, title) {
  const filePath = path.join(IMG_DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  let asset = await env.createAssetFromFiles({
    fields: {
      title: { 'en-US': title },
      file: { 'en-US': { contentType: 'image/png', fileName, file: fileBuffer } },
    },
  });
  asset = await asset.processForAllLocales();
  // Newly processed assets can take a moment before they're publishable.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      asset = await asset.publish();
      break;
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise(r => setTimeout(r, 2000));
      asset = await env.getAsset(asset.sys.id);
    }
  }
  console.log(`Uploaded + published asset: ${fileName} (${asset.sys.id})`);
  return asset;
}

async function createBlock(env, contentType, fields) {
  let entry = await env.createEntry(contentType, { fields });
  entry = await entry.publish();
  console.log(`Created + published ${contentType} (${entry.sys.id})`);
  return entry;
}

function linkTo(entry) {
  return { sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id } };
}
function linkToAsset(asset) {
  return { sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } };
}

async function main() {
  const client = contentful.createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN });
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);

  const category = await findCategory(env);
  const author = await findAuthor(env);

  const heroAsset = await uploadImage(env, 'hero.png', 'DVMChart — note vs. invoice');
  const pipelineAsset = await uploadImage(env, 'pipeline.png', 'The DVMChart audit pipeline');
  const archAsset = await uploadImage(env, 'architecture.png', 'DVMChart architecture — three Workers, one database');

  const introBlock = await createBlock(env, 'paragraphBlock', {
    heading: { 'en-US': 'The person who actually needed this' },
    richContent: {
      'en-US': doc(
        para(
          "This is Part 1 of a five-part series on building DVMChart, a veterinary billing-audit tool on Cloudflare Workers, Cloudflare AI, and Supabase. I'm writing it as a retrospective — the project got far enough to prove the technical approach worked, and then I shut it down before it ever reached a real clinic. That decision is the actual point of this series, and I'll get to it in Part 5. The first four parts are the honest build log: what I built, and why I built it the way I did.",
          'italic'
        ),
        para(
          "My wife runs day-to-day operations at a veterinary practice, and a meaningful part of her job is mentoring associate doctors — helping newer vets build good habits, catching problems early, doing it in a way that treats them like professionals and not like employees on a scoreboard. Every month or so, a version of the same conversation would come up: a doctor's numbers looked a little off, and nobody could say with any confidence whether that was a genuine miss or a deliberate, reasonable call the doctor made in the room. She had instinct and experience. She didn't have information. I wanted to build her some."
        )
      ),
    },
  });

  const pullQuote = await createBlock(env, 'blockQuote', {
    author: { 'en-US': 'Ron Nelson' },
    quote: { 'en-US': 'That distinction — genuine miss vs. deliberate call — turned out to be the entire product. Not the AI. Not the architecture. That one distinction.' },
  });

  const gapBlock = await createBlock(env, 'paragraphBlock', {
    heading: { 'en-US': 'What actually goes wrong between a chart and an invoice' },
    richContent: {
      'en-US': doc(
        para("Most practices now use AI-assisted charting — a doctor talks through a visit or types shorthand, and a tool turns it into a SOAP note. That's made charting faster. It hasn't closed the gap between what happened in the exam room and what makes it onto the invoice, because charting and billing are still two separate human steps, done at different times, sometimes by different people."),
        para("Some of that gap is nothing to worry about. A doctor comps a nail trim for a client who just paid for emergency surgery. That's a judgment call, made in the moment, for a good reason, and it should stay that way — a decision the doctor is trusted to make, not a defect to fix."),
        para("Some of it is a plain oversight. A medication gets administered and documented in the note, and in the rush of a busy day it never makes it onto the invoice. That's real revenue the clinic earned and never billed, and for doctors on production pay, it's also money they didn't get credit for delivering care they actually delivered."),
        para("Today, the only way to tell these apart is to manually re-read every chart against every invoice. Nobody has that kind of time, so it mostly doesn't happen, and the two categories sit there indistinguishable from each other.")
      ),
    },
  });

  const wrongToolBlock = await createBlock(env, 'paragraphBlock', {
    heading: { 'en-US': 'Why "just flag the differences" is the wrong tool' },
    richContent: {
      'en-US': doc(
        para("The tempting version of this project is simple: diff the note against the invoice, flag every gap, done. I didn't build that, on purpose, because that tool has an obvious failure mode — it can't tell a comped nail trim from a missed charge, so it either nags the doctor about decisions they made deliberately (and gets ignored or resented within a month) or it says nothing useful at all."),
        para("The interesting engineering problem, and the one this whole series is actually about, was building something that could tell the difference — and then designing the system, not just the model, so that telling the difference didn't turn into a doctor feeling watched. That second part shaped decisions all the way down into the database schema, which is where Part 2 of this series picks up.")
      ),
    },
  });

  const pipelineIntroBlock = await createBlock(env, 'paragraphBlock', {
    heading: { 'en-US': 'The pipeline, in plain terms' },
    richContent: {
      'en-US': doc(
        para('Every gap between a note and an invoice needs to land in exactly one of a small number of buckets, not get silently dropped or double-counted:'),
        paraMixed([{ text: 'Likely missed', bold: true }, { text: ' — mentioned in the note, absent from the invoice, no prior record of this doctor choosing to comp it.' }]),
        paraMixed([{ text: 'Judgment call', bold: true }, { text: ' — absent from the invoice, but matches something this specific doctor has explicitly marked as intentional before. Never treated as an error.' }]),
        paraMixed([{ text: 'Ambiguous', bold: true }, { text: " — the system wasn't confident enough in its own read of the note to say either way. Goes to a human, not to a guess." }]),
        para('Getting a raw visit note into one of those buckets is a four-stage pipeline:')
      ),
    },
  });

  const pipelineImageBlock = await createBlock(env, 'imageContentBlock', {
    heading: { 'en-US': 'The audit pipeline' },
    image: { 'en-US': linkToAsset(pipelineAsset) },
    imagePosition: { 'en-US': 'right' },
    richContent: {
      'en-US': doc(
        para("Each of those middle two stages turned out to be a real engineering problem, not a one-line prompt — real veterinary shorthand is dense, contextual, and full of things that sound like billable events but aren't (recheck instructions, home-care advice, steps bundled inside a named surgery). Part 3 of this series is entirely about that stage.")
      ),
    },
  });

  const archIntroBlock = await createBlock(env, 'paragraphBlock', {
    heading: { 'en-US': 'The architecture, at a glance' },
    richContent: {
      'en-US': doc(
        para('DVMChart is a monorepo with three independent Cloudflare Workers, a Postgres database on Supabase, and Cloudflare AI doing the model inference.')
      ),
    },
  });

  const archImageBlock = await createBlock(env, 'imageContentBlock', {
    heading: { 'en-US': 'Three Workers, one database' },
    image: { 'en-US': linkToAsset(archAsset) },
    imagePosition: { 'en-US': 'left' },
    richContent: {
      'en-US': doc(
        paraMixed([{ text: 'apps/ui', bold: true }, { text: ' — a SvelteKit app, deployed as a Cloudflare Worker, handling login and every doctor/owner-facing screen.' }]),
        paraMixed([{ text: 'apps/api', bold: true }, { text: ' — a Hono Worker that owns the data layer: import, matching, findings, reports. It never trusts the UI Worker blindly, even though they are both mine — it re-verifies every JWT itself.' }]),
        paraMixed([{ text: 'apps/pipeline', bold: true }, { text: ' — a plain Worker that does nothing but consume messages off a Cloudflare Queue and run the extract, match, classify sequence against Cloudflare AI.' }]),
        para("I started this on Cloudflare D1 — genuinely the right call for a single-developer prototype, cheap and fast to iterate on. I moved to Supabase early and deliberately, for reasons that had almost nothing to do with storage size: Supabase Auth and Postgres Row Level Security map cleanly onto a company to clinic to doctor hierarchy, which is exactly the tenant-isolation problem a tool like this has real client data riding on. pgvector came along as a second, welcome reason. Part 2 goes into that migration, and into the specific tradeoff I made — and explicitly did not finish — around Row Level Security."),
        para("Cloudflare stayed the obvious host for all three Workers: the AI binding gives every Worker direct, low-latency access to both the embedding model and the LLM without standing up a separate inference service. Part 4 covers what actually shipping three Workers together looks like.")
      ),
    },
  });

  const whatsNextBlock = await createBlock(env, 'paragraphBlock', {
    heading: { 'en-US': "What's next" },
    richContent: {
      'en-US': doc(
        para("Part 2 is about the database — specifically, how a schema built for a billing-audit tool ends up being a trust document as much as a data model. Every table in this system had to answer the same question before it answered any technical one: who is allowed to see this, and does that answer stay true as the product grows? That question turned out to matter more than I expected, and by the end of the series, it's the reason the project doesn't exist anymore.")
      ),
    },
  });

  const contentRefs = [
    introBlock, pullQuote, gapBlock, wrongToolBlock,
    pipelineIntroBlock, pipelineImageBlock,
    archIntroBlock, archImageBlock,
    whatsNextBlock,
  ].map(linkTo);

  const today = new Date().toISOString().slice(0, 10);

  const blogPost = await env.createEntry('blogPost', {
    fields: {
      title: { 'en-US': 'The Problem That Had to Protect Doctors From Day One' },
      slug: { 'en-US': 'dvmchart-part-1-the-problem' },
      excerpt: { 'en-US': "Part 1 of a five-part series on building — and ultimately shutting down — a veterinary billing-audit tool on Cloudflare Workers, Cloudflare AI, and Supabase. The origin story and the architecture." },
      category: { 'en-US': linkTo(category) },
      author: { 'en-US': linkTo(author) },
      publishedDate: { 'en-US': today },
      featuredImage: { 'en-US': linkToAsset(heroAsset) },
      content: { 'en-US': contentRefs },
      tags: { 'en-US': ['cloudflare-workers', 'cloudflare-ai', 'supabase', 'pgvector', 'architecture'] },
      estimatedReadingTime: { 'en-US': 8 },
      seoTitle: { 'en-US': 'DVMChart Part 1: The Problem — Cloudflare + Supabase' },
      seoDescription: { 'en-US': 'Building a veterinary billing-audit tool on Cloudflare Workers, Cloudflare AI, and Supabase — the origin story and architecture overview.' },
    },
  });

  console.log('\n=== Draft blogPost created (NOT published) ===');
  console.log(`Entry ID: ${blogPost.sys.id}`);
  console.log(`Review it here: https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries/${blogPost.sys.id}`);
  console.log('\nAll content blocks and images are published; only the blogPost entry itself is a draft. Publish it from the Contentful UI (or re-run with .publish()) once you\'ve reviewed it.');
}

main().catch(e => {
  console.error('\nFAILED:', e.message || e);
  process.exit(1);
});
