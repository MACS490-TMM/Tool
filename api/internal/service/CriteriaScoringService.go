package service

import (
	"api/internal/domain"
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
)

type CriteriaScoringService interface {
	GetSpecificCriteriaScores(projectID int, criterionId int) ([]domain.CriterionComparisons, error)
	AddOrUpdateCriteriaScores(projectID int, decisionMakerID int, scores []domain.CriterionComparisons) error
	GetAllCriteriaScoresDM(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error)
	CheckForConflicts(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error)
	CheckForInconsistencies(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error)
}

type FileCriteriaScoringService struct {
	filename string
	mu       sync.Mutex
}

func NewFileCriteriaScoringService(filename string) *FileCriteriaScoringService {
	return &FileCriteriaScoringService{
		filename: filename,
	}
}

func (s *FileCriteriaScoringService) readCriteriaScoring() ([]domain.CriterionComparisons, error) {
	var criteriaScores []domain.CriterionComparisons
	file, err := ioutil.ReadFile(s.filename)
	if err != nil {
		if os.IsNotExist(err) {
			return []domain.CriterionComparisons{}, nil // Return an empty slice if the file doesn't exist
		}
		return nil, err
	}

	if len(file) == 0 {
		return []domain.CriterionComparisons{}, nil // Return an empty slice if the file is empty
	}

	err = json.Unmarshal(file, &criteriaScores)
	if err != nil {
		return nil, err
	}

	return criteriaScores, nil
}

func (s *FileCriteriaScoringService) writeCriteriaScoring(scores []domain.CriterionComparisons) error {
	data, err := json.Marshal(scores)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(s.filename, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func (s *FileCriteriaScoringService) GetSpecificCriteriaScores(projectID int, criterionId int) ([]domain.CriterionComparisons, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	allScores, err := s.readCriteriaScoring()
	if err != nil {
		return nil, err
	}

	// Filter the scores for the specific criterion in the specific project
	var specificScores []domain.CriterionComparisons
	for _, score := range allScores {
		if score.ProjectID == projectID && score.CriterionID == criterionId {
			specificScores = append(specificScores, score)
		}
	}

	return specificScores, nil
}

func (s *FileCriteriaScoringService) GetAllCriteriaScoresDM(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	allScores, err := s.readCriteriaScoring()
	if err != nil {
		return nil, err
	}

	// Filter the weights for the specific criterion in the specific project
	var specificScores []domain.CriterionComparisons
	for _, score := range allScores {
		if score.ProjectID == projectID && score.DecisionMakerID == decisionMakerID {
			specificScores = append(specificScores, score)
		}
	}

	return specificScores, nil
}

func (s *FileCriteriaScoringService) AddOrUpdateCriteriaScores(projectID int, decisionMakerID int, newComparisons []domain.CriterionComparisons) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Read the existing scores from the file
	allCriteriaComparisons, err := s.readCriteriaScoring()
	if err != nil {
		return err
	}

	// Create a map for easier lookup of existing criteria comparisons by criterionId
	comparisonMap := make(map[int]*domain.CriterionComparisons)
	for i, existingComparisons := range allCriteriaComparisons {
		if existingComparisons.ProjectID == projectID && existingComparisons.DecisionMakerID == decisionMakerID {
			comparisonMap[existingComparisons.CriterionID] = &allCriteriaComparisons[i]
		}
	}

	// Iterate over the new criterion comparisons
	for _, newCriterionComparison := range newComparisons {
		if existingComparisons, found := comparisonMap[newCriterionComparison.CriterionID]; found {
			// Update existing comparisons
			existingComparisons.Comparisons = newCriterionComparison.Comparisons
		} else {
			// Add new criterion comparisons if not found
			comparisonMap[newCriterionComparison.CriterionID] = &newCriterionComparison
			allCriteriaComparisons = append(allCriteriaComparisons, newCriterionComparison)
		}
	}

	// Write the updated criteria comparisons back to the file
	return s.writeCriteriaScoring(allCriteriaComparisons)
}

func (s *FileCriteriaScoringService) CheckForConflicts(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error) {
	criteriaScores, err := s.readCriteriaScoring()
	if err != nil {
		return nil, err
	}

	var conflicts []domain.CriterionComparisons
	for _, criterion := range criteriaScores {
		if criterion.ProjectID == projectID && criterion.DecisionMakerID == decisionMakerID {
			conflictExists := false
			filteredComparisons := make([]domain.VendorComparison, 0)
			for _, comp := range criterion.Comparisons {
				if comp.Conflict {
					conflictExists = true
					filteredComparisons = append(filteredComparisons, comp)
				}
			}
			if conflictExists {
				criterion.Comparisons = filteredComparisons
				conflicts = append(conflicts, criterion)
			}
		}
	}
	return conflicts, nil
}

func (s *FileCriteriaScoringService) CheckForInconsistencies(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error) {
	criteriaScores, err := s.readCriteriaScoring()
	if err != nil {
		return nil, err
	}

	var inconsistencies []domain.CriterionComparisons
	for _, criterion := range criteriaScores {
		if criterion.ProjectID == projectID && criterion.DecisionMakerID == decisionMakerID {
			inconsistencyExists := false
			filteredComparisons := make([]domain.VendorComparison, 0)
			for _, comp := range criterion.Comparisons {
				if comp.Inconsistency {
					inconsistencyExists = true
					filteredComparisons = append(filteredComparisons, comp)
				}
			}
			if inconsistencyExists {
				criterion.Comparisons = filteredComparisons
				inconsistencies = append(inconsistencies, criterion)
			}
		}
	}
	return inconsistencies, nil
}
