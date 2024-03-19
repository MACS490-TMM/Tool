package service

import (
	"api/internal/domain"
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
)

type VendorService interface {
	CreateVendor(vendor domain.Vendor) (domain.Vendor, error)
	//GetVendor(id int) (Vendor, error)
	GetVendors() ([]domain.Vendor, error)
	//DeleteVendor(id int) error
	//UpdateVendor(id int, update domain.VendorUpdate) (domain.Vendor, error)
}

type FileVendorService struct {
	filename string
	mu       sync.Mutex
}

func NewFileVendorService(filename string) *FileVendorService {
	return &FileVendorService{
		filename: filename,
	}
}

func (s *FileVendorService) readVendors() ([]domain.Vendor, error) {
	var vendor []domain.Vendor

	file, err := ioutil.ReadFile(s.filename)

	if err != nil {
		if os.IsNotExist(err) {
			// Initialize the file with an empty JSON array if it does not exist
			emptyInit := []byte("[]")
			if writeErr := ioutil.WriteFile(s.filename, emptyInit, 0644); writeErr != nil {
				return nil, writeErr
			}
			return vendor, nil
		}
		return nil, err
	}

	// Prevent parsing failure on empty file by checking for 0 byte size
	if len(file) == 0 {
		return vendor, nil // Return empty stakeholders slice
	}

	err = json.Unmarshal(file, &vendor)
	if err != nil {
		return nil, err
	}

	return vendor, nil
}

func (s *FileVendorService) writeVendors(vendors []domain.Vendor) error {
	data, err := json.Marshal(vendors)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(s.filename, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func (s *FileVendorService) GetVendors() ([]domain.Vendor, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.readVendors()
}

// CreateVendor TODO: Change the implementation to use a database instead of a file
func (s *FileVendorService) CreateVendor(vendor domain.Vendor) (domain.Vendor, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	vendors, err := s.readVendors()
	if err != nil {
		return domain.Vendor{}, err
	}

	// Assign a new ID
	vendor.ID = len(vendors) + 1
	vendors = append(vendors, vendor)

	// Write projects back to the file
	err = s.writeVendors(vendors)
	if err != nil {
		return domain.Vendor{}, err
	}

	return vendor, nil
}
