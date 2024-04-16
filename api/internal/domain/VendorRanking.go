package domain

type VendorRanking struct {
	ProjectID int `json:"projectId"`
	VendorID  int `json:"vendorId"`
	Ranking   int `json:"ranking"`
	Score     int `json:"score"`
}
