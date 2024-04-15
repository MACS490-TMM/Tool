package handler

import (
	"api/internal/domain"
	"api/internal/service"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type CriteriaScoringHandler struct {
	Service service.CriteriaScoringService
}

// GetCriteriaScores is an HTTP handler that returns a list of criteria scores.
func (h *CriteriaScoringHandler) GetCriteriaScores(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	projectIDString := req.PathValue("projectId")

	criterionIDString := req.PathValue("criterionId")

	projectID, projectIDErr := strconv.Atoi(projectIDString)
	if projectIDErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	criterionID, criterionIDErr := strconv.Atoi(criterionIDString)
	if criterionIDErr != nil {
		http.Error(w, "Invalid criterion ID", http.StatusBadRequest)
		return
	}

	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	criteriaScores, getCriteriaScoresErr := h.Service.GetSpecificCriteriaScores(projectID, criterionID)
	if getCriteriaScoresErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting decision makers: %v", getCriteriaScoresErr)

		http.Error(w, getCriteriaScoresErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(criteriaScores)
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

func (h *CriteriaScoringHandler) AddCriteriaScores(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	projectIDString := req.PathValue("projectId")

	decisionMakerIDString := req.PathValue("decisionMakerId")

	projectID, projectIDErr := strconv.Atoi(projectIDString)
	if projectIDErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	decisionMakerID, decisionMakerIDErr := strconv.Atoi(decisionMakerIDString)
	if decisionMakerIDErr != nil {
		http.Error(w, "Invalid decision maker ID", http.StatusBadRequest)
		return
	}

	if req.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var criteriaScores []domain.CriterionScore // ProjectID, CriterionID, DecisionMakerID, Score, TextExtracted, Comments
	if err := json.NewDecoder(req.Body).Decode(&criteriaScores); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	for i := range criteriaScores {
		criteriaScores[i].ProjectID = projectID
	}

	err := h.Service.AddOrUpdateCriteriaScores(projectID, decisionMakerID, criteriaScores)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	// It might be more appropriate to return the updated list of scores, but that depends on your service logic.
	if encodeErr := json.NewEncoder(w).Encode(criteriaScores); encodeErr != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
