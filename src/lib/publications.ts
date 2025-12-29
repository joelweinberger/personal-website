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
  nobibtex?: boolean;
}

export const authors: Record<string, Author> = pubs.authors;
export const papers: Paper[] = pubs.papers;
export const techs: Paper[] = pubs.techs;

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
 * Extract a markdown link from text by label
 * e.g., extractMarkdownLink("[slides](url)", "slides") returns "url"
 */
export function extractMarkdownLink(text: string, label: string): string | null {
  const regex = new RegExp(`\\[${label}\\]\\(([^)]+)\\)`, 'i');
  const match = text.match(regex);
  return match?.[1] || null;
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
 * Extract a short venue name with year
 */
export function getShortVenue(conference: string): string {
  const match = conference.match(/(?:In Proc\. of |)(.+?)(?:,|\s+\d{4}|$)/);
  if (match) {
    const venue = match[1].trim();
    const yearMatch = conference.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : '';
    return year ? `${venue} ${year}` : venue;
  }
  return conference;
}

/**
 * Get paper year, returns empty string if not available
 */
export function getYear(paper: Paper): string {
  return paper.year || '';
}

/**
 * Generate BibTeX citation for a paper
 */
export function generateBibtex(paper: Paper): string {
  if (paper.nobibtex) return '';

  const authorList = paper.authors.map(id => getAuthorName(id)).join(' and ');
  const type = paper.institution ? 'techreport' : 'inproceedings';

  let bibtex = `@${type}{${paper.proceedings || 'ref'},\n`;
  bibtex += `  author = {${authorList}},\n`;
  bibtex += `  title = {${paper.textitle || paper.title}},\n`;

  if (paper.booktitle) {
    bibtex += `  booktitle = {${paper.booktitle}},\n`;
  }
  if (paper.institution) {
    bibtex += `  institution = {${paper.institution}},\n`;
  }
  if (paper.year) {
    bibtex += `  year = {${paper.year}}\n`;
  }

  bibtex += '}';
  return bibtex;
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
