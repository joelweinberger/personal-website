// Publication + author data, lifted from pubs.json
window.AUTHORS = {
  abarth: { name: "Adam Barth", homepage: "https://www.adambarth.com" },
  cgordon: { name: "Colin Gordon", homepage: "https://www.cs.drexel.edu/~csgordon/" },
  daw: { name: "David Wagner", homepage: "https://www.eecs.berkeley.edu/~daw/" },
  dawnsong: { name: "Dawn Song", homepage: "https://www.eecs.berkeley.edu/~dawnsong/" },
  devdatta: { name: "Devdatta Akhawe", homepage: "https://devd.me/" },
  felt: { name: "Adrienne Felt", homepage: "https://adrifelt.github.io/" },
  freddyb: { name: "Frederik Braun", homepage: "https://frederik-braun.com/" },
  francoism: { name: "François Marier", homepage: "https://fmarier.org/" },
  jchen: { name: "Juan Chen", homepage: "" },
  jww: { name: "Joel Weinberger" },
  livshits: { name: "Ben Livshits", homepage: "https://research.microsoft.com/en-us/um/people/livshits/" },
  lmeyerov: { name: "Leo Meyerovich", homepage: "https://lmeyerov.github.io/" },
  mfinifter: { name: "Matthew Finifter", homepage: "https://mfinifter.github.io/" },
  saxena: { name: "Prateek Saxena", homepage: "https://www.comp.nus.edu.sg/~prateeks/" },
  schlesinger: { name: "Cole Schlesinger", homepage: "https://www.cs.princeton.edu/~cschlesi/" },
  shriram: { name: "Shriram Krishnamurthi", homepage: "https://cs.brown.edu/~sk/" },
  swamy: { name: "Nikhil Swamy", homepage: "https://research.microsoft.com/en-us/people/nswamy/" },
};

window.PAPERS = [
  {
    id: "weinberger-felt",
    title: "A Week to Remember: The Impact of Browser Warning Storage Policies",
    authors: ["jww", "felt"],
    venue: "SOUPS",
    venueLong: "12th Symposium on Usable Privacy and Security",
    year: 2016,
    pdf: "papers/2016/weinberger-felt.pdf",
    featured: true,
    abstract: "When someone decides to ignore an HTTPS error warning, how long should the browser remember that decision? We evaluated six storage policies with a large-scale, multi-month field experiment and found one that achieved more of our goals than the rest. Google Chrome 45 adopted our proposal, and it has proved successful since deployed.",
    tags: ["browser security", "field study", "HTTPS"],
    impact: "Adopted by Chrome 45.",
  },
  {
    id: "swamy-weinberger-dijkstra",
    title: "Verifying Higher-order Programs with the Dijkstra Monad",
    authors: ["swamy", "jww", "schlesinger", "jchen", "livshits"],
    venue: "PLDI",
    venueLong: "34th ACM SIGPLAN Conf. on Programming Language Design and Implementation",
    year: 2013,
    pdf: "papers/2013/swamy-weinberger-schlesinger-chen-livshits.pdf",
    abstract: "A new verification methodology for higher-order stateful programs based on a monad of predicate transformers — the Dijkstra monad. Implemented for F* and used to verify JavaScript programs.",
    tags: ["verification", "F*", "JavaScript"],
  },
  {
    id: "weinberger11sanitize",
    title: "A Systematic Analysis of XSS Sanitization in Web Application Frameworks",
    authors: ["jww", "saxena", "devdatta", "mfinifter", "dawnsong"],
    venue: "ESORICS",
    venueLong: "16th European Symposium on Research in Computer Security",
    year: 2011,
    pdf: "papers/2011/weinberger-saxena-akhawe-etc.pdf",
    featured: true,
    abstract: "We systematically study the security of XSS sanitization abstractions in 14 major web frameworks and 8 large applications, and find a wide gap between framework abstractions and real-world requirements.",
    tags: ["XSS", "web frameworks", "empirical"],
  },
  {
    id: "weinberger11policies",
    title: "Towards Client-side HTML Security Policies",
    authors: ["jww", "abarth", "dawnsong"],
    venue: "HotSec",
    venueLong: "6th USENIX Workshop on Hot Topics in Security",
    year: 2011,
    pdf: "papers/2011/weinberger-barth-song.pdf",
    abstract: "An evaluation of HTML security policies — BEEP, BLUEPRINT, and Content Security Policy — with the first empirical evaluation of CSP on real applications, arguing for HTML policies as the defense of choice going forward.",
    tags: ["CSP", "policy", "web"],
  },
  {
    id: "felt11diesel",
    title: "Diesel: Applying Privilege Separation to Database Access",
    authors: ["felt", "mfinifter", "jww", "daw"],
    venue: "ASIACCS",
    venueLong: "ACM Symposium on Information, Computer and Communications Security",
    year: 2011,
    pdf: "papers/2011/felt-finifter-weinberger-wagner.pdf",
    abstract: "Database-backed applications typically grant complete database access to every part of the application. Diesel implements data separation by intercepting database queries and applying per-module restrictions.",
    tags: ["privilege separation", "databases"],
  },
  {
    id: "finifter10jssafesubsets",
    title: "Preventing Capability Leaks in Secure JavaScript Subsets",
    authors: ["mfinifter", "jww", "abarth"],
    venue: "NDSS",
    venueLong: "Network and Distributed System Security Symposium",
    year: 2010,
    pdf: "papers/2010/finifter-weinberger-barth.pdf",
    abstract: "Statically-verified safe-subset systems like ADsafe blacklist dangerous properties, but new methods on built-in prototypes can let advertisements escape the sandbox. We show one-third of the Alexa US top 100 would be exploitable, and propose a whitelist-based subset.",
    tags: ["JavaScript", "sandboxing"],
  },
  {
    id: "barth09heapgraph",
    title: "Cross-Origin JavaScript Capability Leaks: Detection, Exploitation, and Defense",
    authors: ["abarth", "jww", "dawnsong"],
    venue: "USENIX Security",
    venueLong: "18th USENIX Security Symposium",
    year: 2009,
    pdf: "papers/2009/barth-weinberger-song.pdf",
    featured: true,
    abstract: "We identify cross-origin JavaScript capability leaks — when the browser leaks a JS pointer from one security origin to another — and devise an algorithm for detecting them by monitoring the heap's points-to relation. Several new vulnerabilities found in WebKit.",
    tags: ["browser security", "WebKit", "JavaScript"],
  },
  {
    id: "gordon07asm",
    title: "Composition with Consistent Updates for Abstract State Machines",
    authors: ["cgordon", "lmeyerov", "jww", "shriram"],
    venue: "ASM Workshop",
    venueLong: "International ASM Workshop",
    year: 2007,
    pdf: "papers/2007/gordon-meyerovich-weinberger-krishnamurthi.pdf",
    abstract: "Existing notions of modularity for Abstract State Machines provide insufficiently strong consistency guarantees under parallel updates. We present a composition operator that addresses this and outline its implementation.",
    tags: ["formal methods", "ASM"],
  },
];

window.SPECS = [
  {
    id: "sri-spec",
    title: "Subresource Integrity",
    authors: ["devdatta", "freddyb", "francoism", "jww"],
    venue: "W3C Recommendation",
    venueLong: "W3C Recommendation",
    year: 2016,
    pdf: "https://www.w3.org/TR/SRI/",
    abstract: "A standardized mechanism for verifying that a fetched sub-resource has been delivered without unexpected manipulation, by comparing a cryptographic hash of the response to a value declared by the embedding document.",
    tags: ["W3C", "web standards", "integrity"],
    isSpec: true,
  },
];

window.TECHS = [
  {
    id: "weinberger-thesis-2012",
    title: "Analysis and Enforcement of Web Application Security Policies",
    authors: ["jww"],
    venue: "PhD Thesis",
    venueLong: "University of California, Berkeley — Doctoral Thesis",
    year: 2012,
    pdf: "https://www.eecs.berkeley.edu/Pubs/TechRpts/2012/EECS-2012-232.pdf",
    isThesis: true,
  },
];

window.formatAuthors = function (ids, opts = {}) {
  const exclude = opts.excludeSelf !== false;
  const names = ids
    .filter((id) => !exclude || id !== "jww")
    .map((id) => window.AUTHORS[id]?.name || id);
  if (!names.length) return "";
  if (names.length === 1) return `with ${names[0]}`;
  if (names.length === 2) return `with ${names[0]} and ${names[1]}`;
  return `with ${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};
