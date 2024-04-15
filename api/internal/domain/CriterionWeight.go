package domain

// CriterionWeight represents the weight of a criterion.
type CriterionWeight struct {
	ProjectID       int `json:"projectId"`
	CriterionID     int `json:"criterionId"`
	DecisionMakerID int `json:"decisionMakerId"`
	Weight          int `json:"weight"`
}
