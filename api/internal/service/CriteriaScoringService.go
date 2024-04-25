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

/*func (s *FileCriteriaScoringService) AddOrUpdateCriteriaScores(projectID int, decisionMakerID int, newComparisons []domain.CriterionComparisons) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Read the existing scores from the file
	allCriteriaComparisons, err := s.readCriteriaScoring()
	if err != nil {
		return err
	}

	// Create a map for easier lookup of existing scores by criterionId
	scoreMap := make(map[int]*domain.CriterionComparisons)
	for i := range allCriteriaComparisons {
		// Only consider scores for the specific project and decision maker
		if allCriteriaComparisons[i].ProjectID == projectID && allCriteriaComparisons[i].DecisionMakerID == decisionMakerID {
			scoreMap[allCriteriaComparisons[i].CriterionID] = &allCriteriaComparisons[i]
		}
	}

	// Iterate over the new scores and update the map accordingly
	for _, newScore := range newComparisons {
		if existingScore, found := scoreMap[newScore.CriterionID]; found {
			// Update existing score
			existingScore.Score = newScore.Score
			existingScore.TextExtracted = newScore.TextExtracted
			existingScore.Comments = newScore.Comments
		} else {
			score := domain.CriterionComparisons{
				// Add new score
				ProjectID:        projectID,
				CriterionID:      newScore.CriterionID,
				DecisionMakerID:  decisionMakerID,
				BaseVendorID:     newScore.BaseVendorID,
				ComparedVendorID: newScore.ComparedVendorID,
				Score:            newScore.Score,
				TextExtracted:    newScore.TextExtracted,
				Comments:         newScore.Comments,
			}
			criteriaScores = append(criteriaScores, score)
		}
	}

	// Write the updated scores back to the file
	return s.writeCriteriaScoring(criteriaScores)
}*/
