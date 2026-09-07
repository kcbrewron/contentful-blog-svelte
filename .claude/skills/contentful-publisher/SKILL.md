---
name: contentful-publisher
description: "Publishing articles to Contentful for the contentful-blog-svelte project. Load whenever the user wants to publish a new article, create article content, add to the article series, or run the publish pipeline. Also load when working in scripts/articles/, scripts/lib/contentful-publisher.js, or scripts/publish-article.mjs."
---

# Contentful Article Publisher

This project uses a reusable publishing system. Never write one-off publisher
scripts (like the old `scripts/publish-dvmchart-article-N.mjs` pattern). Always
use the standard pipeline.

## The pipeline

```
scripts/articles/<article-name>.mjs   ← article definition (content + metadata)
         ↓
scripts/publish-article.mjs           ← generic runner
         ↓
scripts/lib/contentful-publisher.js   ← shared CMA library
         ↓
Contentful (draft blogPost + published content blocks)
```

**Run command:**
```
node scripts/publish-article.mjs scripts/articles/<article-name>.mjs
```

## Article definition format

Create a new `.mjs` file in `scripts/articles/`. Export a default object:

```js
export default {
  // Required
  title:               'Article Title',
  slug:                'url-slug-here',
  excerpt:             'One or two sentences shown in article cards.',

  // Optional with defaults
  publishedDate:       null,            // defaults to today (YYYY-MM-DD)
  tags:                [],
  estimatedReadingTime: 8,
  seoTitle:            '',
  seoDescription:      '',

  // Category lookup: keywords matched against category name + slug (case-insensitive)
  // Falls back left-to-right until a match. Set categoryIdOverride to bypass.
  categorySearch:      ['tech', 'cloud', 'ai'],
  categoryIdOverride:  '',

  // Author lookup: substring match on name field
  authorName:          'Ron Nelson',
  authorIdOverride:    '',

  // Image directory (relative to repo root, or absolute path)
  // Required only if content[] references imageBlock or heroImage blocks.
  imgDir:              null,

  content:             [],  // see block types below
};
```

## Block types

### paragraphBlock
```js
{
  type: 'paragraphBlock',
  heading: 'Section heading',     // optional
  paragraphs: [
    'Plain paragraph string.',
    // Mixed-mark paragraph: array of segment objects
    [
      { text: 'Bold label: ', bold: true },
      { text: 'normal text continues here' },
    ],
  ],
}
```

### codeBlock
```js
{
  type: 'codeBlock',
  caption: 'filename or context label',
  language: 'typescript',   // js, sql, markdown, bash, etc.
  code: `code string here`,
}
```

### imageBlock
```js
{
  type: 'imageBlock',
  heading: 'Optional section heading',
  imageName: 'my-image',    // filename without extension (looks for imgDir/my-image.png)
  imageTitle: 'Alt/title for the Contentful asset',
  imagePosition: 'right',   // 'left' | 'right'
  paragraphs: ['Caption text...'],  // optional
}
```

### heroImage
```js
{
  type: 'heroImage',
  imageName: 'hero',
  imageTitle: 'Hero image alt text',
}
```
Not added to `content[]` — becomes the blogPost `featuredImage` field.

### blockQuote
```js
{
  type: 'blockQuote',
  quote: 'The pull quote text.',
  author: 'Author Name',
}
```

## Image preparation

All images must be PNG files in the `imgDir` directory before running the
publisher. For diagrams, use the mermaid pipeline:

```
node scripts/mermaid/render-mermaid.js
# picks up *.mmd files from scripts/mermaid/diagrams/
# outputs .png to scripts/mermaid/out/
```

Then copy the needed PNGs into `docs/blog-assets/<article-folder>/`.

## What the publisher does

1. Finds category (by keyword search) and author (by name)
2. Uploads any referenced images to Contentful, processes, and publishes each asset
3. Creates and publishes each content block entry
4. Creates the blogPost entry **as a draft** (never auto-published)
5. Prints the Contentful UI URL to review and publish

All content blocks and assets are published immediately. The blogPost itself is a
draft — review it in Contentful UI and publish manually once satisfied.

## Existing articles (do not re-publish)

| File | Status | Contentful ID |
|------|--------|---------------|
| `scripts/articles/dvmchart-part-2.mjs` | Published | O5Iu4ud7IVpXit3oepusU |
| `scripts/articles/ai-security-skill.mjs` | Published | 6Y7BZtsCWpHcO8klsqqg5p |

## Category reference

The space currently has a **"Cloud & Software Architecture"** category (ID: `2Z0p2M6lfQbagIyX0maUY5`).
If no better-matching category exists for a new article, use `categoryIdOverride: '2Z0p2M6lfQbagIyX0maUY5'`.

## Environment requirements

Secrets must be in `.env` at the repo root (gitignored):
```
CONTENTFUL_MANAGEMENT_TOKEN=...
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ENVIRONMENT=master
```
