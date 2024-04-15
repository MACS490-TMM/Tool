package service

import (
	"fmt"
	"os"
	"path/filepath"
)

type PDFService interface {
	GetPDFPath(projectId, pdfId string) (string, error)
}

type FilePDFService struct {
	BasePath string
}

func NewFilePDFService(basePath string) *FilePDFService {
	return &FilePDFService{BasePath: basePath}
}

func (s *FilePDFService) GetPDFPath(projectId, pdfId string) (string, error) {
	filePath := filepath.Join(s.BasePath, "projects", projectId, pdfId+".pdf")

	// TODO Check what it does exactly
	if _, err := os.Stat(filePath); os.IsNotExist(err) { // Check if file exists or if there is an error while accessing the file
		return "", fmt.Errorf("file not found")
	}

	return filePath, nil
}
