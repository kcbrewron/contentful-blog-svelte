# Cloudflare Workers Deployment Guide

This application is configured to deploy as a Cloudflare Worker with Assets using the SvelteKit Cloudflare adapter.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- Contentful space with content model published

## Local Development

1. **Copy environment variables:**
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. **Fill in `.dev.vars` with your actual Contentful credentials:**
   - `CONTENTFUL_ACCESS_TOKEN` - Content Delivery API token
   - `CONTENTFUL_PREVIEW_ACCESS_TOKEN` - Preview API token
   - `CONTENTFUL_MANAGEMENT_TOKEN` - Management API token (for scripts)

3. **Update `wrangler.jsonc` with your Contentful Space ID:**
   ```jsonc
   "vars": {
     "CONTENTFUL_SPACE_ID": "your_actual_space_id",
     "CONTENTFUL_ENVIRONMENT": "master"
   }
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## Deployment

### Option 1: Deploy via Wrangler CLI (Recommended)

1. **Update `wrangler.jsonc` with your Contentful Space ID:**
   ```jsonc
   "vars": {
     "CONTENTFUL_SPACE_ID": "your_actual_space_id",
     "CONTENTFUL_ENVIRONMENT": "master"
   }
   ```

2. **Set secrets (first time only):**
   ```bash
   npx wrangler secret put CONTENTFUL_ACCESS_TOKEN
   npx wrangler secret put CONTENTFUL_PREVIEW_ACCESS_TOKEN
   npx wrangler secret put CONTENTFUL_MANAGEMENT_TOKEN
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```

4. **Deploy to Cloudflare Workers:**
   ```bash
   npx wrangler deploy
   ```

   The worker will be deployed with the name specified in `wrangler.jsonc` (default: `contentful-svelte-blog`).

5. **View your deployment:**
   ```bash
   npx wrangler tail
   ```

### Option 2: Deploy via CI/CD (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          secrets: |
            CONTENTFUL_ACCESS_TOKEN
            CONTENTFUL_PREVIEW_ACCESS_TOKEN
            CONTENTFUL_MANAGEMENT_TOKEN
        env:
          CONTENTFUL_ACCESS_TOKEN: ${{ secrets.CONTENTFUL_ACCESS_TOKEN }}
          CONTENTFUL_PREVIEW_ACCESS_TOKEN: ${{ secrets.CONTENTFUL_PREVIEW_ACCESS_TOKEN }}
          CONTENTFUL_MANAGEMENT_TOKEN: ${{ secrets.CONTENTFUL_MANAGEMENT_TOKEN }}
```

**GitHub Secrets to configure:**
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Workers:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CONTENTFUL_ACCESS_TOKEN` - Content Delivery API token
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` - Preview API token
- `CONTENTFUL_MANAGEMENT_TOKEN` - Management API token

## Configuration Files

- **`wrangler.jsonc`** - Cloudflare Workers configuration with Assets binding
  - `main` - Worker entry point (`.svelte-kit/cloudflare/_worker.js`)
  - `assets` - Static assets configuration
  - `vars` - Non-secret environment variables
  - `compatibility_flags` - Enable Node.js compatibility
- **`.dev.vars`** - Local development secrets (gitignored)
- **`svelte.config.js`** - SvelteKit Cloudflare adapter configuration

## Environment Variables

### Non-Secret (in wrangler.jsonc)
- `CONTENTFUL_SPACE_ID` - Your Contentful space ID
- `CONTENTFUL_ENVIRONMENT` - Contentful environment (usually "master")

### Secret (set via Wrangler or Dashboard)
- `CONTENTFUL_ACCESS_TOKEN` - Content Delivery API access token
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` - Preview API access token
- `CONTENTFUL_MANAGEMENT_TOKEN` - Management API access token (for publishing content models)

## Post-Deployment

1. **Verify deployment:**
   ```bash
   npx wrangler deployments list
   ```
   - Visit your Worker URL (e.g., `contentful-svelte-blog.your-subdomain.workers.dev`)
   - Check that content loads correctly from Contentful

2. **Set up custom domain:**
   ```bash
   npx wrangler domains add ronnelson.dev
   ```
   Or via Cloudflare Dashboard:
   - Workers & Pages → Your Worker → Settings → Domains & Routes
   - Add custom domain

3. **Test preview mode:**
   - Visit `https://your-domain.com/?preview=true`
   - Verify unpublished content appears

4. **Monitor logs:**
   ```bash
   npx wrangler tail
   ```

## Troubleshooting

- **Build fails:** Check Node.js version is 18+
- **Content not loading:** Verify secrets are set with `npx wrangler secret list`
- **Preview not working:** Ensure CONTENTFUL_PREVIEW_ACCESS_TOKEN is set
- **Assets not serving:** Check `assets.directory` path in wrangler.jsonc matches build output
- **Worker not deploying:** Run `npx wrangler whoami` to verify authentication

## Development vs Production

**Local Development:**
- Uses `.dev.vars` for secrets
- Run with `npm run dev` or `npx wrangler dev` (after build)

**Production:**
- Uses secrets set via `npx wrangler secret put`
- Non-secret vars in `wrangler.jsonc`
- Deploy with `npx wrangler deploy`

## Additional Resources

- [SvelteKit Cloudflare Adapter Docs](https://kit.svelte.dev/docs/adapter-cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers with Assets](https://developers.cloudflare.com/workers/configuration/sites/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
