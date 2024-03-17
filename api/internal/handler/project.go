package handler

import (
	"api/internal/domain"
	"api/internal/service"
	"encoding/json"
	"net/http"
	"strconv"
)

type ProjectHandler struct {
	Service service.ProjectService
}

func (h *ProjectHandler) CreateProject(w http.ResponseWriter, req *http.Request) {
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

	var project domain.Project
	if err := json.NewDecoder(req.Body).Decode(&project); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	project, err := h.Service.CreateProject(project)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	encodeErr := json.NewEncoder(w).Encode(project)
	if encodeErr != nil {
		return
	}
}

func (h *ProjectHandler) GetProject(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idString := req.PathValue("id")

	id, convertErr := strconv.Atoi(idString)

	if convertErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	project, getProjectErr := h.Service.GetProject(id)
	if getProjectErr != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	encodeErr := json.NewEncoder(w).Encode(project)
	if encodeErr != nil {
		return
	}
}

func (h *ProjectHandler) DeleteProject(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	if req.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idString := req.PathValue("id")

	id, convertErr := strconv.Atoi(idString)

	if convertErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	err := h.Service.DeleteProject(id)
	if err != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, err = w.Write([]byte("Project deleted successfully"))
	if err != nil {
		return
	}
}

/*func (h *ProjectHandler) UpdateProject(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	if req.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var project domain.Project
	if err := json.NewDecoder(req.Body).Decode(&project); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	project, err := h.Service.UpdateProject(project)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	encodeErr := json.NewEncoder(w).Encode(project)
	if encodeErr != nil {
		return
	}
}*/

func (h *ProjectHandler) UpdateProject(w http.ResponseWriter, req *http.Request) {
	EnableCORS(w)

	if req.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idString := req.PathValue("id")

	id, convertErr := strconv.Atoi(idString)

	if convertErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	var update domain.ProjectUpdate
	if err := json.NewDecoder(req.Body).Decode(&update); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	project, err := h.Service.UpdateProject(id, update)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	if encodeErr := json.NewEncoder(w).Encode(project); encodeErr != nil {
		return
	}
}
