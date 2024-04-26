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

// GetAllCriteriaWeights is an HTTP handler that returns a list of all criteria and their weights.
func (h *CriteriaWeightHandler) GetAllCriteriaWeights(w http.ResponseWriter, req *http.Request) {
	projectIDString := req.PathValue("projectId")

	projectID, projectIDErr := strconv.Atoi(projectIDString)
	if projectIDErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	allCriteriaWeights, getAllCriteriaWeightsErr := h.Service.GetAllCriteriaWeights(projectID)
	if getAllCriteriaWeightsErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting decision makers: %v", getAllCriteriaWeightsErr)

		http.Error(w, getAllCriteriaWeightsErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(allCriteriaWeights)
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

// GetAllCriteriaWeightsDM is an HTTP handler that returns a list of all criteria and their weights.
func (h *CriteriaWeightHandler) GetAllCriteriaWeightsDM(w http.ResponseWriter, req *http.Request) {
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

	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	allCriteriaWeightsDM, getAllCriteriaWeightsDMErr := h.Service.GetAllCriteriaWeightsDM(projectID, decisionMakerID)
	if getAllCriteriaWeightsDMErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting decision makers: %v", getAllCriteriaWeightsDMErr)

		http.Error(w, getAllCriteriaWeightsDMErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(allCriteriaWeightsDM)
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

	projectID, projectIDErr := strconv.Atoi(projectIDString)
	if projectIDErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
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
	}

	err := h.Service.AddOrUpdateCriteriaWeights(projectID, criteriaWeights)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if encodeErr := json.NewEncoder(w).Encode(criteriaWeights); encodeErr != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (h *CriteriaWeightHandler) CheckForConflicts(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	projectIDString := req.PathValue("projectId")

	decisionMakerIdString := req.PathValue("decisionMakerId")

	projectID, projectIDErr := strconv.Atoi(projectIDString)
	if projectIDErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	decisionMakerID, decisionMakerIDErr := strconv.Atoi(decisionMakerIdString)
	if decisionMakerIDErr != nil {
		http.Error(w, "Invalid decision maker ID", http.StatusBadRequest)
		return
	}

	conflicts, err := h.Service.CheckForConflicts(projectID, decisionMakerID)
	if err != nil {
		log.Printf("Error checking for conflicts: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	jsonBytes, err := json.Marshal(conflicts)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// Write JSON response
	_, err = w.Write(jsonBytes)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (h *CriteriaWeightHandler) CheckForInconsistencies(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	projectIDString := req.PathValue("projectId")

	decisionMakerIdString := req.PathValue("decisionMakerId")

	projectID, projectIDErr := strconv.Atoi(projectIDString)
	if projectIDErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	decisionMakerID, decisionMakerIDErr := strconv.Atoi(decisionMakerIdString)
	if decisionMakerIDErr != nil {
		http.Error(w, "Invalid decision maker ID", http.StatusBadRequest)
		return
	}

	inconsistencies, err := h.Service.CheckForInconsistencies(projectID, decisionMakerID)
	if err != nil {
		log.Printf("Error checking for inconsistencies: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	jsonBytes, err := json.Marshal(inconsistencies)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// Write JSON response
	_, err = w.Write(jsonBytes)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
