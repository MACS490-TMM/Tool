package main

import (
	"encoding/json"
	"net/http"
	"time"
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

func itemHandler(w http.ResponseWriter, req *http.Request) {
	enableCORS(w)
	id := req.PathValue("id")

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
	println(time.Now().Format("2006-01-02 15:04:05"), " Successfully sent response!")
}

func filesHandler(w http.ResponseWriter, req *http.Request) {
	enableCORS(w)
	path := req.PathValue("path")

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
	_, err = w.Write(jsonBytes)
	if err != nil {
		return
	}
	println(time.Now().Format("2006-01-02 15:04:05"), " Successfully sent response!")
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/items/{id}", itemHandler)
	mux.HandleFunc("/files/{path}", filesHandler)

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		return
	}
}
