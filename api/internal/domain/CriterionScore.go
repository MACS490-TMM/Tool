package domain

type CriterionScore struct {
	ProjectID       int    `json:"projectId"`
	CriterionID     int    `json:"criterionId"`
	DecisionMakerID int    `json:"decisionMakerId"`
	Score           int    `json:"score"`
	TextExtracted   string `json:"textExtracted"`
	Comments        string `json:"comments"`
}
