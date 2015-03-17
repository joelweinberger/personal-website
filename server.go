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

type Page struct {
	ExtraCSS     []string
	ExtraMeta    []MetaTag
	ExtraScripts []string
	Header       string
	NoContent    bool
	NoHomeLink   bool
	Title        string
}

var pages map[string]*Page = map[string]*Page{
	"calendar.html": &Page{
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
	"index.html": &Page{
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
	"wedding.html": &Page{
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

func basicHandle(w http.ResponseWriter, r *http.Request) {
}

func generateBasicHandle(page string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body_template := "templates/" + page
		t, _ := template.ParseFiles("templates/layout.html", body_template)
		err := t.Execute(w, pages[page])

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
		fmt.Println("Serving static file ./public" + path)
		http.ServeFile(w, r, "./public"+path)
	} else {
		handle(w, r)
	}
}

func main() {
	http_port := "8000"
	request_mux = requestMapper{
		"/":         generateBasicHandle("index.html"),
		"/index":    generateBasicHandle("index.html"),
		"/calendar": generateBasicHandle("calendar.html"),
		"/wedding":  generateBasicHandle("wedding.html"),
	}

	server := http.Server{
		Addr:    ":" + http_port,
		Handler: &myHandler{},
	}

	fmt.Println("Listening on port " + http_port)
	server.ListenAndServe()
}
