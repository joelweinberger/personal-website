package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

type requestMapper map[string]func(http.ResponseWriter, *http.Request)

var request_mux requestMapper

type myHandler struct{}

type MetaTag struct {
	Content     string
	Description string
}

type Page interface{}

type BasicPage struct {
	ExtraCSS     []string
	ExtraMeta    []MetaTag
	ExtraScripts []string
	Header       string
	NoContent    bool
	NoHomeLink   bool
	Title        string
}

type Author struct {
	Homepage string
	Name     string
}

type Paper struct {
	Abstract     string
	Authors      []string
	Booktitle    string
	Citeseer     string
	Conference   string
	Extended     string
	Homepage     string
	Notes        string
	Path         string
	Pdf          string
	Presentation string
	Proceedings  string
	Texttitle    string
	Title        string
	Year         string
}

type PubPage struct {
	BasicPage
	Papers      []Paper
	TechReports []Paper
}

var pages map[string]Page = map[string]Page{
	"abstract.html": &BasicPage{
		ExtraCSS: []string{
			"/css/page/basic-page.css",
			"/css/page/header.css",
		},
		ExtraMeta:    []MetaTag{},
		ExtraScripts: []string{},
		Header:       "abstract",
		NoContent:    false,
		Title:        "Joel H. W. Weinberger -- Paper Abstract",
	},
	"calendar.html": &BasicPage{
		ExtraCSS: []string{
			"/css/page/calendar.css",
		},
		ExtraMeta:    []MetaTag{},
		ExtraScripts: []string{},
		Header:       "",
		NoContent:    true,
		NoHomeLink:   true,
		Title:        "Joel H. W. Weinberger -- Calendar",
	},
	"index.html": &BasicPage{
		ExtraCSS: []string{
			"/css/generic/basic-page.css",
			"/css/generic/header.css",
			"/css/page/index.css",
		},
		ExtraMeta:    []MetaTag{},
		ExtraScripts: []string{},
		Header:       "jww (at) joelweinberger (dot) us",
		NoContent:    false,
		NoHomeLink:   true,
		Title:        "Joel H. W. Weinberger -- jww",
	},
	"publications.html": &PubPage{
		BasicPage: BasicPage{
			ExtraCSS: []string{
				"/css/generic/basic-page.css",
				"/css/generic/header.css",
				"/css/page/index.css",
			},
			ExtraMeta: []MetaTag{},
			ExtraScripts: []string{
				"/lib/jquery.min.js",
				"/js/index.js",
			},
			Header:     "publications",
			NoContent:  false,
			NoHomeLink: false,
			Title:      "Joel H. W. Weinberger -- Publications",
		},
		Papers: []Paper{
			Paper{
				//authors:      []Author{Author{homepage: "", name: "Joel"}},
				Authors:      []string{"abarth"},
				Citeseer:     "",
				Conference:   "USENIX somethearuther",
				Extended:     "",
				Notes:        "",
				Path:         "test.pdf",
				Presentation: "",
				Title:        "hullo",
			},
		},
		TechReports: []Paper{},
	},
	"wedding.html": &BasicPage{
		ExtraCSS: []string{
			"/css/generic/basic-page.css",
			"/css/generic/header.css",
			"/css/page/index.css",
		},
		ExtraMeta:    []MetaTag{},
		ExtraScripts: []string{},
		Header:       "wedding",
		NoContent:    false,
		NoHomeLink:   false,
		Title:        "Joel H. W. Weinberger -- Wedding",
	},
}

var templates map[string]*template.Template

func generateBasicHandle(page string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := templates[page].Execute(w, pages[page])

		if err != nil {
			fmt.Println(err)
			return
		}
	}
}

func generateRedirectHandle(dst string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/blog")
		fmt.Println("Redirecting to ", dst+path)
		http.Redirect(w, r, dst+path, 301)
	}
}

var blogRedirectHandle func(http.ResponseWriter, *http.Request) = generateRedirectHandle("http://blog.joelweinberger.us")

type PubsInfo struct {
	Authors map[string]Author
	Papers  []Paper
	Techs   []Paper
}

func loadPubsInfo() *PubsInfo {
	jsonBlob, err := ioutil.ReadFile("pubs.json")

	if err != nil {
		fmt.Println("Error loading pubs.json: ", err)
		return nil
	}

	var pubs PubsInfo
	err = json.Unmarshal(jsonBlob, &pubs)
	if err != nil {
		fmt.Println("Error unmarshaling JSON:", err)
		return nil
	}

	return &pubs
}

func abstractHandle(w http.ResponseWriter, r *http.Request) {
	abstract := strings.TrimPrefix(r.URL.Path, "/abstracts/")
	fmt.Println("Serving abstract ", abstract)

	var info *PubsInfo
	if info = loadPubsInfo(); info == nil {
		// loadPubsInfo prints an appropriate error message
		return
	}

	var validPub = regexp.MustCompile(`\/abstracts\/pub([0-9]+)`)
	groups := validPub.FindStringSubmatch(r.URL.Path)
	if len(groups) < 2 {
		fmt.Println("Error extracting pub number from URL (no number present)")
		return
	}

	var index int
	var err error
	if index, err = strconv.Atoi(groups[1]); err != nil {
		fmt.Println("Error extracting pub number from URL (not a number)")
		return
	}

	fmt.Println(info.Papers[index].Abstract)
	err = templates["/abstract.html"].Execute(w, pages["/abstract.html"])

	if err != nil {
		fmt.Println(err)
		return
	}
}

func bibtexHandle(w http.ResponseWriter, r *http.Request) {
	bibtex := strings.TrimPrefix(r.URL.Path, "/bibtexs/")
	fmt.Println("Serving bibtex ", bibtex)
}

func (*myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if handle, ok := request_mux[r.URL.String()]; !ok {
		path := r.URL.Path

		// For legacy reasons (namely, the original blog), we need to redirect
		// links from the original blog path to the new blog path so that old
		// permalinks still work.
		if strings.Index(path+"/", "/blog/") == 0 {
			blogRedirectHandle(w, r)
			return
		}

		// Abstracts and bibliographies are special cases because their
		// particular pages are generated dynamically.
		if strings.Index(path, "/abstracts/") == 0 {
			abstractHandle(w, r)
			return
		}

		if strings.Index(path, "/bibtexs/") == 0 {
			bibtexHandle(w, r)
			return
		}

		// All other cases are static files that need to be loaded from the
		// ./static directory.

		// The following should never be the case, so this should probably be an
		// assert, but just in case something wacky occurs, return a 404 if the
		// URL is not an absolute path.
		if !filepath.IsAbs(path) {
			http.NotFound(w, r)
			return
		}
		// The following cleanup is necessary to avoid directory traversals.
		// Since the above check makes sure that the path is absolute, this call
		// to Clean removes any ../ references so a directory traversal is not
		// possible. That is, this call treats the Path as if it is at root, and
		// removes anything that would go beyond root.
		path = filepath.Clean(path)
		fmt.Println("Serving static file ./static" + path)
		http.ServeFile(w, r, "./static"+path)
	} else {
		handle(w, r)
	}
}

// TODO: Fill this in with actual markdown conversion
func markdowner(args ...interface{}) template.HTML {
	return template.HTML("foobar")
}

func main() {
	http_port := "8000"
	request_mux = requestMapper{
		"/":             generateBasicHandle("index.html"),
		"/calendar":     generateBasicHandle("calendar.html"),
		"/index":        generateBasicHandle("index.html"),
		"/publications": generateBasicHandle("publications.html"),
		"/wedding":      generateBasicHandle("wedding.html"),
	}

	templates = make(map[string]*template.Template)
	funcMap := template.FuncMap{"markdown": markdowner}
	layout := template.Must(template.ParseFiles("templates/layout.html")).Funcs(funcMap)
	for name, _ := range pages {
		templates[name] = template.Must(template.Must(layout.Clone()).ParseFiles("templates/" + name))
	}

	server := http.Server{
		Addr:    ":" + http_port,
		Handler: &myHandler{},
	}

	fmt.Println("Listening on port " + http_port)
	server.ListenAndServe()
}
