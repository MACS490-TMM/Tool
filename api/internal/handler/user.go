package handler

import (
	"api/internal/domain"
	"api/internal/service"
	"encoding/json"
	"net/http"
	"strconv"
)

// UserHandler structure to map UserService from service
type UserHandler struct {
	Service service.UserService
}

// RegisterUser function to register a new user
func (handler *UserHandler) RegisterUser(w http.ResponseWriter, req *http.Request) {

	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user domain.User
	if err := json.NewDecoder(req.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := handler.Service.Register(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	encodeErr := json.NewEncoder(w).Encode(user)
	if encodeErr != nil {
		return
	}
}

// UpdateUserPassword function to update user password
func (handler *UserHandler) UpdateUserPassword(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idString := req.PathValue("id")

	userId, convertErr := strconv.Atoi(idString)
	if convertErr != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var passwordGroup domain.UserUpdatePassword
	if err := json.NewDecoder(req.Body).Decode(&passwordGroup); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := handler.Service.UpdatePassword(userId, passwordGroup)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	encodeErr := json.NewEncoder(w).Encode(map[string]string{"message": "Password updated successfully"})
	if encodeErr != nil {
		return
	}
}

// DeleteUser function to delete a user
func (handler *UserHandler) DeleteUser(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idString := req.PathValue("id")

	userId, convertErr := strconv.Atoi(idString)
	if convertErr != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	err := handler.Service.DeleteUser(userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	encodeErr := json.NewEncoder(w).Encode(map[string]string{"message": "User deleted successfully"})
	if encodeErr != nil {
		return
	}
}
