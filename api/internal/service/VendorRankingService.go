package service

import (
	"api/internal/domain"
	"encoding/json"
	"errors"
	"io/ioutil"
)

type VendorRankingService interface {
	GetVendorRankings(projectID int) ([]domain.VendorRanking, error)
}

type FileVendorRankingService struct {
	filename string
}

func NewFileVendorRankingService(filename string) *FileVendorRankingService {
	return &FileVendorRankingService{
		filename: filename,
	}
}

func (s *FileVendorRankingService) GetVendorRankings(projectID int) ([]domain.VendorRanking, error) {
	data, err := ioutil.ReadFile(s.filename)
	if err != nil {
		return nil, err // could not read file
	}

	var vendorRankings []domain.VendorRanking
	err = json.Unmarshal(data, &vendorRankings)
	if err != nil {
		return nil, err // could not unmarshal JSON
	}

	var filteredRankings []domain.VendorRanking
	for _, ranking := range vendorRankings {
		if ranking.ProjectID == projectID {
			filteredRankings = append(filteredRankings, ranking)
		}
	}

	if len(filteredRankings) == 0 {
		return nil, errors.New("no vendor rankings found for the project ID")
	}

	return filteredRankings, nil
}
