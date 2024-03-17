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

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		return
	}
}
