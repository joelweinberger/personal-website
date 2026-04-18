# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — local dev server at http://localhost:4321 (hot reload)
- `npm run build` — static build to `dist/`
- `npm run preview` — serve the built `dist/` for a final smoke test
- `npm run legacy-build` — runs `build.js` for the pre-Astro flow; not used by CI and generally not needed

There is no test suite, linter, or formatter configured. "Verifying changes" means `npm run build` succeeds and the page looks right in `npm run dev`/`preview`.

## Architecture

Astro 6 static site (requires Node ≥22.12; `.nvmrc` is the single source of truth — both `nvm use` locally and `actions/setup-node` in CI read from it). `output: 'static'` in `astro.config.mjs` — every route in `src/pages/*.astro` compiles to a standalone HTML file under `dist/`, and `public/` is copied verbatim. There is no server at runtime.

**Publications are the one nontrivial data flow.** `pubs.json` is the single source of truth for papers, authors, and tech reports. `src/lib/publications.ts` is the only module that reads it — pages should call its helpers (`getFeaturedPapers`, `formatAuthorsWithPrefix`, `getShortVenue`, `generateBibtex`, etc.) rather than touching `pubs.json` directly. Author IDs (e.g. `jww`) resolve to display names + homepages via the `authors` map; `formatAuthorsWithPrefix` excludes `jww` by default so paper listings read "with X and Y". Featured papers on the homepage are selected by hardcoded `proceedings` IDs in `getFeaturedPapers`.

**Styling.** Design system lives in `src/styles/global.css` as CSS custom properties (colors, typography, spacing). Light/dark mode is driven purely by `prefers-color-scheme` — no toggle, no JS. Component styles inside `.astro` files are scoped by Astro.

**Legacy content.** `public/brown-cs-website/` is a preserved snapshot of the old site served at `/brown-cs-website/`. Leave it alone unless explicitly asked. `bower_components/` and `docs/MIGRATION_SUMMARY.md` are historical artifacts from the pre-Astro Go-server era.

## Workflow

`main` is protected — **never commit or push directly to `main`**. All changes go through a feature branch and a PR, even one-line edits. Start work with `git checkout -b <branch>` before editing, and open a PR against `main` when ready.

## Deployment

`main` auto-deploys via `.github/workflows/deploy.yml` (Astro build → `upload-pages-artifact` → `deploy-pages`). GitHub Pages serves `www.joelweinberger.us` (CNAME in `public/CNAME`); the apex domain redirects to `www`. The `site` field in `astro.config.mjs` must stay in sync with the canonical `www.` URL — it's used for absolute URLs in the build output.
