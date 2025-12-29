# Website Modernization Plan

## Executive Summary

This plan outlines a comprehensive modernization of joelweinberger.us, transforming it from its current early-2010s aesthetic into a contemporary, professional personal website while preserving all existing content, the bibliography system, and the legacy Brown CS site.

**View the mockups:**
- [Home Page Mockup](mockups/home-mockup.html)
- [Publications Page Mockup](mockups/publications-mockup.html)

---

## Current State Analysis

### Technology Stack (Current)
- **Build System**: Custom Node.js script with Handlebars templating
- **Styling**: Plain CSS with fixed 800px width
- **Interactive Elements**: Polymer iron-collapse web components
- **Dependencies**: Bower for web components, npm for build tools
- **Deployment**: Static files to GitHub Pages

### Design Issues
1. Fixed 800px width (not responsive)
2. Dated color palette (gray backgrounds, purple header)
3. No mobile optimization
4. Limited typography (system fonts only)
5. Outdated visual hierarchy

---

## Recommended Modernization

### Option A: Astro (Recommended)

**Why Astro?**
- Zero JavaScript by default (ships only what's needed)
- Excellent static site generation for GitHub Pages
- Component-based architecture
- Built-in Markdown support
- Easy migration from Handlebars templates
- Fast builds with Vite under the hood

```bash
# New project structure
personal-website/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.astro
│   │   ├── PublicationCard.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── publications.astro
│   │   ├── calendar.astro
│   │   └── wedding.astro
│   ├── styles/
│   │   └── global.css
│   └── data/
│       └── publications.json   # Migrated from pubs.json
├── public/
│   ├── brown-cs-website/       # Legacy site (untouched)
│   ├── papers/                 # PDF files
│   ├── img/
│   └── resume.pdf
├── astro.config.mjs
└── package.json
```

### Option B: Eleventy (11ty)

**Pros:**
- Simpler, more lightweight than Astro
- Excellent template flexibility (supports Handlebars, easier migration)
- Battle-tested for personal sites

**Cons:**
- Less modern component model
- More manual optimization needed

### Option C: Enhanced Current Stack

**Pros:**
- Minimal migration effort
- No new frameworks to learn

**Cons:**
- Bower is deprecated
- Limited component reusability
- Harder to maintain long-term

---

## Design System Specification

### Color Palette

```css
:root {
  /* Light Mode */
  --color-bg-primary: #fafafa;
  --color-bg-secondary: #ffffff;
  --color-bg-tertiary: #f5f5f7;
  --color-bg-accent: #f0f4ff;

  --color-text-primary: #1a1a2e;
  --color-text-secondary: #4a4a68;
  --color-text-tertiary: #8888a0;

  --color-accent-primary: #4f46e5;    /* Indigo - professional, modern */
  --color-accent-hover: #4338ca;

  --color-border: #e5e5ea;
  --color-border-subtle: #f0f0f5;
}

/* Dark Mode (automatic via prefers-color-scheme) */
:root {
  --color-bg-primary: #0f0f1a;
  --color-bg-secondary: #1a1a2e;
  /* ... */
}
```

### Typography

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Scale (based on 1rem = 16px) */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
}
```

### Spacing Scale

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Layout

- **Max width**: 1100px (container)
- **Content width**: 720px (readable text)
- **Responsive breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

---

## Key Design Features

### 1. Hero Section
- Clean two-column layout (image + bio)
- Prominent name and current role
- Status badge showing current position
- Quick navigation to key pages

### 2. Publications
- Card-based layout with hover effects
- Year badges for quick scanning
- Inline BibTeX/abstract expansion (no Polymer needed)
- Search and filter functionality
- Your name highlighted in author lists

### 3. Experience Timeline
- Visual company logos/letters
- Clean card layout
- Links to legacy site preserved

### 4. Responsive Design
- Mobile-first approach
- Touch-friendly tap targets
- Collapsible navigation on small screens

### 5. Dark Mode
- Automatic based on system preference
- Carefully selected dark palette
- Proper contrast ratios (WCAG AA)

---

## Migration Path

### Phase 1: Setup (Day 1)
1. Initialize Astro project
2. Configure for GitHub Pages deployment
3. Set up CSS custom properties
4. Create base layout component

### Phase 2: Core Pages (Days 2-3)
1. Migrate index page content
2. Create publication card component
3. Migrate publications page
4. Implement BibTeX/abstract toggles with vanilla JS

### Phase 3: Secondary Pages (Day 4)
1. Calendar page
2. Wedding page
3. Offline fallback

### Phase 4: Assets & Polish (Day 5)
1. Migrate static assets
2. Copy legacy Brown CS site to public/
3. Update image optimization
4. Add Inter and JetBrains Mono fonts
5. Test responsive behavior

### Phase 5: Deployment (Day 6)
1. Configure GitHub Actions for auto-deploy
2. Update CNAME
3. Test production build
4. Remove old build system

---

## Technical Specifications

### Build Configuration (Astro)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.joelweinberger.us',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### Package.json

```json
{
  "name": "joel-weinberger-website",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.0.0"
  }
}
```

---

## Preserved Features

### Must Keep
- [x] All publication data (pubs.json structure)
- [x] BibTeX generation and display
- [x] Abstract toggle functionality
- [x] Legacy Brown CS site (static files, untouched)
- [x] GitHub Pages deployment
- [x] Custom domain (www.joelweinberger.us)
- [x] All PDF papers and resume

### Can Remove
- Bower and web components polyfills
- Service Worker (optional, can re-add later)
- Iron-collapse (replace with CSS/vanilla JS)
- Old build.js

---

## Benefits Summary

| Aspect | Current | Modernized |
|--------|---------|------------|
| Mobile Experience | None | Fully responsive |
| Dark Mode | None | Automatic |
| Typography | System fonts | Inter + JetBrains Mono |
| Build Time | ~2s | <1s (Vite) |
| Bundle Size | ~50KB+ (Polymer) | ~5KB (vanilla) |
| Maintainability | Custom scripts | Standard tooling |
| Dependencies | Bower (deprecated) | npm only |
| Visual Appeal | 2012 aesthetic | 2025 aesthetic |

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Color | Indigo (#4f46e5) | Approved |
| Fonts | Self-hosted | Better privacy, faster loading, no external requests, no GDPR concerns |
| Analytics | Privacy-friendly (Plausible/Fathom) | Aligns with privacy-conscious approach |
| Framework | Astro | Zero JS by default, fast builds, easy migration |
| Design tone | Personal bio | Not resume-like; removed job title badges, simplified layout |
| Home publications | "Publication Highlights" | Not actively publishing, so "Recent" doesn't apply |
| Layout | Centered | All buttons and links centered, especially on mobile |

---

## Next Steps

Ready to begin implementation! The plan is:

1. Initialize Astro project with the approved design system
2. Migrate content from Handlebars templates
3. Self-host Inter and JetBrains Mono fonts
4. Add Plausible/Fathom analytics snippet
5. Configure GitHub Actions for deployment
