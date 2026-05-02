/* Publications page — chronological timeline */

function PublicationsPage({ setRoute }) {
  // Group all by year
  const all = [...window.PAPERS, ...window.SPECS, ...window.TECHS]
    .sort((a, b) => b.year - a.year);

  const byYear = {};
  all.forEach((p) => {
    (byYear[p.year] = byYear[p.year] || []).push(p);
  });
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  const stats = {
    papers: window.PAPERS.length,
    specs: window.SPECS.length,
    coauthors: new Set(window.PAPERS.flatMap((p) => p.authors).filter((a) => a !== "jww")).size,
    span: `${Math.min(...all.map((p) => p.year))}–${Math.max(...all.map((p) => p.year))}`,
  };

  return (
    <div className="page pubs-page">
      <TopBar route="pubs" setRoute={setRoute} />

      <header style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
        <h1 style={{
          fontFamily: "var(--serif)",
          fontWeight: 400,
          fontSize: "clamp(2.4rem, 6vw, 3.6rem)",
          lineHeight: 1,
          letterSpacing: "-0.022em",
          margin: "0 0 1.25rem",
        }}>
          Papers, specs &amp; <em style={{ color: "var(--accent)" }}>tech reports</em>
        </h1>
        <p className="pubs-intro">
          A chronological record of work in browser security, web policy, and program verification — from grad‑school proofs to deployed standards. Most pieces are co‑authored; my collaborators do the heavy lifting.
        </p>
      </header>

      <ol className="timeline">
        {all.map((p) => (
          <li key={p.id} className="tl-row">
            <div className="year-anchor">{p.year}</div>
            <PaperEntry p={p} />
          </li>
        ))}
      </ol>

      <Colophon />
    </div>
  );
}

function PaperEntry({ p }) {
  const [openAbstract, setOpenAbstract] = React.useState(false);
  const [openBibtex, setOpenBibtex] = React.useState(false);
  const href = p.pdf.startsWith("http") ? p.pdf : "#";

  // Generate a simple BibTeX from the data we have
  const bibKey = p.id.replace(/[^a-z0-9]/gi, "");
  const authorList = (p.authors || [])
    .map((a) => window.AUTHORS[a]?.name || a)
    .join(" and ");
  const bibtex = `@inproceedings{${bibKey},
  author    = {${authorList}},
  title     = {${p.title}},
  booktitle = {${p.venueLong || p.venue}},
  year      = {${p.year}},
}`;

  return (
    <article className="tl-paper" id={p.id}>
      <h3 className="tl-title">
        <a href={href} target="_blank" rel="noopener">{p.title}</a>
      </h3>
      <p className="tl-meta">
        <span className="venue-name">{p.venueLong || p.venue}</span>
        {p.authors && p.authors.length > 1 && <> · {window.formatAuthors(p.authors)}</>}
      </p>
      <div className="tl-actions">
        <a href={href} target="_blank" rel="noopener">PDF</a>
        {p.abstract && (
          <button
            type="button"
            className="tl-toggle"
            aria-expanded={openAbstract}
            onClick={() => setOpenAbstract((v) => !v)}
          >
            {openAbstract ? "Hide" : "Abstract"}
          </button>
        )}
        {!p.nobibtex && !p.isSpec && (
          <button
            type="button"
            className="tl-toggle"
            aria-expanded={openBibtex}
            onClick={() => setOpenBibtex((v) => !v)}
          >
            {openBibtex ? "Hide" : "BibTeX"}
          </button>
        )}
      </div>
      {openAbstract && p.abstract && (
        <p className="tl-abstract">{p.abstract}</p>
      )}
      {openBibtex && (
        <pre className="tl-bibtex">{bibtex}</pre>
      )}
    </article>
  );
}

window.PublicationsPage = PublicationsPage;
