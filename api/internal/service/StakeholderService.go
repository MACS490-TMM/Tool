package service

import (
	"api/internal/domain"
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
)

type StakeholderService interface {
	//CreateStakeholder(stakeholder Stakeholder) (Stakeholder, error)
	//GetStakeholder(id int) (Stakeholder, error)
	GetStakeholders() ([]domain.Stakeholder, error)
	//DeleteStakeholder(id int) error
	//UpdateStakeholder(id int, update domain.StakeholderUpdate) (domain.Stakeholder, error)
}

type FileStakeholderService struct {
	filename string
	mu       sync.Mutex
}

func NewFileStakeholderService(filename string) *FileStakeholderService {
	return &FileStakeholderService{
		filename: filename,
	}
}

func (s *FileStakeholderService) readStakeholders() ([]domain.Stakeholder, error) {
	var stakeholders []domain.Stakeholder

	file, err := ioutil.ReadFile(s.filename)

	if err != nil {
		if os.IsNotExist(err) {
			// Initialize the file with an empty JSON array if it does not exist
			emptyInit := []byte("[]")
			if writeErr := ioutil.WriteFile(s.filename, emptyInit, 0644); writeErr != nil {
				return nil, writeErr
			}
			return stakeholders, nil
		}
		return nil, err
	}

	// Prevent parsing failure on empty file by checking for 0 byte size
	if len(file) == 0 {
		return stakeholders, nil // Return empty stakeholders slice
	}

	err = json.Unmarshal(file, &stakeholders)
	if err != nil {
		return nil, err
	}

	return stakeholders, nil
}

func (s *FileStakeholderService) GetStakeholders() ([]domain.Stakeholder, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.readStakeholders()
}
