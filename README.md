# Contentful Blog - SvelteKit

A modern blog application built with SvelteKit and Contentful CMS, deployed as a Cloudflare Worker with Assets.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your Contentful credentials

# Start development server
npm run dev
```

## 📦 Deployment

```bash
# Build and deploy to Cloudflare Workers
npm run deploy

# Or deploy with dry-run to preview changes
npm run deploy:dry-run
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run wrangler:dev` - Test with Wrangler dev server

### Deployment
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm run deploy:dry-run` - Preview deployment without publishing
- `npm run wrangler:tail` - View real-time logs from production

### Contentful
- `npm run contentful:publish-model` - Publish content model to Contentful
- `npm run contentful:list-types` - List existing content types

### Testing & Docs
- `npm run test` - Run tests with Vitest
- `npm run docs` - Generate JSDoc documentation

## 🏗️ Architecture

- **Framework:** SvelteKit 2.x
- **CMS:** Contentful
- **Styling:** TailwindCSS
- **Deployment:** Cloudflare Workers with Assets
- **Language:** JavaScript with JSDoc type annotations

## 📁 Project Structure

```
.
├── src/
│   ├── routes/              # SvelteKit file-based routing
│   │   ├── +layout.svelte   # Global layout with navigation
│   │   ├── +page.svelte     # Homepage
│   │   ├── blog/            # Blog post pages
│   │   ├── category/        # Category landing pages
│   │   └── [slug]/          # Dynamic page routes
│   ├── lib/
│   │   ├── components/      # Reusable Svelte components
│   │   └── contentful/      # Contentful API client & queries
│   ├── app.html             # HTML template
│   └── app.css              # Global styles (Tailwind)
├── scripts/                 # Contentful management scripts
├── wrangler.jsonc          # Cloudflare Workers configuration
├── svelte.config.js        # SvelteKit configuration
└── tailwind.config.js      # Tailwind configuration
```

## 🔑 Environment Variables

### Local Development (.dev.vars)
```bash
CONTENTFUL_ACCESS_TOKEN=...
CONTENTFUL_PREVIEW_ACCESS_TOKEN=...
CONTENTFUL_MANAGEMENT_TOKEN=...
```

### Production (wrangler.jsonc + secrets)
```jsonc
// wrangler.jsonc - Non-secrets
{
  "vars": {
    "CONTENTFUL_SPACE_ID": "your_space_id",
    "CONTENTFUL_ENVIRONMENT": "master"
  }
}
```

```bash
# Set production secrets
npx wrangler secret put CONTENTFUL_ACCESS_TOKEN
npx wrangler secret put CONTENTFUL_PREVIEW_ACCESS_TOKEN
npx wrangler secret put CONTENTFUL_MANAGEMENT_TOKEN
```

## 📝 Content Model

The blog uses the following Contentful content types:

- **Page** - Flexible pages built from section components
- **Blog Post** - Internal blog posts with rich text content
- **External Article** - Links to articles on Medium, Dev.to, etc.
- **Category** - Content categories with theme colors
- **Author** - Author profiles
- **Section Types:**
  - Navigation Bar
  - Paragraph Block
  - Image Content Block
  - Block Quote
  - Code Block

## 🎨 Features

- ✅ Dynamic page assembly from Contentful sections
- ✅ Blog posts with rich text rendering
- ✅ External article integration (Medium, Dev.to)
- ✅ Category landing pages with SEO optimization
- ✅ Hero section with image collage from recent posts
- ✅ Preview mode for unpublished content (`?preview=true`)
- ✅ Responsive design with TailwindCSS
- ✅ Edge deployment on Cloudflare Workers

## 🔧 Configuration

See [CLAUDE.md](./CLAUDE.md) for development guidelines and code conventions.

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [SvelteKit Docs](https://kit.svelte.dev/)
- [Contentful Docs](https://www.contentful.com/developers/docs/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

## 📄 License

Private project - All rights reserved