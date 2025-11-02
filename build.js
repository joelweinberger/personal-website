#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { marked } = require('marked');

// Directories
const TEMPLATES_DIR = './templates';
const STATIC_DIR = './static';
const DIST_DIR = './dist';

// Helper function to create directory if it doesn't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper function to copy file
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// Helper function to recursively copy directory
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Register Handlebars helpers
Handlebars.registerHelper('markdown', function(text) {
  if (!text) return '';
  return new Handlebars.SafeString(marked(text));
});

// Page metadata
const pages = {
  'index.html': {
    ExtraCSS: [
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css',
    ],
    ExtraMeta: [],
    ExtraScripts: [],
    Header: 'jww (at) joelweinberger (dot) us',
    NoContent: false,
    NoHomeLink: true,
    Title: 'Joel H. W. Weinberger -- jww',
  },
  'publications.html': {
    ExtraCSS: [
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css',
    ],
    ExtraMeta: [],
    ExtraScripts: ['/js/index.js'],
    Header: 'publications',
    NoContent: false,
    NoHomeLink: false,
    Title: 'Joel H. W. Weinberger -- Publications',
  },
  'calendar.html': {
    ExtraCSS: ['/css/page/calendar.css'],
    ExtraMeta: [],
    ExtraScripts: [],
    Header: '',
    NoContent: true,
    NoHomeLink: true,
    Title: 'Joel H. W. Weinberger -- Calendar',
  },
  'wedding.html': {
    ExtraCSS: [
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css',
    ],
    ExtraMeta: [],
    ExtraScripts: [],
    Header: 'wedding',
    NoContent: false,
    NoHomeLink: false,
    Title: 'Joel H. W. Weinberger -- Wedding',
  },
  'offline.html': {
    ExtraCSS: [
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css',
    ],
    ExtraMeta: [],
    ExtraScripts: [],
    Header: 'offline',
    NoContent: false,
    NoHomeLink: false,
    Title: 'Joel H. W. Weinberger -- Offline',
  },
};

// Load and parse publications
function loadPubs() {
  const pubsData = fs.readFileSync('./pubs.json', 'utf8');
  const pubs = JSON.parse(pubsData);

  // Reverse papers arrays (chronological to reverse chronological)
  pubs.papers.reverse();
  pubs.techs.reverse();

  // Enhance papers with full author objects and formatted author lists
  const enhancePaper = (paper) => {
    // Resolve author IDs to full author objects
    paper.authorObjects = paper.authors.map(authorId => ({
      id: authorId,
      ...pubs.authors[authorId]
    }));

    // Create formatted author list for BibTeX
    paper.authorList = paper.authors
      .map(authorId => pubs.authors[authorId].name)
      .join(' and ');

    return paper;
  };

  pubs.papers = pubs.papers.map(enhancePaper);
  pubs.techs = pubs.techs.map(enhancePaper);

  return pubs;
}

// Read template file and return as string
function readTemplate(filename) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, filename), 'utf8');
}

// Build the site
function build() {
  console.log('Starting build...');

  // Clean and create dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  ensureDir(DIST_DIR);

  // Load publications
  console.log('Loading publications...');
  const pubs = loadPubs();

  // Load layout template
  console.log('Loading templates...');
  const layoutSource = readTemplate('layout.html');

  // Build each page
  console.log('Building pages...');
  for (const [pageName, pageData] of Object.entries(pages)) {
    console.log(`  Building ${pageName}...`);

    // Load page template
    const pageSource = readTemplate(pageName);

    // Register the page as a partial named "body"
    Handlebars.registerPartial('body', pageSource);

    // Compile layout template
    const template = Handlebars.compile(layoutSource);

    // Prepare template data
    const templateData = {
      ...pageData,
      Pubs: pageName === 'publications.html' ? pubs : undefined,
    };

    // Render the page
    const html = template(templateData);

    // Write to dist
    fs.writeFileSync(path.join(DIST_DIR, pageName), html);
  }

  // Copy static assets
  console.log('Copying static assets...');
  copyDir(STATIC_DIR, DIST_DIR);

  // Copy other root files
  console.log('Copying root files...');
  if (fs.existsSync('./pubs.json')) {
    copyFile('./pubs.json', path.join(DIST_DIR, 'pubs.json'));
  }

  // Copy bower_components if they exist
  if (fs.existsSync('./bower_components')) {
    console.log('Copying bower components...');
    copyDir('./bower_components', path.join(DIST_DIR, 'components'));
  } else {
    console.log('Warning: bower_components not found. Run "bower install" to install web components.');
  }

  console.log('Build complete! Output in dist/');
}

// Run build
try {
  build();
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
