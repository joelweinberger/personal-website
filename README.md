# Personal Website of Joel H. W. Weinberger

A modern static website built with [Astro](https://astro.build). Hosted on GitHub Pages.

## Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
.
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies and scripts
├── pubs.json             # Publications data
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── PageHeader.astro
│   │   └── SimpleFooter.astro
│   ├── layouts/          # Page layouts
│   │   └── BaseLayout.astro
│   ├── lib/              # Shared utilities
│   │   └── publications.ts
│   ├── pages/            # Routes (each .astro file = a page)
│   │   ├── index.astro
│   │   ├── publications.astro
│   │   ├── calendar.astro
│   │   └── wedding.astro
│   └── styles/
│       └── global.css    # Design system and global styles
├── public/               # Static assets (copied as-is)
│   ├── img/
│   ├── papers/
│   ├── fonts/
│   └── brown-cs-website/ # Legacy site preserved
└── dist/                 # Generated site (gitignored)
```

## Development

### Adding/Updating Publications

1. Edit `pubs.json` with new paper data
2. The site will hot-reload in dev mode, or run `npm run build`

### Modifying Pages

Edit the `.astro` files in `src/pages/`. Astro uses a component-based approach with scoped CSS.

### Styling

The design system is in `src/styles/global.css` with CSS custom properties for colors, typography, spacing, etc. Supports light/dark mode via `prefers-color-scheme`.

## Deployment to GitHub Pages

The site automatically deploys via GitHub Actions when you push to `main`.

### Initial Setup (one-time)

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under "Build and deployment", set **Source** to **GitHub Actions**
4. Push to `main` — the workflow will build and deploy automatically

### Custom Domain (optional)

1. In **Settings → Pages**, enter your custom domain (e.g., `joelweinberger.us`)
2. Add a `CNAME` file to `public/` containing your domain name
3. Configure DNS with your registrar:
   - For apex domain: Add `A` records pointing to GitHub's IPs (185.199.108-111.153)
   - For subdomain: Add a `CNAME` record pointing to `<username>.github.io`

See [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

### Manual Deployment

```bash
npm run build
# Upload contents of dist/ to your hosting provider
```

## Notes

- The lock.ico favicon is used under CC BY-SA 3.0, courtesy of Wikimedia user Urutseg
- Profile photo is copyright Joel Weinberger
- Legacy Brown CS site preserved at `/brown-cs-website/`
