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
	AddOrUpdateCriteriaScores(projectID int, scores []domain.CriterionComparisons) error
	GetAllCriteriaScoresDM(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error)
	CheckForConflicts(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error)
	CheckForInconsistencies(projectID int, decisionMakerID int) ([]domain.CriterionComparisons, error)
	UpdateAllCriteriaInconsistencies(projectID, criterionID, decisionMakerID, baseVendor, comparedVendor int, inconsistency bool) error
	UpdateAllCriteriaConflicts(projectID, criterionID, decisionMakerID, baseVendor, comparedVendor int, conflict bool) error
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

func (s *FileCriteriaScoringService) UpdateAllCriteriaInconsistencies(projectID, criterionID, decisionMakerID, baseVendor, comparedVendor int, inconsistency bool) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existingScores, err := s.readCriteriaScoring()
	if err != nil {
		return err
	}

	// Iterate over existing scores to update inconsistencies
	for i := range existingScores {
		if existingScores[i].ProjectID == projectID && existingScores[i].CriterionID == criterionID && existingScores[i].DecisionMakerID == decisionMakerID {
			// Iterate over comparisons for the criterion to update inconsistencies
			for j := range existingScores[i].Comparisons {
				if existingScores[i].Comparisons[j].BaseVendorID == baseVendor && existingScores[i].Comparisons[j].ComparedVendorID == comparedVendor {
					existingScores[i].Comparisons[j].Inconsistency = inconsistency
				}
			}
		}
	}

	return s.writeCriteriaScoring(existingScores)
}

func (s *FileCriteriaScoringService) UpdateAllCriteriaConflicts(projectID, criterionID, decisionMakerID, baseVendor, comparedVendor int, conflict bool) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existingScores, err := s.readCriteriaScoring()
	if err != nil {
		return err
	}

	// Iterate over existing scores to update conflicts
	for i := range existingScores {
		if existingScores[i].ProjectID == projectID && existingScores[i].CriterionID == criterionID && existingScores[i].DecisionMakerID == decisionMakerID {
			// Iterate over comparisons for the criterion to update conflicts
			for j := range existingScores[i].Comparisons {
				if existingScores[i].Comparisons[j].BaseVendorID == baseVendor && existingScores[i].Comparisons[j].ComparedVendorID == comparedVendor {
					existingScores[i].Comparisons[j].Conflict = conflict
				}
			}
		}
	}

	return s.writeCriteriaScoring(existingScores)
}

func (s *FileCriteriaScoringService) AddOrUpdateCriteriaScores(projectID int, newComparisons []domain.CriterionComparisons) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existingScores, err := s.readCriteriaScoring()
	if err != nil {
		return err
	}

	// Remove existing comparisons with the same projectID, criterionID, and decisionMakerID
	for i := 0; i < len(existingScores); i++ {
		if existingScores[i].ProjectID == projectID && existingScores[i].CriterionID != 0 {
			existingScores = append(existingScores[:i], existingScores[i+1:]...)
			i-- // decrement i as the slice length has decreased
		}
	}

	// Iterate over the new comparisons to add them
	for _, newComparison := range newComparisons {
		// Exclude comparisons with criterionID = 0
		if newComparison.CriterionID != 0 {
			// Check if there is already an entry with the same decisionMakerID, projectID, and criterionID
			alreadyExists := false
			for _, existingScore := range existingScores {
				if existingScore.ProjectID == projectID && existingScore.CriterionID == newComparison.CriterionID && existingScore.DecisionMakerID == newComparison.DecisionMakerID {
					alreadyExists = true
					break
				}
			}
			// Append the new comparison only if it doesn't already exist
			if !alreadyExists {
				existingScores = append(existingScores, newComparison)
			}
		}
	}

	return s.writeCriteriaScoring(existingScores)
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
