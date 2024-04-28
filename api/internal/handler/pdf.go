package handler

import (
	"api/internal/service"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

type PDFHandler struct {
	Service service.PDFService
}

// TODO: Make helper method and move the common code to it
// TODO: Add service layer to handle the file upload operations

func (h *PDFHandler) UploadRFPHandler(w http.ResponseWriter, req *http.Request) {
	projectIdStr := req.PathValue("projectId")

	if req.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Only POST method is allowed")
	}

	// Maximum allowed to upload files of 32 MB
	if err := req.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	file, handler, err := req.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Access file header to get Content-Type
	contentType := handler.Header.Get("Content-Type")
	fmt.Println("Uploaded file content-type:", contentType)

	// Check if the content type is the expected format, e.g., "application/pdf"
	if contentType != "application/pdf" {
		http.Error(w, "The file type is not allowed. Please upload a PDF.", http.StatusBadRequest)
		return
	}

	// Create the file structure if it doesn't exist
	projectPath := filepath.Join("internal", "tempDB", "fileStorage", "projects", projectIdStr, "RFP")
	if err = os.MkdirAll(projectPath, os.ModePerm); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Overwrite the filename from the user with a fixed name
	rfpPath := filepath.Join(projectPath, "RFP.pdf")

	// Create a new file in the target directory
	dst, err := os.Create(rfpPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the filesystem at the specified destination
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "File uploaded successfully: %s", filepath.Join(projectPath, handler.Filename))
}

func (h *PDFHandler) UploadVendorProposalHandler(w http.ResponseWriter, req *http.Request) {
	projectIdStr := req.PathValue("projectId")
	vendorIdStr := req.PathValue("vendorId")

	if req.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Only POST method is allowed")
	}

	// Maximum allowed to upload files of 32 MB
	if err := req.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	file, handler, err := req.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Access file header to get Content-Type
	contentType := handler.Header.Get("Content-Type")
	fmt.Println("Uploaded file content-type:", contentType)

	// Check if the content type is the expected format, e.g., "application/pdf"
	if contentType != "application/pdf" {
		http.Error(w, "The file type is not allowed. Please upload a PDF.", http.StatusBadRequest)
		return
	}

	// Create the file structure if it doesn't exist
	projectPath := filepath.Join("internal", "tempDB", "fileStorage", "projects", projectIdStr, "VPs", vendorIdStr)
	if err := os.MkdirAll(projectPath, os.ModePerm); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Overwrite the filename from the user with a fixed name
	vpPath := filepath.Join(projectPath, "VP.pdf")

	// Create a new file in the target directory
	dst, err := os.Create(vpPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the filesystem at the specified destination
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "File uploaded successfully: %s", filepath.Join(projectPath, handler.Filename))
}

// ServeRFPHandler serves the RFP PDF file for a given project
func (h *PDFHandler) ServeRFPHandler(w http.ResponseWriter, req *http.Request) {
	projectIdStr := req.PathValue("projectId")
	fileName := req.PathValue("fileName")

	// Get the file path
	filePath, err := h.Service.GetPDFPath(filepath.Join("projects", projectIdStr, "RFP", fileName))
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")

	http.ServeFile(w, req, filePath)
}

// ServeVendorProposalHandler serves the vendor's proposal PDF file for a given project and vendor
func (h *PDFHandler) ServeVendorProposalHandler(w http.ResponseWriter, req *http.Request) {
	projectIdStr := req.PathValue("projectId")
	vendorIdStr := req.PathValue("vendorId")
	fileName := req.PathValue("fileName")

	// Get the file path
	filePath, err := h.Service.GetPDFPath(filepath.Join("projects", projectIdStr, "VPs", vendorIdStr, fileName))
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")

	http.ServeFile(w, req, filePath)
}
