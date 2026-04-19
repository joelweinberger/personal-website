/**
 * Client-side state for the publications page: filter chips, search, and
 * deep-link hash highlight. Card visibility is recomputed from state on every
 * change, so filter + search interact correctly without one clobbering the other.
 */

type Filter = 'all' | 'refereed' | 'technical';

interface State {
  activeFilter: Filter;
  searchQuery: string;
}

const state: State = {
  activeFilter: 'all',
  searchQuery: '',
};

const toggleLabels: Record<string, string> = {
  abstract: 'Abstract',
  bibtex: 'BibTeX',
};

function matchesFilter(card: HTMLElement): boolean {
  if (state.activeFilter === 'all') return true;
  return card.dataset.type === state.activeFilter;
}

function matchesSearch(card: HTMLElement): boolean {
  if (!state.searchQuery) return true;
  const text = (card.textContent || '').toLowerCase();
  return text.includes(state.searchQuery);
}

function applyVisibility() {
  document.querySelectorAll<HTMLElement>('.publication-card').forEach(card => {
    card.style.display = matchesFilter(card) && matchesSearch(card) ? '' : 'none';
  });

  document.querySelectorAll<HTMLElement>('.publications-section').forEach(section => {
    const hiddenByFilter =
      state.activeFilter !== 'all' && section.dataset.section !== state.activeFilter;
    section.style.display = hiddenByFilter ? 'none' : '';
  });
}

function setFilter(filter: Filter) {
  state.activeFilter = filter;
  document.querySelectorAll<HTMLElement>('.filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
  applyVisibility();
}

function setSearchQuery(query: string) {
  state.searchQuery = query.trim().toLowerCase();
  applyVisibility();
}

function initFilters() {
  document.querySelectorAll<HTMLElement>('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      setFilter((chip.dataset.filter || 'all') as Filter);
    });
  });
}

function initSearch() {
  const input = document.getElementById('pub-search') as HTMLInputElement | null;
  if (!input) return;
  let timer: number | undefined;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => setSearchQuery(input.value), 150);
  });
}

function initToggles() {
  document.querySelectorAll<HTMLElement>('[data-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-toggle');
      if (!type) return;
      const card = button.closest('.publication-card');
      const wrapper = card?.querySelector<HTMLElement>(`.${type}-wrapper`);
      if (!wrapper) return;

      const isOpen = wrapper.classList.contains('open');
      wrapper.classList.toggle('open');
      wrapper.setAttribute('aria-hidden', String(isOpen));
      button.setAttribute('aria-expanded', String(!isOpen));
      button.textContent = isOpen ? toggleLabels[type] || type : 'Hide';
    });
  });
}

function highlightFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target?.classList.contains('publication-card')) return;

  // Clear any filter/search that would hide the deep-linked card, so the
  // highlight actually lands somewhere visible.
  const type = (target as HTMLElement).dataset.type as Filter | undefined;
  if (state.activeFilter !== 'all' && type && state.activeFilter !== type) {
    setFilter('all');
  }
  if (state.searchQuery) {
    const input = document.getElementById('pub-search') as HTMLInputElement | null;
    if (input) input.value = '';
    setSearchQuery('');
  }

  target.classList.remove('highlight');
  void target.offsetWidth;
  target.classList.add('highlight');
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function init() {
  initFilters();
  initSearch();
  initToggles();
  highlightFromHash();
  window.addEventListener('hashchange', highlightFromHash);
}

init();
