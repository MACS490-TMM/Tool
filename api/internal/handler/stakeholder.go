package handler

import (
	"api/internal/service"
	"encoding/json"
	"log"
	"net/http"
)

type StakeholderHandler struct {
	Service service.StakeholderService
}

func (h *StakeholderHandler) GetStakeholders(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	stakeholders, getStakeholdersErr := h.Service.GetStakeholders()

	if getStakeholdersErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting stakeholders: %v", getStakeholdersErr)

		http.Error(w, getStakeholdersErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(stakeholders)
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
