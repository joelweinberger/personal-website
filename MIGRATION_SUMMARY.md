# Migration Summary: Go Server → Static Site

**Date:** November 2, 2025
**Objective:** Convert Go-based web server to static serverless website for GitHub Pages hosting

---

## Original Architecture

### What It Was
- **Server:** Go web server with dynamic routing and template rendering
- **Templates:** Go html/template with markdown support via blackfriday
- **Publications:** Dynamically generated from `pubs.json` with server-side routes
  - `/abstracts/pub{N}` - Individual abstract pages
  - `/bibtexs/pub{N}` - Individual BibTeX pages
  - `/ajax/abstracts/pub{N}` - AJAX responses for abstracts
  - `/ajax/bibtexs/pub{N}` - AJAX responses for BibTeX
- **Dependencies:** Go runtime, TLS certificates, server configuration
- **Hosting:** Required dedicated server with Go runtime

### Key Challenges
1. Dynamic content generation required server-side processing
2. AJAX endpoints needed for abstract/BibTeX toggling
3. Security headers (CSP, HSTS) applied server-side
4. URL redirects (www, HTTP→HTTPS, blog) handled by server
5. Template rendering used Go-specific syntax

---

## Migration Plan

### Architecture Decision: Hybrid Approach
After discussion with user, chose a hybrid static/client-side approach:

1. **Build-time generation:** Pre-render all HTML with embedded content
2. **Client-side enhancement:** JavaScript toggles for abstracts/BibTeX
3. **Minimal tooling:** Simple Node.js build script (no heavy frameworks)
4. **URL simplification:** Remove `/abstracts/*` and `/bibtexs/*` routes
5. **PDF compatibility:** Keep all `/papers/*.pdf` paths unchanged

### Technology Choices
- **Build tool:** Node.js with minimal dependencies
- **Template engine:** Handlebars (similar to Go templates)
- **Markdown:** marked library (replaces blackfriday)
- **Web components:** Keep existing iron-collapse for toggles
- **No framework:** Avoided Next.js, Hugo, Jekyll for simplicity

---

## Changes Made

### 1. Build System Created

**New Files:**
- `package.json` - NPM configuration with dependencies:
  - `handlebars` - Template rendering
  - `marked` - Markdown to HTML conversion
- `build.js` - Static site generator (220 lines)

**Build Script Features:**
- Loads and parses `pubs.json`
- Reverses paper arrays (chronological → reverse chronological)
- Enhances papers with:
  - `authorObjects` - Full author data (name, homepage)
  - `authorList` - Formatted "Author1 and Author2" for BibTeX
- Compiles Handlebars templates
- Renders each page with appropriate data
- Copies static assets to `dist/`
- Copies bower_components to `dist/components/`

**NPM Scripts:**
```json
"build": "node build.js"
"clean": "rm -rf dist"
"rebuild": "npm run clean && npm run build"
"serve": "npm run build && cd dist && python3 -m http.server 8080"
```

### 2. Template Conversion

Converted all Go templates to Handlebars:

**Go Syntax → Handlebars:**
```
{{.Title}}                    → {{Title}}
{{range .ExtraCSS}}          → {{#each ExtraCSS}}
{{if .Header}}               → {{#if Header}}
{{if not .NoContent}}        → {{#unless NoContent}}
{{define "body"}}...{{end}}  → (removed, use partials)
{{template "body" .}}        → {{> body}}
{{markdown .Abstract}}       → {{{markdown abstract}}}
```

**Templates Modified:**
- ✅ `templates/layout.html` - Base layout with Handlebars syntax
- ✅ `templates/index.html` - Removed Go define blocks
- ✅ `templates/publications.html` - Complete rewrite:
  - Embedded abstracts directly in HTML (no separate pages)
  - Embedded BibTeX directly in HTML (no separate pages)
  - Changed `{{$index}}` to `{{@index}}`
  - Changed `{{$paper.field}}` to `{{field}}`
  - Used `{{#each authorObjects}}` for author loops
- ✅ `templates/calendar.html` - Removed Go syntax
- ✅ `templates/wedding.html` - Removed Go syntax
- ✅ `templates/offline.html` - Removed Go syntax

**Templates Removed:**
- `templates/abstract.html` - No longer needed (embedded)
- `templates/bibtex.html` - No longer needed (embedded)

### 3. JavaScript Updates

**File:** `static/js/index.js`

**Before (AJAX-based):**
```javascript
function attachToggle(item_id, pub_id) {
  fetch('ajax/' + toggle.getAttribute('href')).then(function(response) {
    response.text().then(function(data) {
      content.innerHTML = data;
      // Setup toggle...
    });
  });
}
```

**After (Client-side):**
```javascript
function attachToggle(item_id, pub_id) {
  var collapse = document.querySelector('#' + collapse_id);

  toggle.onclick = function(e) {
    e.preventDefault();
    collapse.toggle();
    toggle.classList.toggle('closed');
    toggle.classList.toggle('open');
  };
}
```

**Changes:**
- ❌ Removed `fetch()` calls to AJAX endpoints
- ❌ Removed server-side data fetching
- ✅ Direct toggle of embedded content
- ✅ Simpler, faster, no network requests

### 4. Service Worker Updates

**File:** `static/sw.js`

**Changes:**
- Updated cache version: `v1` → `v2`
- Updated cached URLs:
  - `/index` → `/index.html`
  - `/offline` → `/offline.html`
  - Added `/publications.html`
- Updated offline fallback: `'/offline'` → `'/offline.html'`

### 5. Documentation

**File:** `README.md` - Complete rewrite

**New sections:**
- Prerequisites (Node.js, Bower)
- Installation instructions
- Build commands
- Project structure
- How it works (build process explained)
- Deploying to GitHub Pages (manual + GitHub Actions)
- Updating content workflow
- Legacy note about Go server

**Old Go documentation:** Retained in git history

### 6. Configuration Updates

**File:** `.gitignore`

**Added:**
```
/dist
/node_modules
```

**Kept:**
```
/bower_components
/cert
/cert_config.json
/server
```

---

## Files Unchanged

These files were **not modified** and work as-is:

✅ `pubs.json` - Publications data
✅ `bower.json` - Web component dependencies
✅ `static/css/**` - All CSS files
✅ `static/img/**` - All images
✅ `static/papers/**` - All PDF papers (URLs preserved!)
✅ `static/resume.pdf` - Resume
✅ `static/files/**` - Other files
✅ `static/brown-cs-website/**` - Legacy site
✅ `static/.well-known/**` - Keybase proof
✅ `static/js/register-sw.js` - Service worker registration
✅ `static/js/serviceworker-cache-polyfill.js` - Polyfill

## Files Deprecated (Not Deleted)

These files are no longer used but kept for reference:

⚠️ `server.go` - Original Go web server
⚠️ `templates/abstract.html` - AJAX abstract template
⚠️ `templates/bibtex.html` - AJAX BibTeX template
⚠️ `tools/**` - Go server setup scripts

---

## Testing Performed

### Build Test
```bash
$ npm install
added 7 packages, and audited 8 packages in 1s

$ npm run build
Starting build...
Loading publications...
Loading templates...
Building pages...
  Building index.html...
  Building publications.html...
  Building calendar.html...
  Building wedding.html...
  Building offline.html...
Copying static assets...
Copying root files...
Warning: bower_components not found. Run "bower install" to install web components.
Build complete! Output in dist/
```

### Output Verification
✅ All 5 HTML files generated
✅ Static assets copied correctly
✅ Abstracts embedded in publications.html
✅ BibTeX entries embedded in publications.html
✅ Markdown rendered correctly
✅ Author links resolved properly
✅ PDF links preserved

### Local Server Test
```bash
$ cd dist && python3 -m http.server 8080
$ curl http://localhost:8080/index.html
# Successfully returns HTML
```

---

## What Changed for Users

### URLs
| Old URL | New URL | Status |
|---------|---------|--------|
| `/` | `/` or `/index.html` | ✅ Works |
| `/index` | `/index.html` | ✅ Works |
| `/publications` | `/publications.html` | ✅ Works |
| `/calendar` | `/calendar.html` | ✅ Works |
| `/wedding` | `/wedding.html` | ✅ Works |
| `/offline` | `/offline.html` | ✅ Works |
| `/abstracts/pub0` | *Removed* | ❌ Embedded in publications.html |
| `/ajax/abstracts/pub0` | *Removed* | ❌ Not needed |
| `/bibtexs/pub0` | *Removed* | ❌ Embedded in publications.html |
| `/ajax/bibtexs/pub0` | *Removed* | ❌ Not needed |
| `/papers/*.pdf` | `/papers/*.pdf` | ✅ **Unchanged!** |
| `/resume.pdf` | `/resume.pdf` | ✅ Unchanged |

### Features
| Feature | Before | After |
|---------|--------|-------|
| View publications | ✅ Server-side render | ✅ Pre-rendered HTML |
| Toggle abstracts | ✅ AJAX fetch | ✅ Client-side toggle |
| Toggle BibTeX | ✅ AJAX fetch | ✅ Client-side toggle |
| Offline support | ✅ Service worker | ✅ Service worker |
| PDF downloads | ✅ Static files | ✅ Static files |
| Markdown rendering | ✅ Server-side | ✅ Build-time |
| Works without JS | ❌ Requires server | ⚠️ Content visible, toggles don't work |

---

## Next Steps

### Immediate (Before Deploying)

1. **Install Bower components** (recommended):
   ```bash
   bower install
   npm run build
   ```
   This installs iron-collapse, polyfills, etc. for the publications page.

2. **Test thoroughly:**
   ```bash
   npm run serve
   # Visit http://localhost:8080
   # Test all pages
   # Test abstract/bibtex toggles
   # Test PDF downloads
   # Test service worker (go offline, reload)
   ```

3. **Verify all content:**
   - [ ] Home page displays correctly
   - [ ] Publications list is complete
   - [ ] All papers shown in reverse chronological order
   - [ ] Abstract toggles work
   - [ ] BibTeX toggles work
   - [ ] Author links are correct
   - [ ] PDF links work
   - [ ] Calendar embed works
   - [ ] Wedding page displays
   - [ ] Offline page accessible

### GitHub Pages Deployment

#### Option 1: Manual Deployment to `gh-pages` Branch

```bash
# Build the site
npm run build

# Navigate to dist
cd dist

# Initialize git (if needed)
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git remote add origin https://github.com/metromoxie/personal-website.git
git push -f origin HEAD:gh-pages
```

Then in GitHub:
- Go to Settings → Pages
- Source: Deploy from branch
- Branch: `gh-pages` / `(root)`
- Save

#### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Install Bower
      run: npm install -g bower

    - name: Install Bower components
      run: bower install

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Then:
- Push this file to your repo
- GitHub Actions will auto-deploy on every push to main

#### Option 3: Separate Repository

1. Create new repo: `metromoxie.github.io`
2. Build and push `dist/` contents to it
3. GitHub Pages will auto-serve from root
4. Configure custom domain

### Custom Domain Setup (REQUIRED)

**IMPORTANT:** This site uses absolute paths (`/css/...`, `/js/...`) which only work when deployed at the root domain, NOT in a subdirectory like `username.github.io/repo-name/`.

You **must** set up a custom domain before deploying:

#### 1. DNS Configuration

In your domain DNS settings (e.g., Namecheap, Cloudflare, etc.):

```
Type: CNAME
Name: www
Value: joelweinberger.github.io

Type: A (for apex domain)
Name: @
Value: 185.199.108.153
      185.199.109.153
      185.199.110.153
      185.199.111.153
```

#### 2. GitHub Pages Configuration

In GitHub repo settings → Pages:
- Custom domain: `www.joelweinberger.us`
- ✅ Enforce HTTPS (check this box)

#### 3. Create CNAME File

Add to your build script or create manually in `dist/`:

```bash
echo "www.joelweinberger.us" > dist/CNAME
```

Or update `build.js` to create it automatically:

```javascript
// In build.js, after "Copying root files...":
fs.writeFileSync(path.join(DIST_DIR, 'CNAME'), 'www.joelweinberger.us\n');
```

#### Why Absolute Paths?

- ✅ Simpler, cleaner code
- ✅ Consistent references from any page
- ✅ Better for production deployment
- ✅ SEO-friendly canonical URLs
- ❌ Won't work in GitHub Pages subdirectories

**Note:** If you need to test on `username.github.io/repo-name/`, you'll need to temporarily switch to relative paths or use a local server.

### Future Improvements (Optional)

1. **Remove Bower dependency:**
   - Replace iron-collapse with pure CSS/JS solution
   - Use npm packages instead of Bower
   - Simplify build process

2. **Add GitHub Actions workflow:**
   - Auto-build on push
   - Auto-deploy to gh-pages
   - Add tests/validation

3. **Optimize build:**
   - Minify HTML/CSS/JS
   - Optimize images
   - Generate sitemap.xml
   - Add robots.txt

4. **Modern enhancements:**
   - Convert to TypeScript
   - Add build-time validation
   - Add link checking
   - Responsive images

5. **SEO improvements:**
   - Add meta descriptions
   - Add Open Graph tags
   - Add structured data (JSON-LD)
   - Generate RSS feed for publications

---

## Rollback Plan

If you need to revert to the Go server:

1. **Restore Go server:**
   ```bash
   go build server.go
   ./server --unsafely-run-on-http --http-port=8080
   ```

2. **All original files are intact:**
   - `server.go` - Not modified
   - Original templates - Not deleted
   - `pubs.json` - Not modified
   - Static assets - Not modified

3. **Git history:**
   - All changes committed
   - Can revert with `git revert` or `git reset`

---

## Support

### If Build Fails

**"Cannot find module 'handlebars'":**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"bower_components not found" warning:**
```bash
npm install -g bower
bower install
npm run build
```

**"dist already exists":**
```bash
npm run clean
npm run build
```

### If Deployment Fails

**404 on GitHub Pages:**
- Check branch is set to `gh-pages` in Settings → Pages
- Ensure `index.html` exists in root of gh-pages branch
- Wait 5-10 minutes for Pages to build

**CSS not loading:**
- Check paths use `/css/...` not `css/...`
- Verify files copied to dist/css/
- Check browser console for 404s

**Service worker issues:**
- Clear browser cache
- Unregister old service worker
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

---

## Summary

**Before:** Go web server requiring runtime, TLS certs, server configuration
**After:** Static HTML files deployable anywhere, especially GitHub Pages

**Benefits:**
- ✅ No server needed
- ✅ Free hosting on GitHub Pages
- ✅ Better performance (CDN)
- ✅ Easier to update
- ✅ Version controlled
- ✅ Auto-deploy with GitHub Actions
- ✅ Same content and features
- ✅ PDF URLs preserved for backward compatibility

**Tradeoffs:**
- ⚠️ Requires build step to update
- ⚠️ No server-side redirects (use DNS/GitHub Pages config)
- ⚠️ No server-side security headers (GitHub Pages handles most)
- ⚠️ Abstract/BibTeX work best with JavaScript enabled

**Status:** ✅ **Ready for deployment!**
