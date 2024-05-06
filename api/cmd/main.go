package main

import (
	"api/internal/handler"
	"api/internal/service"
	"net/http"
)

// wrapMiddleware takes a http.Handler and wraps it with the necessary middlewares
func wrapMiddleware(next http.Handler) http.Handler {
	allowedOrigins := []string{"http://localhost:3000"}
	corsMiddleware := handler.EnableCORS(allowedOrigins)
	authMiddleware := handler.AuthenticateToken

	// Wrap with CORS first, then with Auth
	return corsMiddleware(authMiddleware(next))
}

func corsOnlyMiddleware(next http.Handler) http.Handler {
	allowedOrigins := []string{"http://localhost:3000"}
	allowedOrigins := []string{"http://localhost:3000", "http://localhost:5000"}
	return handler.EnableCORS(allowedOrigins)(next)
}

func SetupServer() *http.ServeMux {
	mux := http.NewServeMux()

	// Initialize services
	projectService := service.NewFileProjectService("internal/tempDB/projects.json")
	decisionMakerService := service.NewFileDecisionMakerService("internal/tempDB/decisionMakers.json")
	stakeholderService := service.NewFileStakeholderService("internal/tempDB/stakeholders.json")
	vendorService := service.NewFileVendorService("internal/tempDB/vendors.json")
	criteriaScoringService := service.NewFileCriteriaScoringService("internal/tempDB/criteriaScores.json")
	pdfService := service.NewFilePDFService("internal/tempDB/fileStorage/")
	vendorRankingService := service.NewFileVendorRankingService("internal/tempDB/vendorRanking.json")
	authenticationService := service.NewFileAuthenticationService("internal/tempDB/users.json")
	userService := service.NewFileUserService("internal/tempDB/users.json")
	criteriaWeightingService := service.NewFileCriteriaWeightsService("internal/tempDB/criteriaWeights.json")

	// Initialize handlers
	projectHandler := &handler.ProjectHandler{Service: projectService}
	decisionMakerHandler := &handler.DecisionMakerHandler{Service: decisionMakerService}
	stakeholderHandler := &handler.StakeholderHandler{Service: stakeholderService}
	vendorHandler := &handler.VendorHandler{Service: vendorService}
	criteriaScoringHandler := &handler.CriteriaScoringHandler{Service: criteriaScoringService}
	pdfHandler := &handler.PDFHandler{Service: pdfService}
	vendorRankingHandler := &handler.VendorRankingHandler{Service: vendorRankingService}
	authenticationHandler := &handler.LoginHandler{AuthService: authenticationService}
	userHandler := &handler.UserHandler{Service: userService}
	criteriaWeightingHandler := &handler.CriteriaWeightHandler{Service: criteriaWeightingService}

	// Routing setup with middleware wrappers
	// TODO: Add different authentication middleware for different user roles
	mux.Handle("/items/{id}", wrapMiddleware(http.HandlerFunc(handler.ItemHandler)))
	mux.Handle("/files/{path}", wrapMiddleware(http.HandlerFunc(handler.FilesHandler)))

	mux.Handle("/projects/{projectId}/files/RFP/upload", wrapMiddleware(http.HandlerFunc(pdfHandler.UploadRFPHandler)))
	mux.Handle("/projects/{projectId}/files/RFP/{fileName}", wrapMiddleware(http.HandlerFunc(pdfHandler.ServeRFPHandler)))
	mux.Handle("/projects/{projectId}/files/VPs/vendor/{vendorId}/upload", wrapMiddleware(http.HandlerFunc(pdfHandler.UploadVendorProposalHandler)))
	mux.Handle("/projects/{projectId}/files/VPs/vendor/{vendorId}/{fileName}", wrapMiddleware(http.HandlerFunc(pdfHandler.ServeVendorProposalHandler)))

	mux.Handle("/criteria", wrapMiddleware(http.HandlerFunc(handler.CriteriaHandler)))
	mux.Handle("/api/criteria", wrapMiddleware(http.HandlerFunc(handler.GetCriteriaHandler)))
	mux.Handle("/newProject", wrapMiddleware(http.HandlerFunc(projectHandler.CreateProject)))
	mux.Handle("/projects", wrapMiddleware(http.HandlerFunc(projectHandler.GetProjects)))
	mux.Handle("/projects/{id}", wrapMiddleware(http.HandlerFunc(projectHandler.GetProject)))

	mux.Handle("/projects/{id}/vendors", wrapMiddleware(http.HandlerFunc(projectHandler.GetProjectVendors)))

	mux.Handle("/projects/{id}/delete", wrapMiddleware(http.HandlerFunc(projectHandler.DeleteProject)))
	mux.Handle("/projects/{id}/update", wrapMiddleware(http.HandlerFunc(projectHandler.UpdateProject)))
	mux.Handle("/decisionMakers", wrapMiddleware(http.HandlerFunc(decisionMakerHandler.GetDecisionMakers)))
	mux.Handle("/stakeholders", wrapMiddleware(http.HandlerFunc(stakeholderHandler.GetStakeholders)))
	mux.Handle("/vendors", wrapMiddleware(http.HandlerFunc(vendorHandler.GetVendors)))
	mux.Handle("/newVendor", wrapMiddleware(http.HandlerFunc(vendorHandler.CreateVendor)))
	mux.Handle("/projects/{projectId}/criteria/{criterionId}/scores", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.GetCriteriaScores)))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/criteria/getAllScores", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.GetAllCriteriaScoresDM))) // All for one project and one decision maker
	mux.Handle("/projects/{projectId}/criteria/scores", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.AddCriteriaScores)))
	mux.Handle("/projects/{projectId}/criteria/scores/setInconsistencies", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.UpdateAllCriteriaInconsistencies)))
	mux.Handle("/projects/{projectId}/criteria/scores/setConflicts", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.UpdateAllCriteriaConflicts)))
	mux.Handle("/projects/{projectId}/addVendors", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.UpdateProjectVendorList)))

	mux.Handle("/projects/{projectId}/vendorRanking", wrapMiddleware(http.HandlerFunc(vendorRankingHandler.GetVendorRankings)))
	mux.Handle("/login", corsOnlyMiddleware(http.HandlerFunc(authenticationHandler.ServeHTTP)))
	mux.Handle("/logout", corsOnlyMiddleware(http.HandlerFunc(authenticationHandler.Logout)))
	mux.Handle("/register", corsOnlyMiddleware(http.HandlerFunc(userHandler.RegisterUser)))
	mux.Handle("/user/delete/{id}", wrapMiddleware(http.HandlerFunc(userHandler.DeleteUser))) // TODD: Secure so that only admin can delete users
	mux.Handle("/user/update/password/{id}", wrapMiddleware(http.HandlerFunc(userHandler.UpdateUserPassword)))

	mux.Handle("/projects/{projectId}/criteria/{criterionId}/weights", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.GetCriteriaWeights)))
	mux.Handle("/projects/{projectId}/criteria/addInitialWeights", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.AddCriteriaWeights)))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/criteria/weights", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.GetAllCriteriaWeightsDM))) // All for one project and one decision maker
	mux.Handle("/projects/{projectId}/criteria/weights", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.GetAllCriteriaWeights)))                                   // All for one project
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/weights", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.AddCriteriaWeights)))

	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/weights/conflicts", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.CheckForConflicts)))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/weights/inconsistencies", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.CheckForInconsistencies)))

	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/scores/conflicts", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.CheckForConflicts)))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/scores/inconsistencies", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.CheckForInconsistencies)))

	return mux
}

func main() {
	mux := SetupServer()

	listenAndServeErr := http.ListenAndServe(":8080", mux)
	if listenAndServeErr != nil {
		return
	}
}
