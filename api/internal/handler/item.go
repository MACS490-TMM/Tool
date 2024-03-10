package handler

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

func ItemHandler(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)
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
