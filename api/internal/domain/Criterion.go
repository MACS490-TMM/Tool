package domain

type Criterion struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Explanation string `json:"explanation"`
}
