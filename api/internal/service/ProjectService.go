package service

import (
	"api/internal/domain"
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"sync"
)

// ProjectService interface for project-related operations
type ProjectService interface {
	CreateProject(project domain.Project) (domain.Project, error)
	GetProject(id int) (domain.Project, error)
	GetProjects() ([]domain.Project, error)
	DeleteProject(id int) error
	UpdateProject(id int, update domain.ProjectUpdate) (domain.Project, error)
	// Other methods as needed (UpdateProject, DeleteProject, ListProjects, etc.)
}

type FileProjectService struct {
	filename string
	mu       sync.Mutex // To ensure thread-safe access to the file
}

func NewFileProjectService(filename string) *FileProjectService {
	return &FileProjectService{
		filename: filename,
	}
}

func (s *FileProjectService) readProjects() ([]domain.Project, error) {
	var projects []domain.Project
	file, err := ioutil.ReadFile(s.filename)
	if err != nil {
		if os.IsNotExist(err) {
			// Initialize the file with an empty JSON array if it does not exist
			emptyInit := []byte("[]")
			if writeErr := ioutil.WriteFile(s.filename, emptyInit, 0644); writeErr != nil {
				return nil, writeErr
			}
			return projects, nil
		}
		return nil, err
	}

	// Prevent parsing failure on empty file by checking for 0 byte size
	if len(file) == 0 {
		return projects, nil // Return empty projects slice
	}

	err = json.Unmarshal(file, &projects)
	if err != nil {
		return nil, err
	}

	return projects, nil
}

func (s *FileProjectService) writeProjects(projects []domain.Project) error {
	data, err := json.Marshal(projects)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(s.filename, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

// CreateProject TODO: Change the implementation to use a database instead of a file
func (s *FileProjectService) CreateProject(project domain.Project) (domain.Project, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	projects, err := s.readProjects()
	if err != nil {
		return domain.Project{}, err
	}

	// Assign a new ID
	project.ID = len(projects) + 1
	projects = append(projects, project)

	// Write projects back to the file
	err = s.writeProjects(projects)
	if err != nil {
		return domain.Project{}, err
	}

	return project, nil
}

// GetProject TODO: Change the implementation to use a database instead of a file
func (s *FileProjectService) GetProject(id int) (domain.Project, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	projects, err := s.readProjects()
	if err != nil {
		return domain.Project{}, err
	}

	for _, project := range projects {
		if project.ID == id {
			return project, nil
		}
	}

	return domain.Project{}, errors.New("project not found")
}

func (s *FileProjectService) GetProjects() ([]domain.Project, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	projects, err := s.readProjects()
	if err != nil {
		return nil, err
	}

	return projects, nil
}

// DeleteProject TODO: Change the implementation to use a database instead of a file
func (s *FileProjectService) DeleteProject(id int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	projects, err := s.readProjects()
	if err != nil {
		return err
	}

	for i, project := range projects {
		if project.ID == id {
			projects = append(projects[:i], projects[i+1:]...)
			return s.writeProjects(projects)
		}
	}

	return errors.New("unable to delete project with ID: " + string(id) + " - project not found")
}

/*
// UpdateProject TODO: Change the implementation to use a database instead of a file
func (s *FileProjectService) UpdateProject(project domain.Project) (domain.Project, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	projects, err := s.readProjects()
	if err != nil {
		return domain.Project{}, err
	}

	for i, p := range projects {
		if p.ID == project.ID {
			projects[i] = project
			return project, s.writeProjects(projects)
		}
	}

	return domain.Project{}, errors.New("project not found")
}*/

func (s *FileProjectService) UpdateProject(id int, update domain.ProjectUpdate) (domain.Project, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	projects, err := s.readProjects()
	if err != nil {
		return domain.Project{}, err
	}

	for i, project := range projects {
		if project.ID == id {
			// Update criteria if provided in the update
			if update.Name != nil {
				projects[i].Name = *update.Name
			}

			if update.Criteria != nil {
				projects[i].Criteria = *update.Criteria
			}

			if update.Stakeholders != nil {
				projects[i].Stakeholders = *update.Stakeholders
			}

			if update.DecisionMakers != nil {
				projects[i].DecisionMakers = *update.DecisionMakers
			}

			if update.Vendors != nil {
				projects[i].Vendors = *update.Vendors
			}

			// Write projects back to the file
			err = s.writeProjects(projects)
			if err != nil {
				return domain.Project{}, err
			}
			return projects[i], nil
		}
	}

	return domain.Project{}, errors.New("project not found")
}
