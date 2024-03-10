package main

import (
	"api/internal/handler"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/items/{id}", handler.ItemHandler)
	mux.HandleFunc("/files/{path}", handler.FilesHandler)
	mux.HandleFunc("/criteria", handler.CriteriaHandler)
	mux.HandleFunc("/api/criteria", handler.GetCriteriaHandler)

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		return
	}
}
