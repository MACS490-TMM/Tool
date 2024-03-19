package handler

import (
	"api/internal/domain"
	"encoding/json"
	"net/http"
	"time"
)

func FilesHandler(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)
	path := req.PathValue("path")

	// Simulating data retrieval
	file := domain.File{Path: path} // Replace with actual data retrieval logic

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
