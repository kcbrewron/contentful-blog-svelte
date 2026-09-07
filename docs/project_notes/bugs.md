# Bug Tracker

Use this file to log issues encountered during development.

## YYYY-MM-DD BUG-000X - Bug Title

Each entry should include:
- **Issue:** What went wrong
- **What happened:** Description of the observed behavior
- **Solution:** How it was resolved
- **Prevention:** How to avoid this in the future

---

<!-- Add bug entries below this line -->

## BUG-001: External articles open category page instead of source URL

**Issue:** Clicking an external article card (e.g. a Medium post) from a category cluster page navigates to `/{categorySlug}/{slug}` — which resolves to the same category cluster page — instead of opening the external source URL.

**What happened:** `ArticleGridCluster.svelte` and `FeaturedArticleCluster.svelte` always build the href as `/{categorySlug}/{slug}` for every article regardless of content type. External articles (`externalArticle`) have no internal page at that route, so SvelteKit falls through to the category route, re-rendering the cluster. The `fields.externalUrl` field (e.g. `https://medium.com/...`) on external articles was never used.

**Solution:** Detect the content type (`sys.contentType.sys.id === 'externalArticle'`) in both cluster components. When external, use `fields.externalUrl` as the href and add `target="_blank" rel="noopener noreferrer"`. `BlogPostCard.svelte` already implemented this pattern correctly and served as the reference.

**Prevention:** When a query mixes multiple Contentful content types (e.g. `blogPost` + `externalArticle`), always check whether the link destination should differ per type before hardcoding an internal route. Use `sys.contentType.sys.id` to discriminate at render time.

## 2026-09-07 BUG-002: Homepage hero showed "3 Topics, 0 Articles"

**Issue:** After the Contentful SDK → native `fetch` migration ([79ede39](../../CHANGELOG) "replace Contentful SDK with native fetch to fix Cloudflare Workers compatibility"), the homepage hero stats showed the correct category count (3 Topics) but always showed 0 Articles.

**What happened:** `getCategoryPostCounts()` (and `getAllBlogSlugs()`, `getAllBlogPostsForSitemap()`) call `client.getEntries({ ..., select: 'fields.category' })`. The Contentful Delivery API strips `sys` from every returned item when `select` is used, unless `sys` is explicitly included in the select list (`select=sys,fields.category`). `resolveResponse()` in `src/lib/contentful/client.js` unconditionally read `e.sys.id` while indexing `data.items`, so it threw `Cannot read properties of undefined (reading 'id')`. The exception was swallowed by each query function's try/catch, which returned `{}` / `[]`, silently zeroing the article count and blog-slug listings.

**Solution:** In `getContentfulClient().getEntries()`, auto-prepend `sys` to any `select` param that doesn't already include it, so every call site gets a correct `sys.id` regardless of which fields it selects. Also hardened `resolveResponse()` to skip (not throw on) items lacking `sys.id`, as defense-in-depth. Added regression tests in `tests/unit/client.test.js` covering the `select`+`sys` behavior and the graceful-skip case.

**Prevention:** Any Contentful `select` query must include `sys` if the code (or the shared `resolveResponse` link-resolver) needs `item.sys.id`. This is now enforced centrally in `client.js` rather than left to each call site to remember. When migrating away from an official SDK to raw REST calls, re-verify API quirks like this that the SDK previously papered over — write a reproduction against the live API before trusting the replacement.
