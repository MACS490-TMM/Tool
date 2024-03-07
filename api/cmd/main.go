package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type Item struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	// Add other fields as needed
}

type File struct {
	Path string `json:"path"`
	// Add other fields as needed
}

func itemHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	id := strings.TrimPrefix(r.URL.Path, "/items/")

	// Simulating data retrieval
	item := Item{ID: id, Name: "Item Name"} // Replace with actual data retrieval logic

	// Convert data to JSON
	jsonBytes, err := json.Marshal(item)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Set content type header
	w.Header().Set("Content-Type", "application/json")

	// Write JSON response
	_, err = w.Write(jsonBytes)
	if err != nil {
		return
	}
}

func filesHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	path := strings.TrimPrefix(r.URL.Path, "/files/")

	// Simulating data retrieval
	file := File{Path: path} // Replace with actual data retrieval logic

	// Convert data to JSON
	jsonBytes, err := json.Marshal(file)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Set content type header
	w.Header().Set("Content-Type", "application/json")

	// Write JSON response
	w.Write(jsonBytes)
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/items/", itemHandler)
	mux.HandleFunc("/files/", filesHandler)

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		return
	}
}
