/**
 * Client-side state for the publications page:
 *  - per-paper Abstract / BibTeX toggle panels
 *  - filter chips (All / Refereed / Tech Reports) + free-text search
 *  - deep-link hash highlight
 *
 * Filter and search compose: a row is visible only when it matches both, and
 * either input clears together via state recompute (so changing the filter
 * doesn't strand a stale search match). Hits the DOM by toggling `[hidden]`
 * on `.tl-row` so a11y trees stay in sync. The first-visible row gets a
 * `.is-first` class so the heavier top rule moves with filtering instead of
 * sitting under a hidden row.
 */

type Filter = 'all' | 'refereed' | 'technical';

interface State {
  filter: Filter;
  query: string;
}

const state: State = { filter: 'all', query: '' };

const labelByPanelType: Record<string, string> = {
  abstract: 'Abstract',
  bibtex: 'BibTeX',
};

const VALID_FILTERS = new Set<Filter>(['all', 'refereed', 'technical']);

const isFilter = (v: string): v is Filter => (VALID_FILTERS as Set<string>).has(v);

function rows(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.tl-row'));
}

function rowMatches(row: HTMLElement): boolean {
  if (state.filter !== 'all' && row.dataset.type !== state.filter) return false;
  if (!state.query) return true;
  return (row.textContent || '').toLowerCase().includes(state.query);
}

function applyVisibility() {
  let firstVisible: HTMLElement | null = null;
  let visible = 0;
  rows().forEach(row => {
    const ok = rowMatches(row);
    row.toggleAttribute('hidden', !ok);
    row.classList.remove('is-first');
    if (ok) {
      visible++;
      if (!firstVisible) firstVisible = row;
    }
  });
  firstVisible?.classList.add('is-first');

  const empty = document.querySelector<HTMLElement>('.pub-empty');
  if (empty) empty.toggleAttribute('hidden', visible > 0);
}

function setCounts() {
  const all = rows();
  const counts = {
    all: all.length,
    refereed: all.filter(r => r.dataset.type === 'refereed').length,
    technical: all.filter(r => r.dataset.type === 'technical').length,
  };
  document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
    const k = el.dataset.count as keyof typeof counts | undefined;
    if (k && k in counts) el.textContent = String(counts[k]);
  });
}

function setFilter(f: Filter) {
  state.filter = f;
  document.querySelectorAll<HTMLElement>('.chip').forEach(chip => {
    const active = chip.dataset.filter === f;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-checked', String(active));
  });
  applyVisibility();
}

function setQuery(q: string) {
  state.query = q.trim().toLowerCase();
  applyVisibility();
}

function initFilters() {
  document.querySelectorAll<HTMLElement>('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const v = chip.dataset.filter;
      if (v && isFilter(v)) setFilter(v);
    });
  });
}

function initSearch() {
  const input = document.getElementById('pub-search') as HTMLInputElement | null;
  if (!input) return;
  let timer: number | undefined;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => setQuery(input.value), 120);
  });
}

function initToggles() {
  document.querySelectorAll<HTMLElement>('[data-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-toggle');
      if (!type) return;
      const paper = button.closest<HTMLElement>('.tl-paper');
      const panel = paper?.querySelector<HTMLElement>(`[data-panel="${type}"]`);
      if (!panel) return;

      const isOpen = !panel.hasAttribute('hidden');
      panel.toggleAttribute('hidden', isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
      button.textContent = isOpen ? labelByPanelType[type] || type : 'Hide';
    });
  });
}

function highlightFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target?.classList.contains('tl-paper')) return;

  // Clear any filter/search that would hide the deep-linked row, so the
  // highlight actually lands somewhere visible.
  const row = target.closest<HTMLElement>('.tl-row');
  const type = row?.dataset.type;
  if (state.filter !== 'all' && type && state.filter !== type) {
    setFilter('all');
  }
  if (state.query) {
    const input = document.getElementById('pub-search') as HTMLInputElement | null;
    if (input) input.value = '';
    setQuery('');
  }

  target.classList.remove('highlight');
  void target.offsetWidth;
  target.classList.add('highlight');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function init() {
  setCounts();
  initFilters();
  initSearch();
  initToggles();
  applyVisibility();
  highlightFromHash();
  window.addEventListener('hashchange', highlightFromHash);
}

init();
