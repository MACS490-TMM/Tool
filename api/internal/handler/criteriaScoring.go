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

// GetAllCriteriaScoresDM is an HTTP handler that returns a list of all criteria and their scores.
func (h *CriteriaScoringHandler) GetAllCriteriaScoresDM(w http.ResponseWriter, req *http.Request) {
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

	allCriteriaScoresDM, getAllCriteriaScoresDMErr := h.Service.GetAllCriteriaScoresDM(projectID, decisionMakerID)
	if getAllCriteriaScoresDMErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting decision makers: %v", getAllCriteriaScoresDMErr)

		http.Error(w, getAllCriteriaScoresDMErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(allCriteriaScoresDM)
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

	var criteriaScores []domain.CriterionComparisons
	if err := json.NewDecoder(req.Body).Decode(&criteriaScores); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	for i := range criteriaScores {
		criteriaScores[i].ProjectID = projectID
	}

	err := h.Service.AddOrUpdateCriteriaScores(projectID, criteriaScores)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if encodeErr := json.NewEncoder(w).Encode(criteriaScores); encodeErr != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (h *CriteriaScoringHandler) CheckForConflicts(w http.ResponseWriter, req *http.Request) {
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

func (h *CriteriaScoringHandler) CheckForInconsistencies(w http.ResponseWriter, req *http.Request) {
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

func (h *CriteriaScoringHandler) UpdateAllCriteriaInconsistencies(w http.ResponseWriter, req *http.Request) {
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

	// Parse request body into a temporary slice of structs
	var updateRequests []struct {
		CriterionID      int  `json:"criterionId"`
		DecisionMakerID  int  `json:"decisionMakerId"`
		BaseVendorID     int  `json:"baseVendorId"`
		ComparedVendorID int  `json:"comparedVendorId"`
		Inconsistency    bool `json:"inconsistency"`
	}
	if err := json.NewDecoder(req.Body).Decode(&updateRequests); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Call the service method to update inconsistencies for each request
	for _, r := range updateRequests {
		err := h.Service.UpdateAllCriteriaInconsistencies(projectID, r.CriterionID, r.DecisionMakerID, r.BaseVendorID, r.ComparedVendorID, r.Inconsistency)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *CriteriaScoringHandler) UpdateAllCriteriaConflicts(w http.ResponseWriter, req *http.Request) {
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

	// Parse request body into a temporary slice of structs
	var updateRequests []struct {
		CriterionID      int  `json:"criterionId"`
		DecisionMakerID  int  `json:"decisionMakerId"`
		BaseVendorID     int  `json:"baseVendorId"`
		ComparedVendorID int  `json:"comparedVendorId"`
		Conflict         bool `json:"conflict"`
	}

	if err := json.NewDecoder(req.Body).Decode(&updateRequests); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Call the service method to update conflicts for each request
	for _, r := range updateRequests {
		err := h.Service.UpdateAllCriteriaConflicts(projectID, r.CriterionID, r.DecisionMakerID, r.BaseVendorID, r.ComparedVendorID, r.Conflict)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *CriteriaScoringHandler) UpdateProjectVendorList(w http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if req.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	projectIDStr := req.PathValue("projectId")
	projectID, err := strconv.Atoi(projectIDStr)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	var vendorList []domain.Vendor
	if err = json.NewDecoder(req.Body).Decode(&vendorList); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.Service.UpdateProjectVendorList(projectID, vendorList)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
