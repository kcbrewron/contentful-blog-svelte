# Bug Tracker

Use this file to log issues encountered during development.

## Format

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
