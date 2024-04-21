package handler

import (
	"api/internal/domain"
	"api/internal/service"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type CriteriaWeightHandler struct {
	Service service.CriteriaWeightingService
}

// GetCriteriaWeights is an HTTP handler that returns a list of criteria weights.
func (h *CriteriaWeightHandler) GetCriteriaWeights(w http.ResponseWriter, req *http.Request) {
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

	criteriaWeights, getCriteriaWeightsErr := h.Service.GetSpecificCriteriaWeights(projectID, criterionID)
	if getCriteriaWeightsErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting decision makers: %v", getCriteriaWeightsErr)

		http.Error(w, getCriteriaWeightsErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(criteriaWeights)
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

func (h *CriteriaWeightHandler) AddCriteriaWeights(w http.ResponseWriter, req *http.Request) {
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

	var criteriaWeights []domain.CriterionComparison
	if err := json.NewDecoder(req.Body).Decode(&criteriaWeights); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	for i := range criteriaWeights {
		criteriaWeights[i].ProjectID = projectID
		criteriaWeights[i].DecisionMakerID = decisionMakerID
	}

	err := h.Service.AddOrUpdateCriteriaWeights(projectID, decisionMakerID, criteriaWeights)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if encodeErr := json.NewEncoder(w).Encode(criteriaWeights); encodeErr != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
