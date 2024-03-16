package handler

import (
	"api/internal/domain"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func CriteriaHandler(w http.ResponseWriter, r *http.Request) {
	EnableCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method is not supported.", http.StatusMethodNotAllowed)
		return
	}
	fmt.Println(r.Method)

	var submission domain.Submission
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

func GetCriteriaHandler(w http.ResponseWriter, r *http.Request) {
	EnableCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method is not supported.", http.StatusMethodNotAllowed)
		return
	}

	// TODO - Change to fetch data from database
	criteriaList := []domain.Criterion{
		{ID: 1, Name: "Security", Explanation: "Explanation for Security"},
		{ID: 2, Name: "Usability", Explanation: "Explanation for Usability"},
		{ID: 3, Name: "Reliability", Explanation: "Explanation for Reliability"},
		{ID: 4, Name: "Portability", Explanation: "Explanation for Portability"},
		// Add other criteria as needed
	}

	// Respond with the criteria list
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(criteriaList)
	if err != nil {
		http.Error(w, "Failed to encode criteria list", http.StatusInternalServerError)
	}
}
