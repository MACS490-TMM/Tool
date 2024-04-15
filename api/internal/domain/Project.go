package domain

// EvaluationPhase represents the current phase of project evaluation
type EvaluationPhase string

const (
	PhaseWeighting EvaluationPhase = "Weighting"
	PhaseScoring   EvaluationPhase = "Scoring"
)

type Project struct {
	ID              int             `json:"id"`
	Name            string          `json:"name"`
	Criteria        []Criterion     `json:"criteria"`
	DecisionMakers  []DecisionMaker `json:"decisionMakers"`
	Stakeholders    []Stakeholder   `json:"stakeholders"`
	Vendors         []Vendor        `json:"vendors"`
	EvaluationPhase EvaluationPhase `json:"evaluationPhase"`
}

type ProjectUpdate struct {
	Name            *string          `json:"name"`
	Criteria        *[]Criterion     `json:"criteria"`
	Stakeholders    *[]Stakeholder   `json:"stakeholders"`
	DecisionMakers  *[]DecisionMaker `json:"decisionMakers"`
	Vendors         *[]Vendor        `json:"vendors"`
	EvaluationPhase *EvaluationPhase `json:"evaluationPhase"`
}
