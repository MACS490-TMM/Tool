package domain

type Project struct {
	ID             int             `json:"id"`
	Name           string          `json:"name"`
	Criteria       []Criterion     `json:"criteria"`
	Stakeholders   []Stakeholder   `json:"stakeholders"`
	DecisionMakers []DecisionMaker `json:"decisionMakers"`
	Vendors        []Vendor        `json:"vendors"`
}

type ProjectUpdate struct {
	Name           *string          `json:"name"`
	Criteria       *[]Criterion     `json:"criteria"`
	Stakeholders   *[]Stakeholder   `json:"stakeholders"`
	DecisionMakers *[]DecisionMaker `json:"decisionMakers"`
	Vendors        *[]Vendor        `json:"vendors"`
}
