package main

import (
	"api/internal/handler"
	"api/internal/service"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	projectService := service.NewFileProjectService("internal/tempDB/projects.json")
	projectHandler := &handler.ProjectHandler{Service: projectService}

	decisionMakerService := service.NewFileDecisionMakerService("internal/tempDB/decisionMakers.json")
	decisionMakerHandler := &handler.DecisionMakerHandler{Service: decisionMakerService}

	stakeholderService := service.NewFileStakeholderService("internal/tempDB/stakeholders.json")
	stakeholderHandler := &handler.StakeholderHandler{Service: stakeholderService}

	vendorService := service.NewFileVendorService("internal/tempDB/vendors.json")
	vendorHandler := &handler.VendorHandler{Service: vendorService}

	criteriaScoringService := service.NewFileCriteriaScoringService("internal/tempDB/criteriaScores.json")
	criteriaScoringHandler := &handler.CriteriaScoringHandler{Service: criteriaScoringService}

	pdfService := service.NewFilePDFService("internal/tempDB/fileStorage/")
	pdfHandler := &handler.PDFHandler{Service: pdfService}

	// TODO: update endpoints to have version number etc
	mux.HandleFunc("/items/{id}", handler.ItemHandler)
	mux.HandleFunc("/files/{path}", handler.FilesHandler)
	mux.HandleFunc("/criteria", handler.CriteriaHandler)
	mux.HandleFunc("/api/criteria", handler.GetCriteriaHandler)
	mux.HandleFunc("/projects", projectHandler.CreateProject)
	mux.HandleFunc("/projects/{id}", projectHandler.GetProject)
	mux.HandleFunc("/projects/delete/{id}", projectHandler.DeleteProject)
	mux.HandleFunc("/projects/update/{id}", projectHandler.UpdateProject)
	mux.HandleFunc("/decisionMakers", decisionMakerHandler.GetDecisionMakers)
	mux.HandleFunc("/stakeholders", stakeholderHandler.GetStakeholders)
	mux.HandleFunc("/vendors", vendorHandler.GetVendors)
	mux.HandleFunc("/newVendor", vendorHandler.CreateVendor)
	//mux.HandleFunc("/vendors/{id}", vendorHandler.GetVendor)
	//mux.HandleFunc("/vendors/delete/{id}", vendorHandler.DeleteVendor)
	//mux.HandleFunc("/vendors/update/{id}", vendorHandler.UpdateVendor)
	mux.HandleFunc("/projects/{projectId}/criteria/{criterionId}/scores", criteriaScoringHandler.GetCriteriaScores)
	mux.HandleFunc("/projects/{projectId}/decisionMaker/{decisionMakerId}/scores", criteriaScoringHandler.AddCriteriaScores)
	mux.HandleFunc("/projects/{projectId}/pdf/{pdfId}", pdfHandler.ServePDF)

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		return
	}
}
