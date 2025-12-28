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

## Deployment

GitHub Actions automatically builds and deploys to GitHub Pages on push to main. See `.github/workflows/deploy.yml`.

### Manual Deployment

```bash
npm run build
# Upload contents of dist/ to your hosting provider
```

## Notes

- The lock.ico favicon is used under CC BY-SA 3.0, courtesy of Wikimedia user Urutseg
- Profile photo is copyright Joel Weinberger
- Legacy Brown CS site preserved at `/brown-cs-website/`
