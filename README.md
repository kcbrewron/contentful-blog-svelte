# sveltekit-d1-tailwindcss-template

A modern web application template combining SvelteKit, Cloudflare D1 Database, and TailwindCSS for rapid development of performant, full-stack applications.

## Features

- 🚀 [SvelteKit](https://kit.svelte.dev/) - Full-stack application framework
- 💾 [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite-compatible database on the edge
- 🎨 [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- ✅ Type-safe database operations
- 📱 Responsive design out of the box
- 🧪 Testing setup with Vitest
- 📚 JSDoc documentation

## Prerequisites

- Node.js (version 16 or higher)
- Cloudflare account
- Wrangler CLI installed globally (`npm install -g wrangler`)

## Getting Started

1. Create a new project using this template:
   ```bash
   npx create-next-app my-app -e https://github.com/kcbrewron/sveltekit-d1-tailwindcss-template
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your D1 database:
   ```bash
   wrangler d1 create my-db
   ```

4. Update the `wrangler.toml` with your D1 database details.

5. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── migrations/       # Database migration files
├── src/
│   ├── lib/         # Shared components and utilities
│   ├── routes/      # SvelteKit routes and pages
│   └── app.css      # Global styles
├── static/          # Static assets
└── tests/           # Test files
```

## Database Migrations

To run migrations:

```bash
npm run migrate
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   wrangler pages deploy .svelte-kit/cloudflare
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run check` - Type-check the codebase
- `npm run lint` - Lint the codebase

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_d1_database_url
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)