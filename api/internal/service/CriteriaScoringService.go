package service

import (
	"api/internal/domain"
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
)

type CriteriaScoringService interface {
	GetSpecificCriteriaScores(projectID int, criterionId int) ([]domain.CriterionScore, error)
	AddOrUpdateCriteriaScores(projectID int, decisionMakerID int, scores []domain.CriterionScore) error
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

func (s *FileCriteriaScoringService) readCriteriaScoring() ([]domain.CriterionScore, error) {
	var criteriaScores []domain.CriterionScore
	file, err := ioutil.ReadFile(s.filename)
	if err != nil {
		if os.IsNotExist(err) {
			return []domain.CriterionScore{}, nil // Return an empty slice if the file doesn't exist
		}
		return nil, err
	}

	if len(file) == 0 {
		return []domain.CriterionScore{}, nil // Return an empty slice if the file is empty
	}

	err = json.Unmarshal(file, &criteriaScores)
	if err != nil {
		return nil, err
	}

	return criteriaScores, nil
}

func (s *FileCriteriaScoringService) writeCriteriaScoring(scores []domain.CriterionScore) error {
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

func (s *FileCriteriaScoringService) GetSpecificCriteriaScores(projectID int, criterionId int) ([]domain.CriterionScore, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	allScores, err := s.readCriteriaScoring()
	if err != nil {
		return nil, err
	}

	// Filter the scores for the specific criterion in the specific project
	var specificScores []domain.CriterionScore
	for _, score := range allScores {
		if score.ProjectID == projectID && score.CriterionID == criterionId {
			specificScores = append(specificScores, score)
		}
	}

	return specificScores, nil
}

func (s *FileCriteriaScoringService) AddOrUpdateCriteriaScores(projectID int, decisionMakerID int, newScores []domain.CriterionScore) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Read the existing scores from the file
	criteriaScores, err := s.readCriteriaScoring()
	if err != nil {
		return err
	}

	// Create a map for easier lookup of existing scores by criterionId
	scoreMap := make(map[int]*domain.CriterionScore)
	for i := range criteriaScores {
		// Only consider scores for the specific project and decision maker
		if criteriaScores[i].ProjectID == projectID && criteriaScores[i].DecisionMakerID == decisionMakerID {
			scoreMap[criteriaScores[i].CriterionID] = &criteriaScores[i]
		}
	}

	// Iterate over the new scores and update the map accordingly
	for _, newScore := range newScores {
		if existingScore, found := scoreMap[newScore.CriterionID]; found {
			// Update existing score
			existingScore.Score = newScore.Score
			existingScore.TextExtracted = newScore.TextExtracted
			existingScore.Comments = newScore.Comments
		} else {
			score := domain.CriterionScore{
				// Add new score
				ProjectID:       projectID,
				CriterionID:     newScore.CriterionID,
				DecisionMakerID: decisionMakerID,
				Score:           newScore.Score,
				TextExtracted:   newScore.TextExtracted,
				Comments:        newScore.Comments,
			}
			criteriaScores = append(criteriaScores, score)
		}
	}

	// Write the updated scores back to the file
	return s.writeCriteriaScoring(criteriaScores)
}
