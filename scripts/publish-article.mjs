// Generic article publisher.
//
// Usage:
//   node scripts/publish-article.mjs scripts/articles/ai-security-skill.mjs
//   node scripts/publish-article.mjs scripts/articles/dvmchart-part-3.mjs
//
// The argument is a path to an article definition file that exports a default
// object. See scripts/lib/contentful-publisher.js for the full definition
// schema, and scripts/articles/ for worked examples.

import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { publishArticle } from './lib/contentful-publisher.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const [,, articleArg] = process.argv;
if (!articleArg) {
  console.error('Usage: node scripts/publish-article.mjs <path-to-article-definition>');
  console.error('Example: node scripts/publish-article.mjs scripts/articles/ai-security-skill.mjs');
  process.exit(1);
}

const articlePath = path.isAbsolute(articleArg)
  ? articleArg
  : path.resolve(process.cwd(), articleArg);

// Windows requires file:// URLs for ESM dynamic import of absolute paths
const articleUrl = pathToFileURL(articlePath).href;
const { default: articleDef } = await import(articleUrl);
publishArticle(articleDef).catch(e => {
  console.error('\nFAILED:', e.message || e);
  process.exit(1);
});
