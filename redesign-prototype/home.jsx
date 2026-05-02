/* Home page component */

const { useEffect } = React;

function HomePage({ setRoute }) {
  return (
    <div className="page">
      <TopBar route="home" setRoute={setRoute} />

      <header className="hero">
        <div className="hero-text">
          <h1><span className="given">Joel</span><em>Weinberger</em></h1>
          <p className="hero-lede">
            Security engineer in Los Angeles. I focus on the security of how we build systems — web platform security, supply‑chain security, and developer security.
          </p>
        </div>
        <img src="assets/headshot.jpg" alt="Joel Weinberger" className="headshot" width="140" />
      </header>

      <section className="section" id="about">
        <div className="section-label">
          <h2>About</h2>
          <span className="meta">Bio</span>
        </div>
        <div className="prose">
          <p>
            <span className="lede-word">Currently</span>, I work on security engineering at <a href="https://www.anthropic.com">Anthropic</a>. Previously, I led security engineering at <a href="https://www.lightspark.com/">Lightspark</a> and managed supply‑chain security at <a href="https://www.snap.com">Snap</a>. Before that, I was on the <a href="https://www.chromium.org/Home/chromium-security">Chrome Security</a> team at Google.
          </p>
          <p>
            I hold a Ph.D. from <a href="https://www.berkeley.edu/">UC Berkeley</a>, where I worked with <a href="https://www.cs.berkeley.edu/~dawnsong/">Dawn Song</a> on web application security — making the web safer through better security policies and analysis tools. Our group's work lives at <a href="https://webblaze.cs.berkeley.edu/">WebBlaze</a>.
          </p>
          <p>
            Earlier still, B.S. and M.S. from <a href="https://www.brown.edu">Brown University</a>, with stops at Sun Microsystems and Microsoft Research along the way.
          </p>
        </div>
      </section>

      <FeaturedPubs setRoute={setRoute} />

      <section className="section" id="outside">
        <div className="section-label">
          <h2>Outside work</h2>
          <span className="meta">Personal</span>
        </div>
        <div className="prose">
          <p>
            Most of my time outside work is spent with my three kids and wonderful wife. I run to decompress, and I <a href="https://www.mammothmountain.com">ski</a>, snowboard, and surf whenever possible (bless SoCal weather and geography). I still <a href="https://www.touchstoneclimbing.com">rock climb</a> occasionally, though not as much as I'd like — and I am a nearly life‑long tap dancer.
          </p>
          <p>
            My main entertainment is <a href="https://www.goodreads.com/user/show/3465980-joel-weinberger">reading</a> and a bit of video gaming. As a historical drop, you can view a <a href="#">retrospective on my wedding</a>.
          </p>
          <p style={{ fontSize: "0.92rem", color: "var(--ink-faint)" }}>
            For nostalgia: my <a href="#">old Brown CS homepage</a> from a previous internet.
          </p>
        </div>
      </section>

      <Colophon />
    </div>
  );
}

function TopBar({ route, setRoute }) {
  return (
    <div className="topbar">
      <a href="#" className="marque" onClick={(e) => { e.preventDefault(); setRoute("home"); }}>
        jww
      </a>
      <nav>
        <a href="#" aria-current={route === "home" ? "page" : undefined}
           onClick={(e) => { e.preventDefault(); setRoute("home"); }}>Home</a>
        <a href="#" aria-current={route === "pubs" ? "page" : undefined}
           onClick={(e) => { e.preventDefault(); setRoute("pubs"); }}>Publications</a>
        <a href="resume.pdf" target="_blank" rel="noopener">Résumé</a>
        <a href="https://github.com/joelweinberger" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </div>
  );
}

function FeaturedPubs({ setRoute }) {
  // Featured papers (homepage highlights) + the W3C SRI spec
  const featured = window.PAPERS.filter((p) => p.featured)
    .concat(window.SPECS)
    .sort((a, b) => b.year - a.year);

  return (
    <section className="section" id="work">
      <div className="section-label prominent">
        <h2>Publications</h2>
      </div>

      <ul className="pub-list dense">
        {featured.map((p) => (
          <li key={p.id} className="pub">
            <div className="pub-year">{p.year}</div>
            <div className="pub-body">
              <h3 className="pub-title">
                <a href={p.pdf.startsWith("http") ? p.pdf : "#"} target="_blank" rel="noopener">{p.title}</a>
                <span className="pub-venue-inline">{p.venue}</span>
              </h3>
              {p.authors && p.authors.length > 1 && (
                <p className="pub-meta">{window.formatAuthors(p.authors)}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <a className="see-more" href="#" onClick={(e) => { e.preventDefault(); setRoute("pubs"); }}>
        All publications
      </a>
    </section>
  );
}

function Colophon() {
  return (
    <footer className="colophon">
      <a href="https://www.newarknj.gov/" className="newark-link" rel="noopener">
        <img src="assets/newark.jpg" alt="Greetings from Newark, NJ!" className="newark-img-plain" />
      </a>

      <nav className="colophon-links">
        <a href="mailto:jww@joelweinberger.us">Email</a>
        <a href="https://github.com/joelweinberger">GitHub</a>
        <a href="https://www.linkedin.com/in/joelweinberger">LinkedIn</a>
        <a href="https://twitter.com/metromoxie">Twitter</a>
        <a href="#">Calendar</a>
      </nav>
      <p className="colophon-credit">
        <a href="https://github.com/joelweinberger/personal-website">Source on GitHub</a>
      </p>
    </footer>
  );
}

window.HomePage = HomePage;
window.TopBar = TopBar;
window.Colophon = Colophon;
