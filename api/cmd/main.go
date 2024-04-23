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
	mux.Handle("/criteria", wrapMiddleware(http.HandlerFunc(handler.CriteriaHandler)))
	mux.Handle("/api/criteria", wrapMiddleware(http.HandlerFunc(handler.GetCriteriaHandler)))
	mux.Handle("/newProject", wrapMiddleware(http.HandlerFunc(projectHandler.CreateProject)))
	mux.Handle("/projects", wrapMiddleware(http.HandlerFunc(projectHandler.GetProjects)))
	mux.Handle("/projects/{id}", wrapMiddleware(http.HandlerFunc(projectHandler.GetProject)))
	mux.Handle("/projects/{id}/delete", wrapMiddleware(http.HandlerFunc(projectHandler.DeleteProject)))
	mux.Handle("/projects/{id}/update", wrapMiddleware(http.HandlerFunc(projectHandler.UpdateProject)))
	mux.Handle("/decisionMakers", wrapMiddleware(http.HandlerFunc(decisionMakerHandler.GetDecisionMakers)))
	mux.Handle("/stakeholders", wrapMiddleware(http.HandlerFunc(stakeholderHandler.GetStakeholders)))
	mux.Handle("/vendors", wrapMiddleware(http.HandlerFunc(vendorHandler.GetVendors)))
	mux.Handle("/newVendor", wrapMiddleware(http.HandlerFunc(vendorHandler.CreateVendor)))
	mux.Handle("/projects/{projectId}/criteria/{criterionId}/scores", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.GetCriteriaScores)))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/scores", wrapMiddleware(http.HandlerFunc(criteriaScoringHandler.AddCriteriaScores)))
	mux.Handle("/projects/{projectId}/pdf/{pdfId}", wrapMiddleware(http.HandlerFunc(pdfHandler.ServePDF)))
	mux.Handle("/projects/{projectId}/vendorRanking", wrapMiddleware(http.HandlerFunc(vendorRankingHandler.GetVendorRankings)))
	mux.Handle("/login", corsOnlyMiddleware(http.HandlerFunc(authenticationHandler.ServeHTTP)))
	mux.Handle("/logout", corsOnlyMiddleware(http.HandlerFunc(authenticationHandler.Logout)))
	mux.Handle("/register", corsOnlyMiddleware(http.HandlerFunc(userHandler.RegisterUser)))
	mux.Handle("/user/delete/{id}", wrapMiddleware(http.HandlerFunc(userHandler.DeleteUser))) // TODD: Secure so that only admin can delete users
	mux.Handle("/user/update/password/{id}", wrapMiddleware(http.HandlerFunc(userHandler.UpdateUserPassword)))

	mux.Handle("/projects/{projectId}/criteria/{criterionId}/weights", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.GetCriteriaWeights)))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/weights", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.AddCriteriaWeights)))

	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/conflicts", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.CheckForConflicts)))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/inconsistencies", wrapMiddleware(http.HandlerFunc(criteriaWeightingHandler.CheckForInconsistencies)))

	return mux
}

func main() {
	mux := SetupServer()

	listenAndServeErr := http.ListenAndServe(":8080", mux)
	if listenAndServeErr != nil {
		return
	}
}
