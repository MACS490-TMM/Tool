package handler

import (
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
