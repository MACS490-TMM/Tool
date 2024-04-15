package handler

import (
	"api/internal/service"
	"fmt"
	"net/http"
	"strings"
)

type PDFHandler struct {
	Service service.PDFService
}

func (h *PDFHandler) ServePDF(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	projectId := req.PathValue("projectId")
	pdfId := req.PathValue("pdfId")

	// TODO: Consider if this handling is necessary
	if projectId == "" || pdfId == "" {
		var missingFields []string
		if projectId == "" {
			missingFields = append(missingFields, "Project ID")
		}
		if pdfId == "" {
			missingFields = append(missingFields, "PDF ID")
		}
		http.Error(w, fmt.Sprintf("%s required", strings.Join(missingFields, " and ")), http.StatusBadRequest)
		return
	}

	filePath, err := h.Service.GetPDFPath(projectId, pdfId)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	http.ServeFile(w, req, filePath)
}
