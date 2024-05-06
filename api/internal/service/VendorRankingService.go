package service

import (
	"api/internal/domain"
	"encoding/json"
	"errors"
	"io/ioutil"
)

type VendorRankingService interface {
	GetVendorRankings(projectID int) ([]domain.VendorRanking, error)
	UpdateVendorRankings(projectID int, rankings []domain.VendorRanking) error
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

func (s *FileVendorRankingService) UpdateVendorRankings(projectID int, rankings []domain.VendorRanking) error {
	data, err := ioutil.ReadFile(s.filename)
	if err != nil {
		return err
	}

	var vendorRankings []domain.VendorRanking
	if err := json.Unmarshal(data, &vendorRankings); err != nil {
		return err
	}

	// Map to keep track of existing vendor rankings for the given project
	existingRankings := make(map[int]bool)
	for i, vendorRanking := range vendorRankings {
		if vendorRanking.ProjectID == projectID {
			existingRankings[vendorRanking.VendorID] = true
			for _, ranking := range rankings {
				if ranking.VendorID == vendorRanking.VendorID {
					// Update existing ranking
					vendorRankings[i] = ranking
				}
			}
		}
	}

	// Append new rankings that do not exist
	for _, ranking := range rankings {
		if _, exists := existingRankings[ranking.VendorID]; !exists {
			// This is a new vendor ID for the project, append it
			vendorRankings = append(vendorRankings, ranking)
		}
	}

	updatedData, err := json.Marshal(vendorRankings)
	if err != nil {
		return err
	}

	if err := ioutil.WriteFile(s.filename, updatedData, 0644); err != nil {
		return err
	}

	return nil
}
