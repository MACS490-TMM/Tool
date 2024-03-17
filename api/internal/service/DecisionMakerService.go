package service

import (
	"api/internal/domain"
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
)

type DecisionMakerService interface {
	//CreateDecisionMaker(decisionMaker DecisionMaker) (DecisionMaker, error)
	//GetDecisionMaker(id int) (DecisionMaker, error)
	GetDecisionMakers() ([]domain.DecisionMaker, error)
	//DeleteDecisionMaker(id int) error
	//UpdateDecisionMaker(id int, update domain.DecisionMakerUpdate) (domain.DecisionMaker, error)
}

type FileDecisionMakerService struct {
	filename string
	mu       sync.Mutex
}

func NewFileDecisionMakerService(filename string) *FileDecisionMakerService {
	return &FileDecisionMakerService{
		filename: filename,
	}
}

func (s *FileDecisionMakerService) readDecisionMakers() ([]domain.DecisionMaker, error) {
	var decisionMakers []domain.DecisionMaker

	file, err := ioutil.ReadFile(s.filename)

	if err != nil {
		if os.IsNotExist(err) {
			// Initialize the file with an empty JSON array if it does not exist
			emptyInit := []byte("[]")
			if writeErr := ioutil.WriteFile(s.filename, emptyInit, 0644); writeErr != nil {
				return nil, writeErr
			}
			return decisionMakers, nil
		}
		return nil, err
	}

	// Prevent parsing failure on empty file by checking for 0 byte size
	if len(file) == 0 {
		return decisionMakers, nil // Return empty decisionMakers slice
	}

	err = json.Unmarshal(file, &decisionMakers)
	if err != nil {
		return nil, err
	}

	return decisionMakers, nil
}

func (s *FileDecisionMakerService) GetDecisionMakers() ([]domain.DecisionMaker, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.readDecisionMakers()
}
