package service

import (
	"api/internal/domain"
	"api/internal/service/argon2id"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"sync"
)

type AuthenticationService interface {
	Authenticate(username, password string) (bool, string, error)
}

type FileAuthenticationService struct {
	filename string
	mu       sync.Mutex
}

func NewFileAuthenticationService(filename string) *FileAuthenticationService {
	return &FileAuthenticationService{filename: filename}
}

func (s *FileAuthenticationService) Authenticate(username, password string) (bool, string, error) {
	users := make([]domain.User, 0)
	data, err := ioutil.ReadFile(s.filename)
	if err != nil {
		return false, "", err
	}
	if err := json.Unmarshal(data, &users); err != nil {
		return false, "", err
	}

	passwordBytes := []byte(password)
	argon2IDHash := argon2id.NewHash(1, 32, 64*1024, 4, 32)

	for _, user := range users {
		if user.Username == username {
			salt, err := base64.StdEncoding.DecodeString(user.Salt)
			if err != nil {
				return false, "", err
			}
			storedHash, err := base64.StdEncoding.DecodeString(user.Password)
			if err != nil {
				return false, "", err
			}

			if err := argon2IDHash.Compare(storedHash, salt, passwordBytes); err == nil {
				fmt.Println("Password matches.")
				return true, user.UserRole, nil
			} else {
				fmt.Println("Password does not match.")
			}
		}
	}

	return false, "", errors.New("invalid credentials")
}
