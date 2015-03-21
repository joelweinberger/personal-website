package main

import (
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"
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
	Authors      []Author
	Citeseer     string
	Conference   string
	Extended     string
	Homepage     string
	Notes        string
	Path         string
	Presentation string
	Title        string
}

type PubPage struct {
	Page
	Papers      []Paper
	TechReports []Paper
}

var pages map[string]Page = map[string]Page{
	"calendar.html": BasicPage{
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
	"index.html": BasicPage{
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
	"publications.html": PubPage{
		Page: BasicPage{
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
				Authors:      []Author{Author{Homepage: "", Name: "Joel"}},
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
	"wedding.html": BasicPage{
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

	funcMap := template.FuncMap{"markdown": markdowner}
	templates = make(map[string]*template.Template)
	for name, _ := range pages {
		templates[name] = template.Must(template.New("page.html").Funcs(funcMap).ParseFiles("templates/layout.html", "templates/"+name))
	}

	server := http.Server{
		Addr:    ":" + http_port,
		Handler: &myHandler{},
	}

	fmt.Println("Listening on port " + http_port)
	server.ListenAndServe()
}
