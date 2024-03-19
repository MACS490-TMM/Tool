package handler

import (
	"api/internal/domain"
	"api/internal/service"
	"encoding/json"
	"log"
	"net/http"
)

type VendorHandler struct {
	Service service.VendorService
}

func (h *VendorHandler) GetVendors(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vendors, getVendorsErr := h.Service.GetVendors()

	if getVendorsErr != nil {
		// Log the error for server-side observability
		log.Printf("Error getting vendors: %v", getVendorsErr)

		http.Error(w, getVendorsErr.Error(), http.StatusInternalServerError)
		return
	}

	// Convert data to JSON
	jsonBytes, err := json.Marshal(vendors)
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

func (h *VendorHandler) CreateVendor(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	// Check if it's an OPTIONS request (CORS preflight)
	if req.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return // Stop here. After the preflight check, the actual request will be made.
	}

	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var vendor domain.Vendor
	if err := json.NewDecoder(req.Body).Decode(&vendor); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	vendor, err := h.Service.CreateVendor(vendor)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	encodeErr := json.NewEncoder(w).Encode(vendor)
	if encodeErr != nil {
		return
	}
}
