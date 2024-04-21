package main

import (
	"api/internal/handler"
	"api/internal/service"
	"net/http"
)

type AuthenticatedHandler func(next http.Handler) http.Handler

type Router struct {
	//mux         *http.ServeMux
	authHandler AuthenticatedHandler
	//cors *handler.EnableCORS
}

func NewRouter(handlerToWrap AuthenticatedHandler) *Router {
	return &Router{
		handlerToWrap,
	}
}

func main() {
	mux := http.NewServeMux()
	//TODO: Add wrapper to mux (HandleContext)

	// Set up CORS middleware with allowed origins
	allowedOrigins := []string{"http://localhost:3000"}
	corsMiddleware := handler.EnableCORS(allowedOrigins)

	// Set up authentication middleware
	authMiddleware := handler.AuthenticateToken

	// Service and Handler initializations
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

	vendorRankingService := service.NewFileVendorRankingService("internal/tempDB/vendorRanking.json")
	vendorRankingHandler := &handler.VendorRankingHandler{Service: vendorRankingService}

	authenticationService := service.NewFileAuthenticationService("internal/tempDB/users.json")
	authenticationHandler := &handler.LoginHandler{AuthService: authenticationService}

	userService := service.NewFileUserService("internal/tempDB/users.json")
	userHandler := &handler.UserHandler{Service: userService}

	// Routing setup with CORS and authentication middleware
	// TODO: Add different authentication middleware for different user roles
	mux.Handle("/items/{id}", corsMiddleware(authMiddleware(http.HandlerFunc(handler.ItemHandler))))
	mux.Handle("/files/{path}", corsMiddleware(authMiddleware(http.HandlerFunc(handler.FilesHandler))))
	mux.Handle("/criteria", corsMiddleware(authMiddleware(http.HandlerFunc(handler.CriteriaHandler))))
	mux.Handle("/api/criteria", corsMiddleware(authMiddleware(http.HandlerFunc(handler.GetCriteriaHandler))))

	mux.Handle("/newProject", corsMiddleware(authMiddleware(http.HandlerFunc(projectHandler.CreateProject))))
	mux.Handle("/projects", corsMiddleware(authMiddleware(http.HandlerFunc(projectHandler.GetProjects))))
	mux.Handle("/projects/{id}", corsMiddleware(authMiddleware(http.HandlerFunc(projectHandler.GetProject))))
	mux.Handle("/projects/{id}/delete", corsMiddleware(authMiddleware(http.HandlerFunc(projectHandler.DeleteProject))))
	mux.Handle("/projects/{id}/update", corsMiddleware(authMiddleware(http.HandlerFunc(projectHandler.UpdateProject))))
	mux.Handle("/decisionMakers", corsMiddleware(authMiddleware(http.HandlerFunc(decisionMakerHandler.GetDecisionMakers))))
	mux.Handle("/stakeholders", corsMiddleware(authMiddleware(http.HandlerFunc(stakeholderHandler.GetStakeholders))))
	mux.Handle("/vendors", corsMiddleware(authMiddleware(http.HandlerFunc(vendorHandler.GetVendors))))
	mux.Handle("/newVendor", corsMiddleware(authMiddleware(http.HandlerFunc(vendorHandler.CreateVendor))))
	mux.Handle("/projects/{projectId}/criteria/{criterionId}/scores", corsMiddleware(authMiddleware(http.HandlerFunc(criteriaScoringHandler.GetCriteriaScores))))
	mux.Handle("/projects/{projectId}/decisionMaker/{decisionMakerId}/scores", corsMiddleware(authMiddleware(http.HandlerFunc(criteriaScoringHandler.AddCriteriaScores))))
	mux.Handle("/projects/{projectId}/pdf/{pdfId}", corsMiddleware(authMiddleware(http.HandlerFunc(pdfHandler.ServePDF))))
	mux.Handle("/projects/{projectId}/vendorRanking", corsMiddleware(authMiddleware(http.HandlerFunc(vendorRankingHandler.GetVendorRankings))))
	mux.Handle("/login", corsMiddleware(http.HandlerFunc(authenticationHandler.ServeHTTP)))
	mux.Handle("/logout", corsMiddleware(http.HandlerFunc(authenticationHandler.Logout)))
	mux.Handle("/register", corsMiddleware(http.HandlerFunc(userHandler.RegisterUser)))
	mux.Handle("/user/delete/{id}", corsMiddleware(http.HandlerFunc(userHandler.DeleteUser))) // TODD: Secure so that only admin can delete users
	mux.Handle("/user/update/password/{id}", corsMiddleware(http.HandlerFunc(userHandler.UpdateUserPassword)))

	listenAndServeErr := http.ListenAndServe(":8080", mux)
	if listenAndServeErr != nil {
		return
	}
}
