package service

import (
	"api/internal/domain"
	"api/internal/service/argon2id"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"golang.org/x/crypto/argon2"
	"io/ioutil"
	"os"
	"sync"
)

type UserService interface {
	Register(user domain.User) error
	DeleteUser(id int) error
	UpdatePassword(id int, passwords domain.UserUpdatePassword) error
}

type FileUserService struct {
	filename string
	mu       sync.Mutex
}

func NewFileUserService(filename string) *FileUserService {
	return &FileUserService{filename: filename}
}

// TODO: Change role to a struct of roles, not string
func (s *FileUserService) Register(newUser domain.User) error {
	// Generate a salt
	salt, err := argon2id.GenerateSalt(16) // 16 bytes salt
	if err != nil {
		fmt.Println("Error generating salt:", err)
		return err
	}

	// Generate the hash
	hash := argon2.IDKey([]byte(newUser.Password), salt, 1, 64*1024, 4, 32) // Adjust parameters as needed

	// Print the hash and salt in base64 so that they can be stored easily in JSON
	fmt.Println("Password Hash (base64) for user, ", newUser.Username, ": ", base64.StdEncoding.EncodeToString(hash))
	fmt.Println("Salt (base64) for user, ", newUser.Username, ":", base64.StdEncoding.EncodeToString(salt))

	// Simulate storing to a file
	s.mu.Lock()
	defer s.mu.Unlock()

	users, err := s.readUsers()
	if err != nil {
		return err
	}

	for _, user := range users {
		if user.Username == newUser.Username {
			return errors.New("user already exists")
		}
	}

	userData := domain.User{
		ID:       len(users) + 1,
		Username: newUser.Username,
		Password: base64.StdEncoding.EncodeToString(hash),
		Salt:     base64.StdEncoding.EncodeToString(salt),
		UserRole: newUser.UserRole,
	}

	users = append(users, userData)

	return s.writeUser(users)
}

func (s *FileUserService) UpdatePassword(userId int, passwordGroup domain.UserUpdatePassword) error {
	users, err := s.readUsers()
	if err != nil {
		return err
	}

	// Find the user
	var user domain.User
	for _, u := range users {
		if u.ID == userId {
			user = u
			break
		}
	}

	oldSalt, err := base64.StdEncoding.DecodeString(user.Salt)
	if err != nil {
		return err
	}

	// Generate a salt
	newSalt, err := argon2id.GenerateSalt(16) // 16 bytes salt
	if err != nil {
		fmt.Println("Error generating salt:", err)
		return err
	}

	// Generate the hash
	oldHash := argon2.IDKey([]byte(passwordGroup.OldPassword), oldSalt, 1, 64*1024, 4, 32) // Adjust parameters as needed

	if !argon2id.StringCompare(user.Password, base64.StdEncoding.EncodeToString(oldHash)) {
		fmt.Println("User password: ", user.Password)
		fmt.Println("Old password hash: ", base64.StdEncoding.EncodeToString(oldHash))
		return errors.New("old password does not match")
	}

	newPassword := passwordGroup.NewPassword

	// Generate the hash
	hash := argon2.IDKey([]byte(newPassword), newSalt, 1, 64*1024, 4, 32) // Adjust parameters as needed

	// Print the hash and salt in base64 so that they can be stored easily in JSON
	fmt.Println("New password Hash (base64) for user, ", user.Username, ": ", base64.StdEncoding.EncodeToString(hash))
	fmt.Println("New salt (base64) for user, ", user.Username, ":", base64.StdEncoding.EncodeToString(newSalt))

	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range users {
		if users[i].ID == user.ID {
			users[i].Password = base64.StdEncoding.EncodeToString(hash)
			users[i].Salt = base64.StdEncoding.EncodeToString(newSalt)
			return s.writeUser(users)
		}
	}

	return errors.New("unable to change password of user with ID: " + string(rune(user.ID)) + " - user not found")
}

// DeleteUser deletes a user from the file by ID
func (s *FileUserService) DeleteUser(userId int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	users, err := s.readUsers()
	if err != nil {
		return err
	}

	for i, user := range users {
		if user.ID == userId {
			users = append(users[:i], users[i+1:]...)
			return s.writeUser(users)
		}
	}

	return errors.New("unable to user with ID: " + string(rune(userId)) + " - user not found")
}

// readUsers reads the users from the file
func (s *FileUserService) readUsers() ([]domain.User, error) {
	var users []domain.User
	file, err := ioutil.ReadFile(s.filename)
	if err != nil {
		if os.IsNotExist(err) {
			return []domain.User{}, nil // Return an empty slice if the file doesn't exist
		}
		return nil, err
	}

	if len(file) == 0 {
		return []domain.User{}, nil // Return an empty slice if the file is empty
	}

	err = json.Unmarshal(file, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

// writeUser writes the users to the file
func (s *FileUserService) writeUser(users []domain.User) error {
	data, err := json.Marshal(users)
	if err != nil {
		return err
	}

	// Write the updated users back to the file
	if err := ioutil.WriteFile(s.filename, data, 0644); err != nil {
		return err
	}

	return nil
}
