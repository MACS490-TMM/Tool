package handler

import (
	"api/internal/service"
	"encoding/json"
	"log"
	"net/http"
)

type DecisionMakerHandler struct {
	Service service.DecisionMakerService
}

func (h *DecisionMakerHandler) GetDecisionMakers(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	decisionMakers, getDecisionMakersErr := h.Service.GetDecisionMakers()

	if getDecisionMakersErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting decision makers: %v", getDecisionMakersErr)

		http.Error(w, getDecisionMakersErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(decisionMakers)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Set content type header
	w.Header().Set("Content-Type", "application/json")

	// Write JSON response
	_, err = w.Write(jsonBytes)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
