# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SvelteKit blog application using Contentful CMS, deployed as a Cloudflare Worker with Assets binding, styled with TailwindCSS.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (outputs to `.svelte-kit/cloudflare`)
- `npm run preview` - Preview production build
- `npm test` - Run tests with Vitest
- `npm run docs` - Generate JSDoc documentation
- `npm run contentful:publish-model` - Publish Contentful content model
- `npm run contentful:list-types` - List existing Contentful content types

## Deployment Commands

- `npx wrangler deploy` - Deploy to Cloudflare Workers
- `npx wrangler secret put SECRET_NAME` - Add secret environment variable
- `npx wrangler tail` - View real-time logs
- `npx wrangler deployments list` - List recent deployments
- See `DEPLOYMENT.md` for complete deployment guide

## Architecture

### SvelteKit Structure
- **src/routes/** - File-based routing (pages and API endpoints)
- **src/app.html** - HTML shell template
- **src/app.css** - Global Tailwind styles
- **src/hooks.server.js** - Server-side request handling hooks
- **src/hooks.client.js** - Client-side hooks
- **src/service-worker.js** - PWA service worker

### Deployment Target
- Uses `@sveltejs/adapter-cloudflare` for Cloudflare Workers with Assets
- Worker configuration in `wrangler.jsonc`:
  - `main` - Worker entry point (`.svelte-kit/cloudflare/_worker.js`)
  - `assets` - Static assets binding
  - `compatibility_flags` - Node.js compatibility enabled
- Secrets managed via `npx wrangler secret put`
- Build output: `.svelte-kit/cloudflare/`

### Contentful Integration
- **Content Delivery API** - Used in production for published content
- **Preview API** - Used with `?preview=true` query parameter for draft content
- **Management API** - Used in scripts for publishing content models
- Environment variables:
  - `CONTENTFUL_SPACE_ID` - Space identifier (non-secret, in wrangler.jsonc)
  - `CONTENTFUL_ACCESS_TOKEN` - Delivery API token (secret)
  - `CONTENTFUL_PREVIEW_ACCESS_TOKEN` - Preview API token (secret)
  - `CONTENTFUL_MANAGEMENT_TOKEN` - Management API token (secret, scripts only)
  - `CONTENTFUL_ENVIRONMENT` - Environment name (non-secret, default: "master")

### Code Style Conventions

**Use JSDoc for type documentation:**
```javascript
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 */
```

**Prefer named functions over arrow functions for primary declarations:**
```javascript
// DO
function handleSubmit(event) { }

// DON'T
const handleSubmit = (event) => { };
```

**Database operations should use typed JSDoc:**
```javascript
/**
 * @param {number} id
 * @returns {Promise<?DBUser>}
 */
function getUser(id) { }
```

### Testing Patterns
- Use Vitest for unit tests
- Write descriptive test blocks with named functions
- Include JSDoc type annotations in test setup

### Security
- **Never commit secrets** - Use `.dev.vars` for local development (gitignored)
- **Separate secrets from config** - Non-secrets in `wrangler.jsonc`, secrets via Wrangler CLI
- Store Contentful tokens as secrets, not environment variables
- Validate all user inputs from Contentful rich text fields

### Performance
- Leverage edge deployment with Cloudflare
- Optimize database queries
- Use SvelteKit's built-in code splitting
