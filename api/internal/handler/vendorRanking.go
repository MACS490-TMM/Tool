package handler

import (
	"api/internal/domain"
	"api/internal/service"
	"encoding/json"
	"net/http"
	"strconv"
)

type VendorRankingHandler struct {
	Service service.VendorRankingService
}

func (h *VendorRankingHandler) GetVendorRankings(w http.ResponseWriter, req *http.Request) {
	projectIDString := req.PathValue("projectId")

	if req.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	projectID, projectIDErr := strconv.Atoi(projectIDString)
	if projectIDErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	rankings, err := h.Service.GetVendorRankings(projectID)
	if err != nil {
		http.Error(w, "Could not get vendor rankings: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(rankings); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (h *VendorRankingHandler) UpdateVendorRankings(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPut {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	projectIDString := req.PathValue("projectId")

	projectID, err := strconv.Atoi(projectIDString)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	var rankings []domain.VendorRanking
	if err := json.NewDecoder(req.Body).Decode(&rankings); err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	if err := h.Service.UpdateVendorRankings(projectID, rankings); err != nil {
		http.Error(w, "Could not update vendor rankings: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Vendor rankings updated successfully"))
}
