package service

import (
	"api/internal/domain"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
)

type CriteriaWeightingService interface {
	GetSpecificCriteriaWeights(projectID int, criterionId int) ([]domain.CriterionComparison, error)
	GetAllCriteriaWeights(projectID int) ([]domain.CriterionComparison, error)
	GetAllCriteriaWeightsDM(projectID int, decisionMakerID int) ([]domain.CriterionComparison, error)
	AddOrUpdateCriteriaWeights(projectID int, weights []domain.CriterionComparison) error
	CheckForConflicts(projectID int, decisionMakerID int) ([]domain.CriterionComparison, error)
	CheckForInconsistencies(projectID int, decisionMakerID int) ([]domain.CriterionComparison, error)
}

type FileCriteriaWeightsService struct {
	filename string
	mu       sync.Mutex
}

func NewFileCriteriaWeightsService(filename string) *FileCriteriaWeightsService {
	return &FileCriteriaWeightsService{
		filename: filename,
	}
}

func (s *FileCriteriaWeightsService) readCriteriaWeights() ([]domain.CriterionComparison, error) {
	var criteriaWeights []domain.CriterionComparison
	file, err := ioutil.ReadFile(s.filename)
	if err != nil {
		if os.IsNotExist(err) {
			return []domain.CriterionComparison{}, nil // Return an empty slice if the file doesn't exist
		}
		return nil, err
	}

	if len(file) == 0 {
		return []domain.CriterionComparison{}, nil // Return an empty slice if the file is empty
	}

	err = json.Unmarshal(file, &criteriaWeights)
	if err != nil {
		return nil, err
	}

	return criteriaWeights, nil
}

func (s *FileCriteriaWeightsService) writeCriteriaWeights(weights []domain.CriterionComparison) error {
	data, err := json.Marshal(weights)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(s.filename, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

// TODO: Go over anc check logic as it is old
func (s *FileCriteriaWeightsService) GetSpecificCriteriaWeights(projectID int, baseCriterionId int) ([]domain.CriterionComparison, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	allWeights, err := s.readCriteriaWeights()
	if err != nil {
		return nil, err
	}

	// Filter the weights for the specific criterion in the specific project
	var specificWeights []domain.CriterionComparison
	for _, weight := range allWeights {
		if weight.ProjectID == projectID && weight.BaseCriterionID == baseCriterionId {
			specificWeights = append(specificWeights, weight)
		}
	}

	return specificWeights, nil
}

func (s *FileCriteriaWeightsService) GetAllCriteriaWeights(projectID int) ([]domain.CriterionComparison, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	allWeights, err := s.readCriteriaWeights()
	if err != nil {
		return nil, err
	}

	// Filter the weights for the specific criterion in the specific project
	var specificWeights []domain.CriterionComparison
	for _, weight := range allWeights {
		if weight.ProjectID == projectID {
			specificWeights = append(specificWeights, weight)
		}
	}

	return specificWeights, nil
}

func (s *FileCriteriaWeightsService) GetAllCriteriaWeightsDM(projectID int, decisionMakerID int) ([]domain.CriterionComparison, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	allWeights, err := s.readCriteriaWeights()
	if err != nil {
		return nil, err
	}

	// Filter the weights for the specific criterion in the specific project
	var specificWeights []domain.CriterionComparison
	for _, weight := range allWeights {
		if weight.ProjectID == projectID && weight.DecisionMakerID == decisionMakerID {
			specificWeights = append(specificWeights, weight)
		}
	}

	return specificWeights, nil
}

func (s *FileCriteriaWeightsService) AddOrUpdateCriteriaWeights(projectID int, newWeights []domain.CriterionComparison) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existingWeights, err := s.readCriteriaWeights()
	if err != nil {
		return err
	}

	// Create a map for the existing weights for quick lookup and update
	existingWeightMap := make(map[string]*domain.CriterionComparison)
	for i := range existingWeights {
		key := fmt.Sprintf("%d-%d-%d-%d", existingWeights[i].ProjectID, existingWeights[i].DecisionMakerID, existingWeights[i].BaseCriterionID, existingWeights[i].ComparedCriterionID)
		existingWeightMap[key] = &existingWeights[i]
	}

	// Iterate over new weights to update existing ones or add new
	for _, newWeight := range newWeights {
		key := fmt.Sprintf("%d-%d-%d-%d", projectID, newWeight.DecisionMakerID, newWeight.BaseCriterionID, newWeight.ComparedCriterionID)
		if existingWeight, found := existingWeightMap[key]; found {
			// Update the existing weight entry
			existingWeight.ImportanceScore = newWeight.ImportanceScore
			existingWeight.Comments = newWeight.Comments
			existingWeight.Inconsistency = newWeight.Inconsistency
			existingWeight.Conflict = newWeight.Conflict
		} else {
			// Add new weight if it doesn't exist
			existingWeights = append(existingWeights, newWeight)
		}
	}

	return s.writeCriteriaWeights(existingWeights)
}

func (s *FileCriteriaWeightsService) CheckForConflicts(projectID int, decisionMakerID int) ([]domain.CriterionComparison, error) {
	criteriaWeights, err := s.readCriteriaWeights()
	if err != nil {
		return nil, err
	}

	var conflicts []domain.CriterionComparison
	for _, criterion := range criteriaWeights {
		if criterion.ProjectID == projectID && criterion.DecisionMakerID == decisionMakerID {
			if criterion.Conflict {
				conflicts = append(conflicts, criterion)
			}
		}
	}
	return conflicts, nil
}

func (s *FileCriteriaWeightsService) CheckForInconsistencies(projectID int, decisionMakerID int) ([]domain.CriterionComparison, error) {
	criteriaWeights, err := s.readCriteriaWeights()
	if err != nil {
		return nil, err
	}

	var inconsistencies []domain.CriterionComparison
	for _, criterion := range criteriaWeights {
		if criterion.ProjectID == projectID && criterion.DecisionMakerID == decisionMakerID {
			if criterion.Inconsistency {
				inconsistencies = append(inconsistencies, criterion)
			}
		}
	}
	return inconsistencies, nil
}
