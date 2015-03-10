package main

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
)

type requestMapper map[string]func(http.ResponseWriter, *http.Request)

var request_mux requestMapper

type myHandler struct{}

type Page struct {
	Title string
}

func basicHandle(w http.ResponseWriter, r *http.Request) {
	p := &Page{Title: "My Index"}
	t, _ := template.ParseFiles("index.html", "body.html")
	err := t.Execute(w, p)
	if err != nil {
		fmt.Println(err)
		return
	}

	io.WriteString(w, "Loaded: "+r.URL.String())
}

func (*myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if handle, ok := request_mux[r.URL.String()]; !ok {
		io.WriteString(w, "Uh, oh! Couldn't find "+r.URL.String())
		return
	} else {
		handle(w, r)
	}
}

func main() {
	http_port := "8000"
	request_mux = requestMapper{
		"/":      basicHandle,
		"/index": basicHandle}

	server := http.Server{
		Addr:    ":" + http_port,
		Handler: &myHandler{},
	}

	fmt.Println("Listening on port " + http_port)
	server.ListenAndServe()
}
