// One-shot publisher for "DVMChart Part 2: Auth, Tenancy, and the Schema as
// a Trust Document" — creates content-block entries, uploads the three
// diagrams as assets, and creates the blogPost entry as a DRAFT (not
// published) so it can be reviewed in Contentful before going live.
//
// Run from the repo root:  node scripts/publish-dvmchart-article-2.mjs
//
// This must be run directly on your machine (not through the Cowork device
// bridge) — api.contentful.com isn't reachable from that sandbox.
//
// Uses raw fetch() against the Content Management REST API directly rather
// than the contentful-management SDK — the SDK hit ESM/CJS interop issues
// in a different terminal session when we used it for the Part 1 image
// update, so this script sidesteps that entirely, same as
// update-images-article-1.mjs.

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(REPO_ROOT, 'docs', 'blog-assets', 'dvmchart-part-2');

dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!TOKEN || !SPACE) {
  throw new Error('Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID — check .env at repo root.');
}

const API = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;
const UPLOAD_API = `https://upload.contentful.com/spaces/${SPACE}`;

// Leave blank to auto-detect; set manually if auto-detect can't find a match.
const CATEGORY_ID_OVERRIDE = '';
const AUTHOR_ID_OVERRIDE = '';

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

function linkTo(entry) {
  return { sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id } };
}
function linkToAsset(asset) {
  return { sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } };
}

async function findCategory() {
  if (CATEGORY_ID_OVERRIDE) return cma(`/entries/${CATEGORY_ID_OVERRIDE}`);
  const data = await cma('/entries?content_type=category&limit=1000');
  const match = data.items.find(c => {
    const name = (c.fields.name?.['en-US'] || '').toLowerCase();
    const slug = (c.fields.slug?.['en-US'] || '').toLowerCase();
    return (name.includes('cloud') && name.includes('architecture')) || slug.includes('cloud');
  });
  if (match) {
    console.log(`Category: using "${match.fields.name['en-US']}" (${match.sys.id})`);
    return match;
  }
  console.log('Could not auto-detect a category. Existing categories:');
  data.items.forEach(c => console.log(' -', c.sys.id, '|', c.fields.name?.['en-US']));
  throw new Error('Set CATEGORY_ID_OVERRIDE at the top of this script and re-run.');
}

async function findAuthor() {
  if (AUTHOR_ID_OVERRIDE) return cma(`/entries/${AUTHOR_ID_OVERRIDE}`);
  const data = await cma('/entries?content_type=author&limit=1000');
  const match = data.items.find(a =>
    JSON.stringify(a.fields).toLowerCase().includes('ron nelson')
  ) || data.items[0];
  if (match) {
    console.log(`Author: using entry ${match.sys.id} (${JSON.stringify(match.fields).slice(0, 80)}...)`);
    return match;
  }
  console.log('Could not find any author entry. Existing authors:');
  data.items.forEach(a => console.log(' -', a.sys.id, '|', JSON.stringify(a.fields)));
  throw new Error('Set AUTHOR_ID_OVERRIDE at the top of this script and re-run.');
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function uploadImage(fileName, title) {
  const filePath = path.join(IMG_DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  console.log(`Read ${fileName}: ${fileBuffer.length} bytes`);

  const uploadRes = await fetch(`${UPLOAD_API}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/octet-stream' },
    body: fileBuffer,
  });
  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status} ${uploadRes.statusText}: ${(await uploadRes.text()).slice(0, 300)}`);
  }
  const upload = await uploadRes.json();
  console.log(`Created upload: ${upload.sys.id}`);

  let asset = await cma('/assets', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        title: { 'en-US': title },
        file: {
          'en-US': {
            contentType: 'image/png',
            fileName,
            uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
          },
        },
      },
    }),
  });
  console.log(`Created asset ${asset.sys.id} (v${asset.sys.version}), processing...`);

  await cma(`/assets/${asset.sys.id}/files/en-US/process`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(asset.sys.version) },
  });

  let processed;
  for (let attempt = 0; attempt < 15; attempt++) {
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
  console.log(`Published asset ${fileName} (${published.sys.id}, v${published.sys.publishedVersion})`);
  return published;
}

async function createBlock(contentType, fields) {
  let entry = await cma(`/entries`, {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': contentType },
    body: JSON.stringify({ fields }),
  });
  const published = await cma(`/entries/${entry.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(entry.sys.version) },
  });
  console.log(`Created + published ${contentType} (${published.sys.id})`);
  return published;
}

async function main() {
  const category = await findCategory();
  const author = await findAuthor();

  const heroAsset = await uploadImage('hero.png', 'DVMChart Part 2 — company, clinic, doctor, verified twice');
  const tenancyAsset = await uploadImage('tenancy.png', 'DVMChart tenancy hierarchy — company, clinic, doctor');
  const jwtAsset = await uploadImage('jwt-trust.png', 'DVMChart — same JWT, verified twice by two independent Workers');

  const introBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'Where this picks up' },
    richContent: {
      'en-US': doc(
        para(
          "This is Part 2 of a five-part series on building DVMChart, a veterinary billing-audit tool on Cloudflare Workers, Cloudflare AI, and Supabase. Part 1 covered the origin story and the high-level architecture. This part is about the database — and about a thing I didn't fully appreciate until I was deep into building it: for a tool like this, the schema isn't just a data model. It's where you decide, in advance and in writing, who is allowed to see what. Get that wrong and no amount of good UI copy fixes it later.",
          'italic'
        )
      ),
    },
  });

  const hierarchyImageBlock = await createBlock('imageContentBlock', {
    heading: { 'en-US': 'The hierarchy the whole system hangs off' },
    image: { 'en-US': linkToAsset(tenancyAsset) },
    imagePosition: { 'en-US': 'right' },
    richContent: {
      'en-US': doc(
        para("Every table that matters in DVMChart scopes back to one of three things: a company, a clinic, or a doctor. companies, clinics, and doctors are the tenancy roots. Almost every other table — visits, visit_notes, invoices, extracted_items, audit_findings, doctor_patterns — carries a clinic_id or doctor_id that traces back to one of these."),
        para("That sounds like an unremarkable data-modeling choice. It isn't, once you notice what it's actually for: every one of those foreign keys is a boundary. It's the line between “this doctor's own findings” and “every doctor's findings,” and that line has to hold at the database level, not just wherever the UI happens to remember to filter.")
      ),
    },
  });

  const ulidCodeBlock = await createBlock('codeBlock', {
    caption: { 'en-US': 'clinics table — ULID primary key, not autoincrement' },
    language: { 'en-US': 'sql' },
    code: {
      'en-US': `CREATE TABLE clinics (
  id TEXT PRIMARY KEY,           -- ULID, not autoincrement
  company_id TEXT NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  pims_type TEXT NOT NULL,       -- 'covetrus_pulse', 'ezyvet', 'cornerstone', etc.
  timezone TEXT NOT NULL DEFAULT 'UTC'
);`,
    },
  });

  const ulidParaBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'Why ULIDs' },
    richContent: {
      'en-US': doc(
        para("One small decision here paid for itself immediately: every primary key is a ULID, not an autoincrementing integer. Autoincrement IDs are fine right up until data from two different environments needs to merge — a prototype's data moving to production, or a second clinic being onboarded onto infrastructure that already has a clinic with id = 1. ULIDs cost nothing on day one and quietly prevent a very specific, very annoying migration headache later. I made this call before I'd written a single row of real data, on the general principle that multi-tenant systems tend to eventually need to merge datasets that were never designed to coexist.")
      ),
    },
  });

  const jwtImageBlock = await createBlock('imageContentBlock', {
    heading: { 'en-US': 'Two workers, two independent checks on the same JWT' },
    image: { 'en-US': linkToAsset(jwtAsset) },
    imagePosition: { 'en-US': 'left' },
    richContent: {
      'en-US': doc(
        para("Supabase Auth issues the session. What each Worker does with it is where the actual trust boundary lives. The SvelteKit UI Worker handles login and holds the session — via @supabase/ssr, it stores the Supabase session and attaches the access token to every request it forwards to the API. That's normal enough. The part I think is worth calling out is what the Hono API Worker does with that token, because it does not do the easy thing:")
      ),
    },
  });

  const jwtCodeBlock = await createBlock('codeBlock', {
    caption: { 'en-US': 'apps/api/src/middleware/auth.ts — verifyJwt' },
    language: { 'en-US': 'typescript' },
    code: {
      'en-US': `// apps/api/src/middleware/auth.ts
async function verifyJwt(token: string, supabaseUrl: string) {
  const [headerB64, payloadB64, sigB64] = token.split('.')
  const header = JSON.parse(atob(headerB64...))
  if (header.alg !== 'ES256') throw new Error(\`Unsupported algorithm: \${header.alg}\`)

  const keys = await getJwks(supabaseUrl)   // cached 1hr, module-scope
  // ... verify signature with crypto.subtle against Supabase's JWKS public keys
}`,
    },
  });

  const jwtClosingBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'Trust, but verify anyway' },
    richContent: {
      'en-US': doc(
        para("The API Worker doesn't import supabase-js and doesn't lean on the UI Worker's say-so, even though they're both mine, even though they talk to each other over a private service binding, not the open internet. It fetches Supabase's public JWKS, caches it for an hour, and verifies the ES256 signature itself using the Workers runtime's native Web Crypto API — no library in between. If the UI Worker were ever compromised, or if a future third client tried to call the API directly, the API still independently checks that the token is real, unexpired, and signed by Supabase before it trusts a single claim inside it."),
        para("This is more code than “if (session) { ok }”. I wrote it anyway because the alternative is an API that's only as trustworthy as whatever called it last — and “trust the caller” is exactly the assumption that turns into a real incident eventually, in a system that's specifically supposed to be trustworthy.")
      ),
    },
  });

  const tradeoffBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': "The decision I made on purpose — and didn't finish on purpose" },
    richContent: {
      'en-US': doc(
        para("Once the JWT is verified, there's still the question of how company_id and clinic_id scoping actually gets enforced on every query. There are two real ways to do this, and I want to be specific about both, because pretending there's only one “right” answer here would be dishonest about the tradeoff:"),
        paraMixed([{ text: 'App-layer scoping.', bold: true }, { text: " Hono middleware pulls company_id / clinic_id / role out of the JWT's custom claims and injects them into every query the API builds. Fast to build. The failure mode is exactly what it sounds like: one query somewhere that forgets a WHERE clinic_id = ? is a silent cross-tenant data leak, and the database itself has no idea anything went wrong." }]),
        paraMixed([{ text: 'Row Level Security.', bold: true }, { text: " Supabase supports a Custom Access Token Hook that embeds company_id and role directly into the JWT, and from there you write Postgres RLS policies on every table keyed to those claims. Since the API talks to Postgres directly through Hyperdrive rather than through Supabase's PostgREST layer, this means running SET LOCAL app.company_id = '...' at the top of each request or transaction and writing policies that reference current_setting('app.company_id'). More setup. The payoff is that the database enforces isolation even if the application code has a bug — which is the property you actually want once real client data is on the line." }]),
        para("DVMChart shipped with app-layer scoping only. I want to be direct about why, instead of dressing it up as more deliberate than it was: at prototype stage, with one developer and no real client data yet, RLS is meaningfully more infrastructure than the risk justifies in week one. But I wrote the tradeoff down in the architecture doc at the time, in plain language, with an explicit line I held myself to: acceptable for a single-developer prototype, not acceptable once real client data or a second engineer is involved. That sentence existed before a single real clinic's data ever touched this system. Whether I would have actually gone back and built RLS before the first real pilot is a question the project never got far enough to answer for real — which is its own kind of honest data point about how these tradeoffs actually get resolved under real deadlines, not just how they get written down.")
      ),
    },
  });

  const supabaseWhyBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'Why Supabase, mechanically' },
    richContent: {
      'en-US': doc(
        para("Part 1 mentioned the move off Cloudflare D1 to Supabase; here's the part that made it a same-week decision rather than a debate. D1 is SQLite, and SQLite has no RLS equivalent — on D1, the application layer isn't a layer of enforcement, it's the only one. Supabase Auth and Postgres RLS map directly onto the company → clinic → doctor hierarchy this system already needed, which meant the migration wasn't really about picking a bigger database. It was about picking one that could eventually enforce the thing the architecture doc already said mattered."),
        para("pgvector came along as a second, independent reason — needed for the fee-schedule matching step covered in Part 3 — but it was the tenant-isolation story that actually moved the decision."),
        para("The migration itself stayed boring, in the good sense, because of one habit kept from day one: every schema change lived in a versioned .sql file from the start, the same discipline D1 supports natively through Wrangler migrations. Moving to Supabase turned into a data-copy exercise against an already-known schema, not a reconstruction project. That's not a clever technique — it's just not skipping the boring thing under deadline pressure, which is usually where discipline like this actually gets tested.")
      ),
    },
  });

  const rulesBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'The rules that live outside the schema, but only work because of it' },
    richContent: {
      'en-US': doc(
        para("Here's where the trust framing stops being abstract. Alongside the schema, this codebase has a file — .claude/SKILLS/SKILL.md, loaded automatically any time code touching findings, reports, or roles gets written — that spells out rules like these, verbatim:"),
        para("A doctor sees only their own findings, their own reports, their own doctor_patterns. Never a cross-doctor comparison, never a ranking. An owner or manager sees clinic-level aggregate totals only — never individual judgment-call detail, never a per-doctor breakdown. A judgment_call finding never surfaces to any non-doctor role, in any form — not in a report, not in an aggregate count, not in an anonymized rollup."),
        para("And the line underneath all of them: these are access-control rules, and they must be enforced at the query level, not just hidden in the UI."),
        para("That last sentence only means anything because of everything earlier in this post. clinic_id and doctor_id on every relevant row, JWT claims independently re-verified by the service that actually runs the query, a documented (if not fully finished) plan for the database itself to enforce isolation — those are the mechanisms that make “enforce it at the query level” something more than a good intention in a markdown file. A rule like “owners never see per-doctor detail” is trivial to violate by accident with one convenient JOIN if nothing beneath it makes that hard to do. The schema is what turns a policy into a constraint.")
      ),
    },
  });

  const pullQuote = await createBlock('blockQuote', {
    author: { 'en-US': 'Ron Nelson' },
    quote: { 'en-US': 'The schema is what turns a policy into a constraint.' },
  });

  const whatsNextBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': "What's next" },
    richContent: {
      'en-US': doc(
        para("Part 3 is where the actual AI engineering starts: turning a messy, shorthand-heavy SOAP note into structured, billable line items, and matching those against a clinic's fee schedule using embeddings and pgvector. It's a different kind of hard problem than this post — less about who's allowed to see what, more about getting a language model to read the way a veterinary technician writes. But it inherits everything from this post: extraction only matters because the buckets it feeds into were already built to be trustworthy.")
      ),
    },
  });

  const contentRefs = [
    introBlock,
    hierarchyImageBlock, ulidCodeBlock, ulidParaBlock,
    jwtImageBlock, jwtCodeBlock, jwtClosingBlock,
    tradeoffBlock,
    supabaseWhyBlock,
    rulesBlock, pullQuote,
    whatsNextBlock,
  ].map(linkTo);

  const today = new Date().toISOString().slice(0, 10);

  const blogPost = await cma('/entries', {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': 'blogPost' },
    body: JSON.stringify({
      fields: {
        title: { 'en-US': 'Auth, Tenancy, and the Schema as a Trust Document' },
        slug: { 'en-US': 'dvmchart-part-2-auth-tenancy-trust' },
        excerpt: { 'en-US': "Part 2 of a five-part series on building DVMChart: the company/clinic/doctor tenancy hierarchy, dual independent JWT verification between two Cloudflare Workers, and the app-layer-vs-RLS tradeoff the project made and didn't finish." },
        category: { 'en-US': linkTo(category) },
        author: { 'en-US': linkTo(author) },
        publishedDate: { 'en-US': today },
        featuredImage: { 'en-US': linkToAsset(heroAsset) },
        content: { 'en-US': contentRefs },
        tags: { 'en-US': ['cloudflare-workers', 'supabase', 'auth', 'multi-tenancy', 'architecture'] },
        estimatedReadingTime: { 'en-US': 9 },
        seoTitle: { 'en-US': 'DVMChart Part 2: Auth, Tenancy, and Trust — Supabase + Cloudflare' },
        seoDescription: { 'en-US': 'How a veterinary billing-audit tool on Cloudflare Workers and Supabase designed its schema and auth as a trust boundary, not just a data model.' },
      },
    }),
  });

  console.log('\n=== Draft blogPost created (NOT published) ===');
  console.log(`Entry ID: ${blogPost.sys.id}`);
  console.log(`Review it here: https://app.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}/entries/${blogPost.sys.id}`);
  console.log('\nAll content blocks and images are published; only the blogPost entry itself is a draft. Publish it from the Contentful UI (or extend this script) once you\'ve reviewed it.');
}

main().catch(e => {
  console.error('\nFAILED:', e.message || e);
  process.exit(1);
});
