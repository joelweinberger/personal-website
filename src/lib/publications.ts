/**
 * Shared utilities for working with publication data
 */
import pubs from '../../pubs.json';

export interface Author {
  name: string;
  homepage?: string;
}

export interface Paper {
  title: string;
  pdf: string;
  authors: string[];
  conference?: string;
  year?: string;
  abstract?: string;
  presentation?: string;
  extended?: string;
  notes?: string;
  citeseer?: string;
  proceedings?: string;
  textitle?: string;
  booktitle?: string;
  institution?: string;
  number?: string;
  url?: string;
  nobibtex?: boolean;
}

export const authors: Record<string, Author> = pubs.authors;
export const papers: Paper[] = pubs.papers;
export const techs: Paper[] = pubs.techs;

/**
 * Validate a URL-ish string for use in an `href`. Allows `https:`, `http:`,
 * relative paths (`/foo`, `./foo`), fragments (`#x`), and `mailto:`. Anything
 * else (`javascript:`, `data:`, `vbscript:`, etc.) returns `'#'` so a bad
 * value in pubs.json can't render as a clickable XSS link.
 */
export function safeHref(url: string | null | undefined): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed;
  if (/^[/#]/.test(trimmed) || trimmed.startsWith('./')) return trimmed;
  return '#';
}

/**
 * Get author's display name from their ID
 */
export function getAuthorName(authorId: string): string {
  return authors[authorId]?.name || authorId;
}

/**
 * Get author's homepage URL, if available
 */
export function getAuthorLink(authorId: string): string | null {
  return authors[authorId]?.homepage || null;
}

/**
 * Get the URL for a paper's PDF, handling both relative and absolute URLs
 */
export function getPdfUrl(paper: Paper): string {
  return paper.pdf.startsWith('http') ? paper.pdf : `/${paper.pdf}`;
}

/**
 * Extract a markdown link's URL from text by label.
 * e.g., extractMarkdownLink("[slides](url)", "slides") returns "url".
 * Walks balanced parentheses so URLs containing `(...)` (e.g. Wikipedia
 * disambiguation links) are extracted in full instead of truncating at the
 * first inner `)`. Label is matched literally; regex metacharacters in label
 * are escaped.
 */
export function extractMarkdownLink(text: string, label: string): string | null {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const head = new RegExp(`\\[${escapedLabel}\\]\\(`, 'i');
  const headMatch = text.match(head);
  if (!headMatch || headMatch.index === undefined) return null;

  const start = headMatch.index + headMatch[0].length;
  let depth = 1;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) return text.slice(start, i) || null;
    }
  }
  return null;
}

/**
 * Get slides URL from presentation field
 */
export function getSlidesUrl(paper: Paper): string | null {
  if (!paper.presentation) return null;
  return extractMarkdownLink(paper.presentation, 'slides');
}

/**
 * Get project page URL from notes field
 */
export function getProjectUrl(paper: Paper): string | null {
  if (!paper.notes) return null;
  return extractMarkdownLink(paper.notes, 'project page');
}

/**
 * Format author list for display, optionally excluding self (jww)
 * Returns: "with Author1, Author2, and Author3"
 */
export function formatAuthorsWithPrefix(authorIds: string[], excludeSelf: boolean = true): string {
  const names = authorIds
    .filter(id => !excludeSelf || id !== 'jww')
    .map(id => getAuthorName(id));

  if (names.length === 0) return '';
  if (names.length === 1) return `with ${names[0]}`;
  if (names.length === 2) return `with ${names[0]} and ${names[1]}`;
  return `with ${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

/**
 * Clean up conference string for display
 * Removes "In Proc. of " prefix and trailing year
 */
export function formatVenue(conference: string): string {
  return conference
    .replace(/^In Proc\. of /, '')
    .replace(/\s*,\s*\d{4}\.?$/, '');
}

/**
 * Extract a short venue name with year.
 * Anchors on the 4-digit year so conference strings with internal commas
 * (e.g. "...Information, Computer and Communications Security (ASIACCS), 2011")
 * keep the full venue name.
 */
export function getShortVenue(conference: string): string {
  const stripped = conference.replace(/^In Proc\. of /, '');
  const yearMatch = stripped.match(/\d{4}/);
  if (!yearMatch) return stripped.trim();
  const year = yearMatch[0];
  const venue = stripped.slice(0, yearMatch.index).replace(/[,.\s]+$/, '');
  return venue ? `${venue} ${year}` : year;
}

/**
 * Get paper year, returns empty string if not available
 */
export function getYear(paper: Paper): string {
  return paper.year || '';
}

/**
 * Generate BibTeX citation for a paper. Returns '' if the paper opted out
 * (`nobibtex`) or has no `proceedings` cite key — without a key BibTeX entries
 * collide on the bibliography side.
 */
export function generateBibtex(paper: Paper): string {
  if (paper.nobibtex || !paper.proceedings) return '';

  const authorList = paper.authors.map(id => getAuthorName(id)).join(' and ');
  const type = paper.institution ? 'techreport' : 'inproceedings';

  const fields: string[] = [
    `  author = {${authorList}}`,
    `  title = {${paper.textitle || paper.title}}`,
  ];
  if (paper.booktitle) fields.push(`  booktitle = {${paper.booktitle}}`);
  if (paper.institution) fields.push(`  institution = {${paper.institution}}`);
  if (paper.number) fields.push(`  number = {${paper.number}}`);
  if (paper.year) fields.push(`  year = {${paper.year}}`);

  return `@${type}{${paper.proceedings},\n${fields.join(',\n')}\n}`;
}

/**
 * Sort papers by year, newest first
 * Papers without years are sorted to the end
 */
export function sortByYear(paperList: Paper[]): Paper[] {
  return [...paperList].sort((a, b) => {
    const yearA = parseInt(a.year || '0');
    const yearB = parseInt(b.year || '0');
    return yearB - yearA;
  });
}

/**
 * Stable DOM id for deep-linking to a paper on the publications page.
 * Uses the BibTeX `proceedings` key when present, otherwise slugifies the title.
 */
export function getPaperId(paper: Paper): string {
  if (paper.proceedings) return paper.proceedings;
  return paper.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get featured papers for homepage highlights
 */
export function getFeaturedPapers(): Paper[] {
  const featuredIds = ['weinberger-felt', 'weinberger11sanitize', 'barth09heapgraph'];
  return papers.filter(p => featuredIds.includes(p.proceedings || ''));
}

/**
 * Get the Subresource Integrity spec from technical reports
 */
export function getSriSpec(): Paper | undefined {
  return techs.find(t => t.title.includes('Subresource Integrity'));
}
