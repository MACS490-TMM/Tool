package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type Criterion struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Explanation string `json:"explanation"`
}

type Submission struct {
	Criteria []Criterion `json:"criteria"`
}

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

func criteriaHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method is not supported.", http.StatusMethodNotAllowed)
		return
	}
	fmt.Println(r.Method)

	var submission Submission
	err := json.NewDecoder(r.Body).Decode(&submission)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Log the received criteria, or process them as needed
	log.Printf("Received criteria: %+v", submission)

	// Respond to the client
	w.WriteHeader(http.StatusOK)
	err2 := json.NewEncoder(w).Encode(struct{ Message string }{"Submission successful"})
	if err2 != nil {
		return
	}
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/items/{id}", itemHandler)
	mux.HandleFunc("/files/{path}", filesHandler)
	mux.HandleFunc("/criteria", criteriaHandler) // Set the path to match your React app's request

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		return
	}
}
