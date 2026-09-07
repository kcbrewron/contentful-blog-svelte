// Article: "Shifting Security Left with AI: Making Threat Modeling Part of the Dev Loop"
// Topic: Using AI coding assistant skills to embed security constraints directly
// into the development workflow — composable, framework-aware, and repeatable.
//
// Publish: node scripts/publish-article.mjs scripts/articles/ai-security-skill.mjs

/** @type {import('../lib/contentful-publisher.js').ArticleDef} */
export default {
  title: 'Shifting Security Left with AI: Making Threat Modeling Part of the Dev Loop',
  slug: 'shift-left-security-ai-threat-modeling-skills',
  excerpt:
    '"Shift security left" has been DevSecOps\' rallying cry for a decade. The gap between principle and practice is where breaches happen. AI coding assistants close it: composable skills embedding framework-aware constraints into the development loop.',
  tags: ['devsecops', 'security', 'ai-development', 'threat-modeling', 'claude-code', 'shift-left', 'owasp'],
  estimatedReadingTime: 11,
  seoTitle: 'Shift Left Security with AI: Composable Threat Modeling Skills for DevSecOps',
  seoDescription:
    'How a composable skill architecture embeds framework-aware security constraints into the development loop — covering SvelteKit, Hono, Spring Boot, and FastAPI.',
  categorySearch: ['tech', 'ai', 'develop', 'software', 'cloud'],
  authorName: 'Ron Nelson',
  content: [
    {
      type: 'paragraphBlock',
      heading: 'The gap between the principle and the practice',
      paragraphs: [
        '"Shift security left" has been the DevSecOps rallying cry for a decade. The idea is simple and correct: find security problems earlier in the development cycle, when they cost orders of magnitude less to fix. The practice is messier. Most teams have a threat model document, a security review checklist, maybe a STRIDE analysis from the architecture phase. Those artifacts are real. What they aren\'t is present — not when a developer is writing a query at the end of a sprint, not when a feature gets extended in ways the original design didn\'t anticipate, not when the new engineer joins the team and writes their first production API endpoint.',
        "The gap isn't awareness. Developers generally know that SQL injection is bad, that access control needs to be enforced at the data layer, that secrets don't belong in logs. The gap is that security knowledge lives in one place and code gets written in another, and the two rarely meet at the right moment.",
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'What changes when the AI assistant knows your security requirements',
      paragraphs: [
        'AI coding assistants — Claude Code, GitHub Copilot, Cursor — are now a standard part of the development loop. Most teams use them to generate boilerplate, explain unfamiliar APIs, and speed up implementation. That\'s the obvious value. The less obvious one: an AI assistant that knows your security requirements is present at exactly the moment when security mistakes get made.',
        'The question is how you give it that knowledge in a way that\'s reliable, repeatable, and doesn\'t require every developer to manually paste context into every session. The answer, for Claude Code at least, is skills — and the approach that actually scales is not one skill, but a composable hierarchy of them.',
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'The architecture: a lead skill and framework-specific specialists',
      paragraphs: [
        'A single monolithic security skill doesn\'t survive contact with a real engineering team. The security concerns for a SvelteKit server route are not the same as those for a Hono API handler or a Spring Boot controller. CSRF considerations, SSR data exposure patterns, dependency injection attack surfaces, async context leakage — these are framework-specific problems that generic security rules address badly if at all.',
        'The approach that works is layered. A lead skill carries the universal constraints: tenant isolation rules, data classification requirements, authentication trust boundaries, explicit out-of-scope guards. When Claude Code loads the lead skill and detects the framework in use — from imports, file structure, or naming conventions — it references the appropriate specialist skill for that framework\'s specific OWASP surface.',
        'The result is that a developer working on a SvelteKit server load function gets SvelteKit-specific security context. The same developer writing a Hono route handler gets Hono-specific context. A Java engineer on the same team working in Spring Boot gets Spring Boot context. The lead skill provides the shared baseline; the specialist skills provide the framework-aware depth. Neither has to know about the other in advance — the composition happens at detection time.',
      ],
    },
    {
      type: 'codeBlock',
      caption: '.claude/SKILLS/security-lead/SKILL.md — lead skill with framework detection',
      language: 'markdown',
      code: `---
name: security-lead
description: "Universal security constraints and framework detection. Load for
any code touching authentication, authorization, data access, API routes, or
user-facing functionality. After loading these universal rules, detect the
active framework and reference the appropriate specialist skill."
---

# Universal Security Constraints

## Tenant isolation — enforce at the query level

Every query returning user or tenant data MUST scope by tenant_id from
the verified session. Never accept tenant_id as a user-supplied parameter.
Never JOIN across tenant boundaries in application-facing endpoints.

## Authentication trust boundaries

Verify tokens on the service that uses them. Never trust a caller's claim
about their own identity. Service-to-service calls still require auth —
internal network location is not a trust boundary.

## Data classification

- PII: never log, never include in error messages, never return unless required
- Credentials and secrets: never log under any circumstances
- Audit records: write-only — never modified or deleted by application code

## Framework detection — reference the matching specialist skill

After applying the universal rules above, identify the active framework
and load its specialist OWASP coverage:

- SvelteKit imports or +page.server.ts / +layout.server.ts files
  → reference: security-sveltekit + security-oss-npm
- Hono imports or apps/api/ path patterns
  → reference: security-hono + security-oss-npm
- Spring Boot annotations (@RestController, @Service, @Repository)
  → reference: security-spring-boot + security-oss-maven
- FastAPI imports or Python route decorators (@app.get, @router.post)
  → reference: security-fastapi + security-oss-pypi + security-oss-pypi

## OSS dependency health — ecosystem-specific, paired with each framework

Every framework detection also loads the matching OSS skill for that ecosystem.
The OSS skills differ by registry, lock file format, and tooling:

- SvelteKit / Hono (npm ecosystem)
  → reference: security-oss-npm   (package.json, yarn.lock, npm audit / semver)
- Spring Boot (Maven ecosystem)
  → reference: security-oss-maven (pom.xml / build.gradle, OWASP Dependency-Check, Maven versioning)
- FastAPI (PyPI ecosystem)
  → reference: security-oss-pypi  (requirements.txt, Pipfile.lock, pip-audit, PEP 440)

Each OSS skill knows which registry to check, which lock file to read, and which
version comparison semantics apply. Apply universal + framework specialist + OSS
ecosystem skill together.`,
    },
    {
      type: 'paragraphBlock',
      heading: 'What each specialist skill covers',
      paragraphs: [
        'The specialist skills are not generic OWASP checklists reformatted as markdown. Each one addresses the specific attack surface and common misuse patterns for that framework, in terms concrete enough to apply while writing code.',
        [
          { text: 'SvelteKit. ', bold: true },
          { text: 'Server load functions run on the edge and can inadvertently leak server-side data into the serialized page store, where it becomes visible to the client. The specialist skill covers what can and cannot be returned from load(), how to handle cookies across SSR and CSR boundaries safely, and the CSRF implications of SvelteKit\'s form action pattern.' },
        ],
        [
          { text: 'Hono. ', bold: true },
          { text: 'Hono is built for edge and serverless environments where cold-start constraints push developers toward leaner middleware stacks. The specialist skill covers input validation requirements that don\'t get silently skipped under that pressure, correct header handling for APIs that sit behind a CDN or reverse proxy, and the specific trust boundary considerations when Hono is used as a backend-for-frontend.' },
        ],
        [
          { text: 'Spring Boot. ', bold: true },
          { text: 'Spring Boot\'s dependency injection and auto-configuration model creates a large implicit surface area. The specialist skill covers Spring Security configuration patterns that are commonly misconfigured, the specific risks of @Transactional on public methods, and SQL injection vectors that appear in Spring Data JPA queries written with dynamic predicates.' },
        ],
        [
          { text: 'FastAPI. ', bold: true },
          { text: "FastAPI's automatic OpenAPI generation and Pydantic validation model are genuinely secure by default in many cases — and that can create a false sense of safety. The specialist skill covers where Pydantic validation doesn't protect you (nested models with arbitrary types, response model bypasses), async context isolation requirements, and the dependency injection patterns that correctly enforce authentication across route groups." },
        ],
        [
          { text: 'OSS dependency health — one skill per ecosystem. ', bold: true },
          { text: 'Each framework detection also loads a matching OSS skill for that ecosystem. The skills differ because the ecosystems differ: npmjs uses package.json and yarn.lock with semver semantics and npm audit; Maven Central uses pom.xml or build.gradle with OWASP Dependency-Check; PyPI uses requirements.txt or Pipfile.lock with pip-audit and PEP 440 versioning. A generic "check for vulnerable packages" instruction is not actionable — the skill has to know which registry to query, which lock file to read, and how version ranges are expressed in that ecosystem to give guidance a developer can actually act on. The goal is the same across all three: make dependency currency a byproduct of touching code rather than a separate remediation sprint competing with feature work for attention.' },
        ],
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'Inventory first: what the skill can see, and what it has to ask',
      paragraphs: [
        'Before the specialist skills apply their rules, the lead skill does something that traditional threat model documents never do: it reads the codebase. It builds an architecture inventory from what\'s actually there — frameworks detected, dependency trees, API surface area, data models, authentication patterns, external service integrations. This is the foundation the rest of the analysis builds on, and it reflects the current state of the code rather than a diagram someone drew eighteen months ago.',
        'But code only reveals part of the picture. The application layer is visible. The infrastructure layer isn\'t. A skill that reads the codebase cannot see whether the API sits behind a WAF, what the network isolation boundaries are between services, whether rate limiting is enforced at the edge or only in application code, how secrets are managed in production, or what logging and monitoring is actually in place versus what the code assumes is in place. Those controls matter for threat modeling — an injection vulnerability behind a well-configured WAF has a different risk profile than the same vulnerability exposed directly to the internet.',
        'The skill handles this with a structured back-and-forth. After completing the code inventory, it surfaces the gaps — the security-relevant infrastructure properties it cannot derive from the codebase — and asks targeted questions to fill them in. Not an open-ended interview, but a specific set of prompts: What sits in front of this service? What are the network isolation boundaries? Where does rate limiting live? How are secrets rotated? The answers get incorporated into the analysis alongside the code-derived inventory, producing a threat model that spans both layers.',
        'This is the part that normally requires a security engineer to schedule time with the team, read documentation that may not reflect the current deployment, and manually reconcile what the code says with what the infrastructure actually does. The skill doesn\'t replace that judgment — it replaces the coordination overhead that makes that work expensive and therefore infrequent.',
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'This is a living threat model, not a static document',
      paragraphs: [
        "Look at what this skill architecture actually is. Universal access-control rules. Trust boundary definitions. Data classification with implementation implications. Framework-specific OWASP coverage that maps to real attack patterns. Explicit out-of-scope guards for features that would violate security properties if built naively. That's a threat model — broken into composable, actively loaded pieces rather than a document that ages in a wiki.",
        "The difference from a traditional threat model is where it lives and when it's read. A threat model in Confluence gets consulted during planning and ignored during implementation. A threat model in a Claude Code skill hierarchy is loaded automatically every time a developer writes code that matches a trigger — framework imports, file paths, code patterns. The security context is present at exactly the moment when access-control decisions get made, not six weeks later in a review.",
        "And when the threat model changes — when a new compliance requirement comes in, when a security review surfaces a pattern the current skills don't cover, when a new framework gets added to the stack — you update the skill file. Every developer picks up the updated constraints in their next session, without an announcement, without a training session, without anyone having to remember.",
      ],
    },
    {
      type: 'blockQuote',
      quote: "Security knowledge that lives in a document isn't a constraint. It becomes a constraint when it's in the room where the code gets written — and when it knows what framework it's talking to.",
      author: 'Ron Nelson',
    },
    {
      type: 'paragraphBlock',
      heading: 'What "repeatable" actually means at team scale',
      paragraphs: [
        'One of the persistent failure modes in DevSecOps is that security practices are person-dependent rather than process-dependent. The senior engineer who ran the threat model knows the rules. The developer who joined three months later, the one implementing a new feature at the edge of the original design, the contractor building the integration — they have varying levels of access to that context, and varying levels of awareness that they need it.',
        'A skill file checked into the repository loads for every developer who uses Claude Code on that codebase, in every session, without any individual needing to know it exists. When a new developer clones the repo and opens a SvelteKit server file, the lead skill loads, detects the framework, and references the SvelteKit specialist. They\'re working with the team\'s access-control rules and SvelteKit-specific OWASP coverage active in their context before they write their first line — not because anyone ran an onboarding session, but because the skill hierarchy is part of the project.',
        'This is what "repeatable" means in a DevSecOps context: the same security constraints applied consistently, across every developer, every framework, every sprint — not because everyone remembers them, but because the development environment makes it structurally difficult to miss them.',
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'Where this fits in the DevSecOps stack',
      paragraphs: [
        'A skill hierarchy is not a substitute for SAST tooling, dependency scanning, penetration testing, or code review. Those layers catch different things at different points in the cycle and they\'re not optional. The skill architecture adds an earlier layer, not a replacement one.',
        'Think of the DevSecOps pipeline as a set of filters, each catching what slipped through the previous one. SAST catches known vulnerability patterns in committed code. Code review catches logic errors and design problems that automated tools miss. Penetration testing catches exploitable issues in running systems. Each of those filters runs after the code is written.',
        'The skill hierarchy runs while the code is being written. It catches the class of problems that come from a developer not knowing a rule existed, or not thinking about a boundary while focused on making a feature work. Those are the cheapest problems to fix — a line of code before a PR is opened costs essentially nothing. The same problem caught in a penetration test costs a sprint. Used together, the layers are genuinely complementary: the skill hierarchy reduces the volume of issues reaching the later filters, which means those filters can spend their time on harder problems.',
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'Building the hierarchy for your stack',
      paragraphs: [
        'The lead skill is the right starting point. Get the universal constraints right first — tenant isolation, authentication trust boundaries, data classification — before adding framework-specific coverage. A solid lead skill that applies to all code in your stack is more valuable than four specialist skills with a weak foundation.',
        'For each framework your team uses, the specialist skill should be grounded in that framework\'s actual OWASP surface, not a reformatted version of the general Top 10. Read the framework\'s own security documentation. Look at the CVE history for that framework. Pull out the patterns that appear repeatedly — the misconfigurations that are easy to make because the framework makes them easy, the edge cases in the framework\'s own security primitives, the places where the defaults are insecure. Those are the rules that earn their place in the specialist skill.',
        'The OSS skills round out the hierarchy — one per package ecosystem, paired with the corresponding framework specialist. They follow the same ecosystem-specific logic: the npm OSS skill knows to read yarn.lock and interpret semver ranges; the Maven OSS skill knows to parse the dependency tree from pom.xml and check against Maven Central\'s CVE feeds; the PyPI OSS skill knows pip-audit and PEP 440 version semantics. A single generic "check for vulnerable dependencies" skill isn\'t actionable enough to be useful — the guidance it produces has to be specific enough that a developer can act on it without leaving their current context. The ecosystem split is what makes that possible.',
        'Check the entire hierarchy into version control alongside the application code. When a new framework is added to the stack, add a specialist skill as part of the same work. When a security review surfaces a gap, close it in the skill as well as in the code — the skill fix prevents the next developer from making the same mistake.',
        'Team-level rollout is straightforward if your team already uses Claude Code: the skills are in the repository, so they\'re available to everyone who clones it. The harder organizational question is adoption — getting consistent Claude Code usage across the team so the skills are actually in play during development. That\'s a process question, not a technical one, and the answer varies by team. The technical foundation is ready when the skills are in the repo; the human foundation is what determines whether they do their job.',
      ],
    },
    {
      type: 'paragraphBlock',
      heading: 'The real shift',
      paragraphs: [
        '"Shift left" as a slogan has always been correct and always underdetermined. Move security earlier in the cycle, yes — but earlier how? The traditional answers are training, checklists, and security champions embedded in engineering teams. Those all help. They\'re also all person-dependent and session-dependent: they work when the right person is in the right conversation.',
        'A composable AI skill architecture is something different. The security knowledge travels with the codebase, not with any individual engineer. It applies the right framework-specific constraints automatically, without requiring a developer to know which specialist rules apply to the code they\'re writing. It updates consistently across the entire team when the threat model changes. And it does all of this in the development session itself — not in a review, not in a post-incident retrospective, not in a quarterly security training.',
        "That's the real shift: from security as knowledge held by people to security as a property of the development environment itself. The skills don't replace the people, the reviews, or the tooling. They make all of those more effective by reducing the number of problems that reach them in the first place — and by making the ones that do reach them genuinely novel, rather than the same access-control mistake written a different way by a developer who didn't know the rule existed.",
      ],
    },
  ],
};
