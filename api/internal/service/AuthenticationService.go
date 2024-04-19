package service

import (
	"encoding/json"
	"errors"
	"io/ioutil"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	UserRole string `json:"userRole"`
}

type AuthenticationService interface {
	Authenticate(username, password string) (bool, string, error)
}

type FileAuthenticationService struct {
	BasePath string
}

func NewFileAuthenticationService(basePath string) *FileAuthenticationService {
	return &FileAuthenticationService{BasePath: basePath}
}

func (s *FileAuthenticationService) Authenticate(username, password string) (bool, string, error) {
	users := make([]User, 0)
	data, err := ioutil.ReadFile(s.BasePath)
	if err != nil {
		return false, "", err
	}
	if err := json.Unmarshal(data, &users); err != nil {
		return false, "", err
	}
	for _, user := range users {
		if user.Username == username && user.Password == password {
			return true, user.UserRole, nil
		}
	}
	return false, "", errors.New("invalid credentials")
}

func (s *FileAuthenticationService) Register(username, password string) error {
	// Here, you would add logic to store the username and password
	// For now, let's simulate with hardcoded values for demonstration purposes.

	// Simulate storing to a file
	return nil
}

func (s *FileAuthenticationService) UpdatePassword(username, password string) error {
	// Here, you would add logic to update the password for a given username
	// For now, let's simulate with hardcoded values for demonstration purposes.

	// Simulate updating the password in a file
	return nil
}

func (s *FileAuthenticationService) DeleteUser(username string) error {
	// Here, you would add logic to delete a user by username
	// For now, let's simulate with hardcoded values for demonstration purposes.

	// Simulate deleting the user from a file
	return nil
}
