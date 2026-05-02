/**
 * Client-side state for the publications page: per-paper Abstract / BibTeX
 * toggles + deep-link hash highlight on the timeline.
 *
 * Each toggle button has `data-toggle="abstract" | "bibtex"` and is paired with
 * a sibling `[data-panel="<type>"]` panel inside the same `.tl-paper`. We flip
 * `[hidden]` rather than CSS display so the panels are also hidden from a11y
 * trees when collapsed, and update aria-expanded + the visible label in lockstep.
 */

const labelByType: Record<string, string> = {
  abstract: 'Abstract',
  bibtex: 'BibTeX',
};

function initToggles() {
  document.querySelectorAll<HTMLElement>('[data-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-toggle');
      if (!type) return;
      const paper = button.closest<HTMLElement>('.tl-paper');
      const panel = paper?.querySelector<HTMLElement>(`[data-panel="${type}"]`);
      if (!panel) return;

      const isOpen = !panel.hasAttribute('hidden');
      if (isOpen) panel.setAttribute('hidden', '');
      else panel.removeAttribute('hidden');
      button.setAttribute('aria-expanded', String(!isOpen));
      button.textContent = isOpen ? labelByType[type] || type : 'Hide';
    });
  });
}

function highlightFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target?.classList.contains('tl-paper')) return;

  // Re-trigger animation if the same hash is visited twice in a row.
  target.classList.remove('highlight');
  void target.offsetWidth;
  target.classList.add('highlight');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function init() {
  initToggles();
  highlightFromHash();
  window.addEventListener('hashchange', highlightFromHash);
}

init();
