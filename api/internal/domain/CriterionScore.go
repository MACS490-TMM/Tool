package domain

type CriterionComparisons struct {
	ProjectID       int                `json:"projectId"`
	CriterionID     int                `json:"criterionId"`
	DecisionMakerID int                `json:"decisionMakerId"`
	Comparisons     []VendorComparison `json:"comparisons"`
}

type VendorComparison struct {
	BaseVendorID     int    `json:"baseVendorId"`
	ComparedVendorID int    `json:"comparedVendorId"`
	Score            int    `json:"score"`
	TextExtracted    string `json:"textExtracted"`
	Comments         string `json:"comments"`
	Conflict         bool   `json:"conflict"`
	Inconsistency    bool   `json:"inconsistency"`
}
