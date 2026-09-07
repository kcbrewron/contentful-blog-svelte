// One-shot publisher for "The Developer's Threat Model Nobody Ignores" —
// a technology article about using Claude Code skills as a lightweight threat
// modeling mechanism embedded directly in the development workflow.
//
// Run from the repo root:  node scripts/publish-ai-security-skill-article.mjs
//
// Uses raw fetch() against the Content Management REST API, same pattern
// as the DVMChart article scripts.

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!TOKEN || !SPACE) {
  throw new Error('Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID — check .env at repo root.');
}

const API = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;

// Override if auto-detect misses — run once and check console output.
const CATEGORY_ID_OVERRIDE = '';
const AUTHOR_ID_OVERRIDE = '';

async function cma(pathSuffix, opts = {}) {
  const res = await fetch(`${API}${pathSuffix}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(opts.body ? { 'Content-Type': 'application/vnd.contentful.management.v1+json' } : {}),
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

function paraMixed(segments) {
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

function doc(...nodes) {
  return { nodeType: 'document', data: {}, content: nodes };
}

function linkTo(entry) {
  return { sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id } };
}

async function findCategory() {
  if (CATEGORY_ID_OVERRIDE) return cma(`/entries/${CATEGORY_ID_OVERRIDE}`);
  const data = await cma('/entries?content_type=category&limit=1000');
  // Prefer a technology/AI/development category over cloud/architecture
  const match = data.items.find(c => {
    const name = (c.fields.name?.['en-US'] || '').toLowerCase();
    const slug = (c.fields.slug?.['en-US'] || '').toLowerCase();
    return name.includes('tech') || slug.includes('tech') ||
           name.includes('ai') || slug.includes('ai') ||
           name.includes('develop') || slug.includes('develop') ||
           name.includes('software') || slug.includes('software');
  }) || data.items.find(c => {
    // Fallback: cloud & architecture is close enough
    const name = (c.fields.name?.['en-US'] || '').toLowerCase();
    return name.includes('cloud') || name.includes('architecture');
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
    console.log(`Author: using entry ${match.sys.id}`);
    return match;
  }
  throw new Error('Set AUTHOR_ID_OVERRIDE and re-run.');
}

async function createBlock(contentType, fields) {
  const entry = await cma('/entries', {
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

  // ── Block 1: Lead / hook ──────────────────────────────────────────────────
  const leadBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'The document nobody reads during a deadline' },
    richContent: {
      'en-US': doc(
        para(
          "Most projects have a threat model somewhere. It lives in Confluence, or in a docs/ folder, or in a Notion page that was carefully written during an architecture review and then never opened again. The security rules it contains are real and important. They just aren't in the room when a developer is writing a query at 4pm against a deadline.",
        ),
        para(
          "I ran into this problem building DVMChart, a veterinary billing-audit tool. The system handles sensitive data about individual doctors — their discretionary billing decisions, their patterns, their corrections over time. Getting the access-control rules wrong doesn't just mean a bug; it means a doctor seeing another doctor's private data, which is the exact kind of trust failure that ends a product. I had a clear threat model in my head. What I didn't have was a reliable way to keep it in the room while I was actually writing code."
        )
      ),
    },
  });

  // ── Block 2: What Claude Code skills are ─────────────────────────────────
  const skillsIntroBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'Skills: structured context that loads automatically' },
    richContent: {
      'en-US': doc(
        para(
          "Claude Code has a feature called skills — markdown files stored in a .claude/SKILLS/ directory (or, in newer versions, .claude/skills/) that the AI assistant loads automatically when you're working on code that matches a configured trigger. The key word is automatically: you don't paste in context at the start of every session, you don't have to remember to mention the rules. The skill loads when you open a file the system recognizes, and it stays loaded for the duration of that context.",
        ),
        para(
          "The typical use case people reach for first is workflow automation: a skill that knows your PR format, your test conventions, your deploy process. That's genuinely useful. But the more valuable application — the one that took me longer to notice — is using a skill to encode security constraints and access-control rules as persistent, machine-readable context.",
        ),
        para(
          "If the threat model lives in the skill file, it doesn't have to live in anyone's head."
        )
      ),
    },
  });

  // ── Block 3: The actual skill file ───────────────────────────────────────
  const skillCodeBlock = await createBlock('codeBlock', {
    caption: { 'en-US': '.claude/SKILLS/SKILL.md — the vet-billing-domain skill (excerpt)' },
    language: { 'en-US': 'markdown' },
    code: {
      'en-US': `---
name: vet-billing-domain
description: "Domain rules and non-negotiable product constraints for the vet
billing audit tool. Load this whenever writing, reviewing, or modifying code
that touches audit_findings, doctor_patterns, extracted_items, fee_schedule_items,
reporting/rollup logic, role-based access, or any UI screen showing findings,
reports, or review actions."
---

## Visibility rules — enforce in every query, not just the UI

These are access-control rules, and they must be enforced at the query
level, not just hidden in the UI:

- **A doctor sees only their own findings, their own reports, and their own
  doctor_patterns.** Never a comparison to other doctors.
- **An owner/manager sees clinic-level aggregate totals only** — never
  individual judgment-call detail, never a per-doctor breakdown or ranking.
- **judgment_call findings never surface to any non-doctor role, in any
  form** — not in a report, not in an aggregate count, not in an anonymized
  rollup.

## The core distinction: error vs. judgment

- **likely_missed** — probably a genuine oversight.
- **judgment_call** — the doctor deliberately chose not to charge.
  Never treat this bucket as an error to correct.
- **ambiguous** — requires human review, not an automated guess.

When writing or modifying classification logic: a gap must always land in
exactly one bucket. Never add a code path that silently drops a gap or
double-counts it.`,
    },
  });

  // ── Block 4: This is threat modeling ─────────────────────────────────────
  const threatModelBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': "This is a threat model — it's just in the right place" },
    richContent: {
      'en-US': doc(
        para(
          "Look at what that skill file actually is. It describes who can see what, what operations are allowed on what data, which classifications have what semantics, and which patterns are explicitly out of scope. That's a threat model — specifically the access-control section of one, which is often the part that matters most for data-handling applications."
        ),
        para(
          "The difference from a traditional threat model document is where it lives and when it's read. A threat model in Confluence gets consulted during architecture reviews and ignored during implementation. A threat model in a Claude Code skill gets loaded automatically every time you write a query against the relevant tables — because the skill's description tells Claude Code to load it when you touch those files."
        ),
        para(
          "The version in the skill isn't authoritative in the cryptographic sense. It doesn't enforce like a Postgres RLS policy. But it's present, repeatedly, at exactly the moment when access-control mistakes get made: during development, when a developer is optimizing for getting the feature working and not for carefully re-reading the security doc."
        )
      ),
    },
  });

  // ── Block 5: Pull quote ───────────────────────────────────────────────────
  const pullQuote = await createBlock('blockQuote', {
    author: { 'en-US': 'Ron Nelson' },
    quote: { 'en-US': "A threat model nobody reads during development isn't a constraint — it's a document. The skill turns it into a constraint by making it impossible to miss." },
  });

  // ── Block 6: The enforcement hierarchy ───────────────────────────────────
  const enforcementBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'Soft and hard enforcement — why you need both' },
    richContent: {
      'en-US': doc(
        para(
          "There's an honest objection to this approach: a markdown file the AI reads isn't enforcement. A developer can still write a query that violates the rules. A bug can still silently join the wrong tables. The skill doesn't prevent that the way a database policy does."
        ),
        para(
          "True. But this framing misses something important about how access-control failures actually happen in practice. They're rarely malicious. They're almost always a developer who forgot, who didn't realize the rule applied here, who was optimizing for a slightly different goal and didn't notice the side effect. The threat model document doesn't prevent those failures because it's not in the room when they happen."
        ),
        paraMixed([
          { text: "The skill is in the room. " },
          { text: "When Claude Code is helping you write a new API route that returns audit findings, it's already loaded the rule that judgment_call findings must never surface to non-doctor roles — because the skill's description matched the file you're editing. When it helps you write an aggregation query, it knows the rule that manager-level views must never break down data by individual doctor. It can flag the violation before it ships, not during a security review six weeks later." },
        ]),
        para(
          "The DVMChart project uses both layers. The skill for soft, continuous enforcement during development. Explicit WHERE clauses and role-based query filtering for hard enforcement at runtime. Postgres RLS as the planned third layer for production-grade isolation. These layers are complements, not substitutes. The skill makes the hard enforcement less likely to be written incorrectly in the first place."
        )
      ),
    },
  });

  // ── Block 7: How to build this for your project ───────────────────────────
  const howToBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'Building a threat modeling skill for your project' },
    richContent: {
      'en-US': doc(
        para(
          "The mechanical part is straightforward. Create a .claude/SKILLS/ directory at your project root. Add a SKILL.md file with a frontmatter block that specifies a name, a description, and the trigger conditions — which files or code patterns should cause the skill to load. Then write the rules in plain language. Claude Code loads skills automatically when their trigger conditions match the active context."
        ),
        para(
          "The harder part is deciding what actually belongs in the skill versus in other places. Three categories of content consistently earn their place here:"
        ),
        paraMixed([
          { text: "Access-control rules by role. ", bold: true },
          { text: "Who can see what, at the query level — not just the UI level. If a rule is important enough to document in a threat model, it's important enough to repeat here in specific, implementable terms." },
        ]),
        paraMixed([
          { text: "Data classification semantics. ", bold: true },
          { text: "If your system makes meaningful distinctions between categories of data (sensitive vs. non-sensitive, individual vs. aggregate, confirmed vs. estimated), spell out what those distinctions mean for query design. The DVMChart judgment_call bucket is an example: it's not just a label, it carries specific rules about what code is and isn't allowed to do with it." },
        ]),
        paraMixed([
          { text: "Explicit out-of-scope guards. ", bold: true },
          { text: 'A section that says "do not implement this without a direct conversation first" is surprisingly effective. It captures the features that seem like natural extensions of the current system but would violate a security property. In DVMChart, this includes anything that aggregates doctor_patterns across multiple doctors — a feature that would be analytically useful but is explicitly ruled out because of trust implications.' },
        ]),
        para(
          "What doesn't belong: implementation patterns, coding conventions, performance advice. Those have other places. The skill should stay focused on the constraints that have security implications, so it doesn't get diluted into a general coding guide nobody reads carefully."
        )
      ),
    },
  });

  // ── Block 8: The real-world test ─────────────────────────────────────────
  const realWorldBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'What it actually caught' },
    richContent: {
      'en-US': doc(
        para(
          "The moment the approach proved itself in DVMChart wasn't dramatic. I was adding a new summary report for clinic managers. The obvious implementation would have included a breakdown of findings per doctor — it made the aggregate numbers more interpretable. The skill flagged it before I finished the query. The rule was there, in the loaded context: owners/managers see clinic-level aggregate totals only, never a per-doctor breakdown."
        ),
        para(
          "I would have caught it eventually — during testing, or in review. But the skill caught it during the first pass, in the same context where I was writing the query. That's the window where it's cheapest to fix: before the wrong mental model gets anchored, before a UI gets built around the wrong shape of data, before a test gets written that will now have to be rewritten."
        ),
        para(
          "This is the practical case for the skill pattern, stated plainly: it doesn't make you smarter about security. It keeps the security rules you already know about in the room when you're likely to accidentally violate them."
        )
      ),
    },
  });

  // ── Block 9: Closing ──────────────────────────────────────────────────────
  const closingBlock = await createBlock('paragraphBlock', {
    heading: { 'en-US': 'The habit that pays for itself' },
    richContent: {
      'en-US': doc(
        para(
          "Writing a threat model as a Claude Code skill takes about the same time as writing it as a Confluence document. The difference is purely in placement: one lives where developers go to look things up, the other lives where developers are actually working. One is read during architecture reviews. The other is read during the development session where the mistake would have happened."
        ),
        para(
          "The DVMChart SKILL.md has saved me from at least three access-control violations that would have required a production fix. None of them were the result of not knowing the rule. They were the result of being focused on something else while writing code that happened to touch a boundary the rule existed to protect. The skill doesn't require me to have a better memory or a stronger security instinct. It just puts the constraint in the same place as the code."
        ),
        para(
          "For any project where the consequences of an access-control mistake are meaningful — which is most projects that handle user data — that's the right place for it to be."
        )
      ),
    },
  });

  const contentRefs = [
    leadBlock,
    skillsIntroBlock,
    skillCodeBlock,
    threatModelBlock,
    pullQuote,
    enforcementBlock,
    howToBlock,
    realWorldBlock,
    closingBlock,
  ].map(linkTo);

  const today = new Date().toISOString().slice(0, 10);

  const blogPost = await cma('/entries', {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': 'blogPost' },
    body: JSON.stringify({
      fields: {
        title: { 'en-US': "The Developer's Threat Model Nobody Ignores" },
        slug: { 'en-US': 'ai-skill-threat-modeling-security' },
        excerpt: {
          'en-US': "Threat models live in docs nobody reads during development. Claude Code skills change that — they embed access-control rules directly into the AI assistant's context, loading automatically when you write code that touches a security boundary. Here's how the DVMChart project uses this pattern to keep its data visibility rules present at exactly the moment they're most likely to be violated.",
        },
        category: { 'en-US': linkTo(category) },
        author: { 'en-US': linkTo(author) },
        publishedDate: { 'en-US': today },
        content: { 'en-US': contentRefs },
        tags: { 'en-US': ['claude-code', 'security', 'ai-development', 'threat-modeling', 'access-control'] },
        estimatedReadingTime: { 'en-US': 8 },
        seoTitle: { 'en-US': 'Using Claude Code Skills as a Threat Model — Security-by-Default Development' },
        seoDescription: {
          'en-US': 'How embedding access-control rules in Claude Code skills keeps your threat model present during development — a pattern from building DVMChart.',
        },
      },
    }),
  });

  console.log('\n=== Draft blogPost created (NOT published) ===');
  console.log(`Entry ID: ${blogPost.sys.id}`);
  console.log(`Review it here: https://app.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}/entries/${blogPost.sys.id}`);
  console.log('\nAll content blocks are published; the blogPost entry is a draft. Review and add a featuredImage in Contentful UI before publishing.');
}

main().catch(e => {
  console.error('\nFAILED:', e.message || e);
  process.exit(1);
});
