// Article: DVMChart Part 2 — "Auth, Tenancy, and the Schema as a Trust Document"
// Series: DVMChart (5-part series on building a vet billing-audit tool)
//
// STATUS: Already published via scripts/publish-dvmchart-article-2.mjs
//         This file is the canonical definition-format version for reference.
//         DO NOT re-publish — it will create duplicate entries.
//
// Publish (only if starting fresh):
//   node scripts/publish-article.mjs scripts/articles/dvmchart-part-2.mjs

/** @type {import('../lib/contentful-publisher.js').ArticleDef} */
export default {
  title: 'Auth, Tenancy, and the Schema as a Trust Document',
  slug: 'dvmchart-part-2-auth-tenancy-trust',
  excerpt:
    "Part 2 of a five-part series on building DVMChart: the company/clinic/doctor tenancy hierarchy, dual independent JWT verification between two Cloudflare Workers, and the app-layer-vs-RLS tradeoff the project made and didn't finish.",
  tags: ['cloudflare-workers', 'supabase', 'auth', 'multi-tenancy', 'architecture'],
  estimatedReadingTime: 9,
  seoTitle: 'DVMChart Part 2: Auth, Tenancy, and Trust — Supabase + Cloudflare',
  seoDescription:
    'How a veterinary billing-audit tool on Cloudflare Workers and Supabase designed its schema and auth as a trust boundary, not just a data model.',
  categorySearch: ['cloud', 'architecture'],
  authorName: 'Ron Nelson',
  imgDir: 'docs/blog-assets/dvmchart-part-2',
  content: [
    { type: 'heroImage', imageName: 'hero', imageTitle: 'DVMChart Part 2 — company, clinic, doctor, verified twice' },
    {
      type: 'paragraphBlock',
      heading: 'Where this picks up',
      paragraphs: [
        "This is Part 2 of a five-part series on building DVMChart, a veterinary billing-audit tool on Cloudflare Workers, Cloudflare AI, and Supabase. Part 1 covered the origin story and the high-level architecture. This part is about the database — and about a thing I didn't fully appreciate until I was deep into building it: for a tool like this, the schema isn't just a data model. It's where you decide, in advance and in writing, who is allowed to see what. Get that wrong and no amount of good UI copy fixes it later.",
      ],
    },
    {
      type: 'imageBlock',
      heading: 'The hierarchy the whole system hangs off',
      imageName: 'tenancy',
      imageTitle: 'DVMChart tenancy hierarchy — company, clinic, doctor',
      imagePosition: 'right',
      paragraphs: [
        "Every table that matters in DVMChart scopes back to one of three things: a company, a clinic, or a doctor. companies, clinics, and doctors are the tenancy roots. Almost every other table — visits, visit_notes, invoices, extracted_items, audit_findings, doctor_patterns — carries a clinic_id or doctor_id that traces back to one of these.",
        "That sounds like an unremarkable data-modeling choice. It isn't, once you notice what it's actually for: every one of those foreign keys is a boundary. It's the line between \"this doctor's own findings\" and \"every doctor's findings,\" and that line has to hold at the database level, not just wherever the UI happens to remember to filter.",
      ],
    },
    {
      type: 'codeBlock',
      caption: 'clinics table — ULID primary key, not autoincrement',
      language: 'sql',
      code: `CREATE TABLE clinics (
  id TEXT PRIMARY KEY,           -- ULID, not autoincrement
  company_id TEXT NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  pims_type TEXT NOT NULL,       -- 'covetrus_pulse', 'ezyvet', 'cornerstone', etc.
  timezone TEXT NOT NULL DEFAULT 'UTC'
);`,
    },
    {
      type: 'paragraphBlock',
      heading: 'Why ULIDs',
      paragraphs: [
        "One small decision here paid for itself immediately: every primary key is a ULID, not an autoincrementing integer. Autoincrement IDs are fine right up until data from two different environments needs to merge — a prototype's data moving to production, or a second clinic being onboarded onto infrastructure that already has a clinic with id = 1. ULIDs cost nothing on day one and quietly prevent a very specific, very annoying migration headache later. I made this call before I'd written a single row of real data, on the general principle that multi-tenant systems tend to eventually need to merge datasets that were never designed to coexist.",
      ],
    },
    {
      type: 'imageBlock',
      heading: 'Two workers, two independent checks on the same JWT',
      imageName: 'jwt-trust',
      imageTitle: 'DVMChart — same JWT, verified twice by two independent Workers',
      imagePosition: 'left',
      paragraphs: [
        "Supabase Auth issues the session. What each Worker does with it is where the actual trust boundary lives. The SvelteKit UI Worker handles login and holds the session — via @supabase/ssr, it stores the Supabase session and attaches the access token to every request it forwards to the API. That's normal enough. The part I think is worth calling out is what the Hono API Worker does with that token, because it does not do the easy thing:",
      ],
    },
    {
      type: 'codeBlock',
      caption: 'apps/api/src/middleware/auth.ts — verifyJwt',
      language: 'typescript',
      code: `// apps/api/src/middleware/auth.ts
async function verifyJwt(token: string, supabaseUrl: string) {
  const [headerB64, payloadB64, sigB64] = token.split('.')
  const header = JSON.parse(atob(headerB64...))
  if (header.alg !== 'ES256') throw new Error(\`Unsupported algorithm: \${header.alg}\`)

  const keys = await getJwks(supabaseUrl)   // cached 1hr, module-scope
  // ... verify signature with crypto.subtle against Supabase's JWKS public keys
}`,
    },
    {
      type: 'paragraphBlock',
      heading: 'Trust, but verify anyway',
      paragraphs: [
        "The API Worker doesn't import supabase-js and doesn't lean on the UI Worker's say-so, even though they're both mine, even though they talk to each other over a private service binding, not the open internet. It fetches Supabase's public JWKS, caches it for an hour, and verifies the ES256 signature itself using the Workers runtime's native Web Crypto API — no library in between. If the UI Worker were ever compromised, or if a future third client tried to call the API directly, the API still independently checks that the token is real, unexpired, and signed by Supabase before it trusts a single claim inside it.",
        "This is more code than \"if (session) { ok }\". I wrote it anyway because the alternative is an API that's only as trustworthy as whatever called it last — and \"trust the caller\" is exactly the assumption that turns into a real incident eventually, in a system that's specifically supposed to be trustworthy.",
      ],
    },
    {
      type: 'paragraphBlock',
      heading: "The decision I made on purpose — and didn't finish on purpose",
      paragraphs: [
        "Once the JWT is verified, there's still the question of how company_id and clinic_id scoping actually gets enforced on every query. There are two real ways to do this, and I want to be specific about both, because pretending there's only one \"right\" answer here would be dishonest about the tradeoff:",
        [
          { text: 'App-layer scoping. ', bold: true },
          { text: "Hono middleware pulls company_id / clinic_id / role out of the JWT's custom claims and injects them into every query the API builds. Fast to build. The failure mode is exactly what it sounds like: one query somewhere that forgets a WHERE clinic_id = ? is a silent cross-tenant data leak, and the database itself has no idea anything went wrong." },
        ],
        [
          { text: 'Row Level Security. ', bold: true },
          { text: "Supabase supports a Custom Access Token Hook that embeds company_id and role directly into the JWT, and from there you write Postgres RLS policies on every table keyed to those claims. Since the API talks to Postgres directly through Hyperdrive rather than through Supabase's PostgREST layer, this means running SET LOCAL app.company_id = '...' at the top of each request or transaction and writing policies that reference current_setting('app.company_id'). More setup. The payoff is that the database enforces isolation even if the application code has a bug — which is the property you actually want once real client data is on the line." },
        ],
        "DVMChart shipped with app-layer scoping only. I want to be direct about why, instead of dressing it up as more deliberate than it was: at prototype stage, with one developer and no real client data yet, RLS is meaningfully more infrastructure than the risk justifies in week one. But I wrote the tradeoff down in the architecture doc at the time, in plain language, with an explicit line I held myself to: acceptable for a single-developer prototype, not acceptable once real client data or a second engineer is involved. That sentence existed before a single real clinic's data ever touched this system. Whether I would have actually gone back and built RLS before the first real pilot is a question the project never got far enough to answer for real — which is its own kind of honest data point about how these tradeoffs actually get resolved under real deadlines, not just how they get written down.",
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'Why Supabase, mechanically',
      paragraphs: [
        "Part 1 mentioned the move off Cloudflare D1 to Supabase; here's the part that made it a same-week decision rather than a debate. D1 is SQLite, and SQLite has no RLS equivalent — on D1, the application layer isn't a layer of enforcement, it's the only one. Supabase Auth and Postgres RLS map directly onto the company → clinic → doctor hierarchy this system already needed, which meant the migration wasn't really about picking a bigger database. It was about picking one that could eventually enforce the thing the architecture doc already said mattered.",
        "pgvector came along as a second, independent reason — needed for the fee-schedule matching step covered in Part 3 — but it was the tenant-isolation story that actually moved the decision.",
        "The migration itself stayed boring, in the good sense, because of one habit kept from day one: every schema change lived in a versioned .sql file from the start, the same discipline D1 supports natively through Wrangler migrations. Moving to Supabase turned into a data-copy exercise against an already-known schema, not a reconstruction project. That's not a clever technique — it's just not skipping the boring thing under deadline pressure, which is usually where discipline like this actually gets tested.",
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'The rules that live outside the schema, but only work because of it',
      paragraphs: [
        "Here's where the trust framing stops being abstract. Alongside the schema, this codebase has a file — .claude/SKILLS/SKILL.md, loaded automatically any time code touching findings, reports, or roles gets written — that spells out rules like these, verbatim:",
        "A doctor sees only their own findings, their own reports, their own doctor_patterns. Never a cross-doctor comparison, never a ranking. An owner or manager sees clinic-level aggregate totals only — never individual judgment-call detail, never a per-doctor breakdown. A judgment_call finding never surfaces to any non-doctor role, in any form — not in a report, not in an aggregate count, not in an anonymized rollup.",
        "And the line underneath all of them: these are access-control rules, and they must be enforced at the query level, not just hidden in the UI.",
        "That last sentence only means anything because of everything earlier in this post. clinic_id and doctor_id on every relevant row, JWT claims independently re-verified by the service that actually runs the query, a documented (if not fully finished) plan for the database itself to enforce isolation — those are the mechanisms that make \"enforce it at the query level\" something more than a good intention in a markdown file. A rule like \"owners never see per-doctor detail\" is trivial to violate by accident with one convenient JOIN if nothing beneath it makes that hard to do. The schema is what turns a policy into a constraint.",
      ],
    },
    {
      type: 'blockQuote',
      quote: 'The schema is what turns a policy into a constraint.',
      author: 'Ron Nelson',
    },
    {
      type: 'paragraphBlock',
      heading: "What's next",
      paragraphs: [
        "Part 3 is where the actual AI engineering starts: turning a messy, shorthand-heavy SOAP note into structured, billable line items, and matching those against a clinic's fee schedule using embeddings and pgvector. It's a different kind of hard problem than this post — less about who's allowed to see what, more about getting a language model to read the way a veterinary technician writes. But it inherits everything from this post: extraction only matters because the buckets it feeds into were already built to be trustworthy.",
      ],
    },
  ],
};
