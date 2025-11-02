# Personal Website of Joel H. W. Weinberger

This is a static website generated from templates and data files. It can be hosted on GitHub Pages or any static hosting service.

## Build Setup

### Prerequisites
* Node.js 14+ (for building the site)
* Bower (optional, for web components): `npm install -g bower`

### Installation

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Install Bower components** (optional but recommended):
   ```bash
   bower install
   ```
   This installs the web components (iron-collapse, polyfills) needed for the publications page.

### Building the Site

To build the static site:

```bash
npm run build
```

This generates all HTML files in the `dist/` directory from:
- Templates in `templates/` (Handlebars format)
- Publication data from `pubs.json`
- Static assets from `static/`

### Development

**Build and serve locally:**
```bash
npm run serve
```

This builds the site and starts a local server at http://localhost:8080

**Clean build:**
```bash
npm run rebuild
```

This removes the `dist/` directory and rebuilds from scratch.

### Project Structure

```
.
├── build.js              # Build script (Node.js)
├── package.json          # Node dependencies
├── bower.json            # Web components
├── pubs.json             # Publications data
├── templates/            # Handlebars templates
│   ├── layout.html       # Base layout
│   ├── index.html        # Home page
│   ├── publications.html # Publications list
│   ├── calendar.html     # Calendar page
│   ├── wedding.html      # Wedding page
│   └── offline.html      # Offline fallback
├── static/               # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── img/              # Images
│   ├── papers/           # PDF papers
│   └── ...
└── dist/                 # Generated site (gitignored)
```

### How It Works

1. **Build script** (`build.js`):
   - Reads `pubs.json` and processes publication data
   - Resolves author IDs to full author objects
   - Reverses paper arrays for reverse-chronological display
   - Compiles Handlebars templates
   - Renders each page with appropriate data
   - Copies static assets to `dist/`
   - Copies bower_components to `dist/components/` if available

2. **Templates**:
   - Written in Handlebars syntax
   - `layout.html` provides the base page structure
   - Each page template is inserted as the `{{> body}}` partial
   - Publications are rendered with embedded abstracts and BibTeX entries

3. **Client-side JavaScript**:
   - No AJAX calls needed
   - Abstract and BibTeX toggles work on embedded content
   - Uses iron-collapse web component for expand/collapse behavior

### Deploying to GitHub Pages

The generated `dist/` directory contains everything needed for static hosting.

**Option 1: Manual deployment**
```bash
npm run build
cd dist
git init
git add .
git commit -m "Deploy to GitHub Pages"
git push -f https://github.com/YOUR_USERNAME/YOUR_REPO.git main:gh-pages
```

**Option 2: GitHub Actions** (recommended)
Create `.github/workflows/deploy.yml` to automatically build and deploy on push.

### Updating Content

**To add/update publications:**
1. Edit `pubs.json`
2. Run `npm run build`
3. Deploy the updated `dist/` folder

**To modify pages:**
1. Edit templates in `templates/`
2. Run `npm run build`
3. Deploy the updated `dist/` folder

## Legacy Go Server

The original Go-based server (`server.go`) is deprecated but retained for reference. See git history for the original README with Go setup instructions.

The static/img/lock.ico favicon is used under a Creative Commons
Attribution-Share Alike 3.0 Unported license, courtesy of Wikimedia user
Urutseg, converted from: http://commons.wikimedia.org/wiki/File:Crypto_stub.svg

The photo static/img/joel-weinberger-headshot.jpg is used courtesy of Steve
Hanna (http://www.vividmachines.com).

serviceworker-cache-polyfill.js is taken from
https://github.com/coonsta/cache-polyfill under an Apache v2.0 license.
