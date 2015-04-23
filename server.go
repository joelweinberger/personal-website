package main

import (
	"encoding/json"
	"fmt"
	"github.com/russross/blackfriday"
	"html/template"
	"io/ioutil"
	"net"
	"net/http"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

var http_port string = "8001"
var https_port string = "8000"

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
	Pubs         *PubsInfo
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
	Institution  string
	Notes        string
	Number       string
	Path         string
	Pdf          string
	Presentation string
	Proceedings  string
	Textitle     string
	Title        string
	Url          string
	Year         string
}

type PubPage struct {
	BasicPage
	Papers      []Paper
	TechReports []Paper
}

type AbstractPage struct {
	BasicPage
	Abstract string
	Title    string
	NoLayout bool
}

type BibtexPage struct {
	BasicPage
	Authors     string
	Booktitle   string
	Citeseer    string
	Conference  string
	Institution string
	Number      string
	Pdf         string
	Proceedings string
	Textitle    string
	Title       string
	Url         string
	Year        string
	NoLayout    bool
}

var pages map[string]*BasicPage = map[string]*BasicPage{
	"abstract.html": &BasicPage{
		ExtraCSS: []string{
			"/css/generic/basic-page.css",
			"/css/generic/header.css",
		},
		ExtraMeta:    []MetaTag{},
		ExtraScripts: []string{},
		Header:       "jww (at) joelweinberger (dot) us -- abstract",
		NoContent:    false,
		Title:        "Joel H. W. Weinberger -- Paper Abstract",
	},
	"bibtex.html": &BasicPage{
		ExtraCSS: []string{
			"/css/generic/basic-page.css",
			"/css/generic/header.css",
		},
		ExtraMeta:    []MetaTag{},
		ExtraScripts: []string{},
		Header:       "jww (at) joelweinberger (dot) us -- bibtex",
		NoContent:    false,
		Title:        "Joel H. W. Weinberger -- Paper BibTeX",
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
	"publications.html": &BasicPage{
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
		Pubs:       loadPubsInfo(),
		Title:      "Joel H. W. Weinberger -- Publications",
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
var abstractTemplate *template.Template
var bibtexTemplate *template.Template

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

func abstractHandle(isAjax bool, w http.ResponseWriter, r *http.Request) {
	pubError := func(url string, msg string) {
		fmt.Println("Error extracting pub number from URL \"", url, "\": ", msg)
	}

	var abstract string
	if isAjax {
		abstract = strings.TrimPrefix(r.URL.Path, "/ajax/abstracts/")
	} else {
		abstract = strings.TrimPrefix(r.URL.Path, "/abstracts/")
	}

	fmt.Println("Serving abstract ", abstract)

	var info *PubsInfo
	if info = loadPubsInfo(); info == nil {
		// loadPubsInfo() prints an appropriate error message, so no need to
		// print one here as well.
		http.NotFound(w, r)
		return
	}

	paperArray := info.Papers
	var validPub = regexp.MustCompile(`\/abstracts\/pub([0-9]+)`)
	groups := validPub.FindStringSubmatch(r.URL.Path)
	if len(groups) < 2 {
		paperArray = info.Techs
		validPub = regexp.MustCompile(`\/abstracts\/tech([0-9]+)`)
		groups = validPub.FindStringSubmatch(r.URL.Path)

		if len(groups) < 2 {
			pubError(r.URL.Path, "No number present")
			http.NotFound(w, r)
			return
		}
	}

	var index int
	var err error
	if index, err = strconv.Atoi(groups[1]); err != nil {
		pubError(r.URL.Path, "Not a number")
		http.NotFound(w, r)
		return
	}

	if index >= len(paperArray) {
		pubError(r.URL.Path, "Pub doesn't exist")
		http.NotFound(w, r)
		return
	}

	abstractPage := AbstractPage{
		BasicPage: *pages["abstract.html"],
		Abstract:  paperArray[index].Abstract,
		Title:     paperArray[index].Title,
		NoLayout:  isAjax,
	}
	if isAjax {
		abstractTemplate.Execute(w, abstractPage)
	} else {
		err = templates["abstract.html"].Execute(w, abstractPage)
	}

	if err != nil {
		fmt.Println(err)
		http.NotFound(w, r)
		return
	}
}

func bibtexHandle(isAjax bool, w http.ResponseWriter, r *http.Request) {
	pubError := func(url string, msg string) {
		fmt.Println("Error extracting pub number from URL \"", url, "\": ", msg)
	}

	var bibtex string
	if isAjax {
		bibtex = strings.TrimPrefix(r.URL.Path, "/ajax/bibtexs/")
	} else {
		bibtex = strings.TrimPrefix(r.URL.Path, "/bibtexs/")
	}

	fmt.Println("Serving bibtex ", bibtex)

	var info *PubsInfo
	if info = loadPubsInfo(); info == nil {
		// loadPubsInfo() prints an appropriate error message, so no need to
		// print one here as well.
		http.NotFound(w, r)
		return
	}

	paperArray := info.Papers
	var validPub = regexp.MustCompile(`\/bibtexs\/pub([0-9]+)`)
	groups := validPub.FindStringSubmatch(r.URL.Path)
	if len(groups) < 2 {
		paperArray = info.Techs
		validPub = regexp.MustCompile(`\/bibtexs\/tech([0-9]+)`)
		groups = validPub.FindStringSubmatch(r.URL.Path)

		if len(groups) < 2 {
			pubError(r.URL.Path, "No number present")
			http.NotFound(w, r)
			return
		}
	}

	var index int
	var err error
	if index, err = strconv.Atoi(groups[1]); err != nil {
		pubError(r.URL.Path, "Not a number")
		http.NotFound(w, r)
		return
	}

	if index >= len(paperArray) {
		pubError(r.URL.Path, "Pub doesn't exist")
		http.NotFound(w, r)
		return
	}

	var authors string
	for j, author := range paperArray[index].Authors {
		if j != 0 {
			authors = authors + " and "
		}
		authors = authors + info.Authors[author].Name
	}

	bibtexPage := BibtexPage{
		BasicPage:   *pages["bibtex.html"],
		Authors:     authors,
		Booktitle:   paperArray[index].Booktitle,
		Citeseer:    paperArray[index].Citeseer,
		Conference:  paperArray[index].Conference,
		Institution: paperArray[index].Institution,
		Number:      paperArray[index].Number,
		Pdf:         paperArray[index].Pdf,
		Proceedings: paperArray[index].Proceedings,
		Textitle:    paperArray[index].Textitle,
		Title:       paperArray[index].Title,
		Url:         paperArray[index].Url,
		Year:        paperArray[index].Year,
		NoLayout:    isAjax,
	}
	if isAjax {
		bibtexTemplate.Execute(w, bibtexPage)
	} else {
		err = templates["bibtex.html"].Execute(w, bibtexPage)
	}

	if err != nil {
		fmt.Println(err)
		http.NotFound(w, r)
		return
	}
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
			abstractHandle(false, w, r)
			return
		}

		if strings.Index(path, "/ajax/abstracts/") == 0 {
			abstractHandle(true, w, r)
			return
		}

		if strings.Index(path, "/bibtexs/") == 0 {
			bibtexHandle(false, w, r)
			return
		}

		if strings.Index(path, "/ajax/bibtexs/") == 0 {
			bibtexHandle(true, w, r)
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

func markdowner(args ...interface{}) template.HTML {
	s := blackfriday.MarkdownCommon([]byte(fmt.Sprintf("%s", args...)))
	return template.HTML(s)
}

func redirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	host, _, err := net.SplitHostPort(r.Host)
	if err != nil {
		fmt.Println("Unexpected error in splitting host and port in: ", r.URL)
		return
	}
	redirect_url := *r.URL
	redirect_url.Scheme = "https"
	redirect_url.Host = host + ":" + https_port
	fmt.Println("Redirecting '", r.URL.String(), "' to '", redirect_url.String(), "'")
	http.Redirect(w, r, redirect_url.String(), http.StatusMovedPermanently)
}

func main() {
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

	abstractTemplateBytes, err := ioutil.ReadFile("templates/abstract.html")
	if err != nil {
		panic("Could not read abstract.html template")
	}
	abstractTemplate = template.Must(template.New("abstract").Funcs(funcMap).Parse(string(abstractTemplateBytes)))

	bibtexTemplateBytes, err := ioutil.ReadFile("templates/bibtex.html")
	if err != nil {
		panic("Could not read bibtex.html template")
	}
	bibtexTemplate = template.Must(template.New("bibtex").Funcs(funcMap).Parse(string(bibtexTemplateBytes)))

	server := http.Server{
		Addr:    ":" + https_port,
		Handler: &myHandler{},
	}

	// The HTTP server is strictly for redirecting to HTTPS.
	go http.ListenAndServe(":"+http_port, http.HandlerFunc(redirectToHTTPS))

	fmt.Println("Listening on port " + https_port)
	if err := server.ListenAndServeTLS("cert/ssl.crt", "cert/ssl.key"); err != nil {
		fmt.Println("ListenAndServe error: %v", err)
		return
	}
}
