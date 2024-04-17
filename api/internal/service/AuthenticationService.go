package service

import (
	"errors"
)

type AuthenticationService interface {
	Authenticate(username, password string) (bool, error)
}

type FileAuthenticationService struct {
	BasePath string
}

func NewFileAuthenticationService(basePath string) *FileAuthenticationService {
	return &FileAuthenticationService{BasePath: basePath}
}

func (s *FileAuthenticationService) Authenticate(username, password string) (bool, error) {
	// Here, you would add logic to check the username and password against stored values
	// For now, let's simulate with hardcoded values for demonstration purposes.

	// Simulate fetching and verifying from a file
	if username == "admin" && password == "hashedPassword" {
		return true, nil
	}
	return false, errors.New("invalid credentials")
}
