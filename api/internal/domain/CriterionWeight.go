package domain

// CriterionComparison represents the comparison of one criterion against another.
type CriterionComparison struct {
	ProjectID           int    `json:"projectId"`
	DecisionMakerID     int    `json:"decisionMakerId"`
	BaseCriterionID     int    `json:"baseCriterionId"`
	ComparedCriterionID int    `json:"comparedCriterionId"`
	ImportanceScore     int    `json:"importanceScore"` // Representing the importance of BaseCriterion over ComparedCriterion
	Comments            string `json:"comments"`
	Inconsistency       bool   `json:"inconsistency"`
	Conflict            bool   `json:"conflict"`
}
