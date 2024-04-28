import React from "react";
import { useNavigate} from "react-router-dom";
import "./ProjectsDashboard.css";

function ProjectsDashboard() {
    const navigate = useNavigate();

    const getStatusClass = (isComplete) => {
        return isComplete ? "complete" : "incomplete";
    };

    // TODO: Get data from API
    const projects = [
        {
            "id": 1,
            "name": "Project Alpha",
            "decisionMakers": [
                {
                    "id": 101,
                    "name": "John Doe",
                    "criteriaRankingComplete": true,
                    "vendorRankingComplete": false
                },
                {
                    "id": 102,
                    "name": "Jane Smith",
                    "criteriaRankingComplete": false,
                    "vendorRankingComplete": true
                }
            ]
        },
        {
            "id": 2,
            "name": "Project Beta",
            "decisionMakers": [
                {
                    "id": 201,
                    "name": "Alice Johnson",
                    "criteriaRankingComplete": true,
                    "vendorRankingComplete": true
                },
                {
                    "id": 202,
                    "name": "Bob Brown",
                    "criteriaRankingComplete": true,
                    "vendorRankingComplete": true
                },
                {
                    "id": 203,
                    "name": "Charlie White",
                    "criteriaRankingComplete": true,
                    "vendorRankingComplete": true
                }
            ]
        }
    ];

    const handleCriteriaWeightingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaWeighting`);
    };

    const handleVendorRankingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaRanking`);
    };

    const handleFinalVendorRankingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/vendorRanking`);
    }

    return (
        <div className="projects-dashboard">
            <h1>Projects Dashboard</h1>
            {projects.map((project) => (
                <div key={project.id} className="project-section">
                    <h2>{project.name}</h2>
                    <table className="project-table">
                        <thead>
                        <tr>
                            <th>Decision Maker</th>
                            <th>Criteria Ranking Complete</th>
                            <th>Vendor Ranking Complete</th>
                            <th>Vendor Selection Ready</th>
                        </tr>
                        </thead>
                        <tbody>
                        {project.decisionMakers.map(dm => (
                            <tr key={dm.id}>
                                <td className={"decision-maker__name"}><b>{dm.name}</b></td>
                                <td className={getStatusClass(dm.criteriaRankingComplete)} onClick={() => handleCriteriaWeightingButtonClick(project.id)}>
                                    {dm.criteriaRankingComplete ? "Complete" : "Incomplete"}
                                </td>
                                <td className={getStatusClass(dm.vendorRankingComplete)} onClick={() => handleVendorRankingButtonClick(project.id)}>
                                    {dm.vendorRankingComplete ? "Complete" : "Incomplete"}
                                </td>
                                <td className={getStatusClass(dm.criteriaRankingComplete && dm.vendorRankingComplete)} onClick={() => handleFinalVendorRankingButtonClick(project.id)}>
                                    {dm.criteriaRankingComplete && dm.vendorRankingComplete ? "Complete" : "Incomplete"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default ProjectsDashboard;
