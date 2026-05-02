/* App shell + Tweaks */

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "paper",
  "typePair": "source-serif",
  "density": "comfortable",
  "accentHue": 30,
  "showDropCap": true
}/*EDITMODE-END*/;

const TYPE_PAIRS = {
  "source-serif": {
    label: "Source Serif",
    serif: "'Source Serif 4', Georgia, serif",
    sans:  "'Inter Tight', system-ui, sans-serif",
    mono:  "'JetBrains Mono', ui-monospace, monospace",
    google: "Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500",
  },
  "eb-garamond": {
    label: "EB Garamond",
    serif: "'EB Garamond', Garamond, serif",
    sans:  "'Inter Tight', system-ui, sans-serif",
    mono:  "'JetBrains Mono', ui-monospace, monospace",
    google: "EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500",
  },
  "newsreader": {
    label: "Newsreader",
    serif: "'Newsreader', Georgia, serif",
    sans:  "'Inter Tight', system-ui, sans-serif",
    mono:  "'JetBrains Mono', ui-monospace, monospace",
    google: "Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500",
  },
};

function ensureFonts(pairKey) {
  const pair = TYPE_PAIRS[pairKey];
  if (!pair) return;
  const id = `gf-${pairKey}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${pair.google}&display=swap`;
  document.head.appendChild(link);
}

function applyTweaks(t) {
  document.documentElement.setAttribute("data-theme", t.theme);
  document.documentElement.setAttribute("data-density", t.density);
  const pair = TYPE_PAIRS[t.typePair] || TYPE_PAIRS["source-serif"];
  ensureFonts(t.typePair);
  document.documentElement.style.setProperty("--serif", pair.serif);
  document.documentElement.style.setProperty("--sans",  pair.sans);
  document.documentElement.style.setProperty("--mono",  pair.mono);
  // Accent hue overrides
  if (t.theme === "paper" || t.theme === "slate") {
    document.documentElement.style.setProperty("--accent", `oklch(0.40 0.08 ${t.accentHue})`);
    document.documentElement.style.setProperty("--accent-soft", `oklch(0.55 0.08 ${t.accentHue})`);
  } else {
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-soft");
  }
  // Drop cap
  document.documentElement.style.setProperty(
    "--dropcap-display",
    t.showDropCap ? "block" : "none"
  );
}

function App() {
  const [route, setRoute] = useState(() => {
    const h = (window.location.hash || "").replace(/^#\/?/, "");
    return h === "publications" ? "pubs" : "home";
  });
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : useTweaksFallback(TWEAK_DEFAULTS);

  useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  useEffect(() => {
    window.location.hash = route === "pubs" ? "#/publications" : "#/";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  return (
    <>
      <div className="shell" data-screen-label={route === "pubs" ? "Publications" : "Home"}>
        {route === "home" ? <HomePage setRoute={setRoute} /> : <PublicationsPage setRoute={setRoute} />}
      </div>
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

// Lightweight fallback if hook isn't loaded
function useTweaksFallback(defaults) {
  const [t, setT] = useState(defaults);
  const set = (k, v) => {
    setT((prev) => {
      const next = typeof k === "object" ? { ...prev, ...k } : { ...prev, [k]: v };
      try {
        window.parent.postMessage({ type: "__edit_mode_set_keys", edits: typeof k === "object" ? k : { [k]: v } }, "*");
      } catch (e) {}
      return next;
    });
  };
  return [t, set];
}

function TweaksUI({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Atmosphere">
        <TweakRadio
          label="Paper"
          value={tweaks.theme}
          onChange={(v) => setTweak("theme", v)}
          options={[
            { value: "paper", label: "Paper" },
            { value: "bone",  label: "Bone" },
            { value: "slate", label: "Slate" },
            { value: "ink",   label: "Ink" },
          ]}
        />
        <TweakRadio
          label="Density"
          value={tweaks.density}
          onChange={(v) => setTweak("density", v)}
          options={[
            { value: "compact",     label: "Compact" },
            { value: "comfortable", label: "Comfort" },
            { value: "spacious",    label: "Airy" },
          ]}
        />
      </TweakSection>

      <TweakSection title="Type">
        <TweakSelect
          label="Pairing"
          value={tweaks.typePair}
          onChange={(v) => setTweak("typePair", v)}
          options={Object.entries(TYPE_PAIRS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
        <TweakToggle
          label="Drop cap"
          value={tweaks.showDropCap}
          onChange={(v) => setTweak("showDropCap", v)}
        />
      </TweakSection>

      <TweakSection title="Accent">
        <TweakSlider
          label="Hue"
          value={tweaks.accentHue}
          min={0} max={360} step={1}
          onChange={(v) => setTweak("accentHue", v)}
          unit="°"
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
