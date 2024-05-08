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
            ],
            "vendors": [
                {
                    "id": 1,
                    "name": "Vendor 1"
                },
                {
                    "id": 2,
                    "name": "Vendor 2"
                }
            ],
            "tasks": {
                "RFPUpload": true,
                "criteriaDefinition": true,
                "vendorAssigning": true,
                "VPUpload": true
            }
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
            ],
            "tasks": {
                "RFPUpload": true,
                "criteriaDefinition": false,
                "vendorAssigning": false,
                "VPUpload": false
            }
        },
        {
            "id": 3,
            "name": "Project Charlie",
            "decisionMakers": [
                {
                    "id": 301,
                    "name": "Joseph Black",
                    "criteriaRankingComplete": true,
                    "vendorRankingComplete": true
                },
                {
                    "id": 302,
                    "name": "Alex Green",
                    "criteriaRankingComplete": false,
                    "vendorRankingComplete": true
                },
                {
                    "id": 303,
                    "name": "Chuck Purple",
                    "criteriaRankingComplete": false,
                    "vendorRankingComplete": false
                }
            ],
            "tasks": {
                "RFPUpload": true,
                "criteriaDefinition": true,
                "vendorAssigning": true,
                "VPUpload": true
            }
        }
    ];

    const handleFinalVendorRankingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/vendorRanking`);
    }

    const handleCriteriaDefinitionButtonClick = (projectId) => {
        navigate(`/project/setup/criteriaDefinition/${projectId}`);
    }

    const handleAssignVendorsButtonClick = (projectId) => {
        navigate(`/project/${projectId}/assignVendors`);
    }

    return (
        <div className="projects-dashboard">
            <h1>Projects Dashboard</h1>
            {projects.map((project) => (
                <div key={project.id} className="project-section">
                    <div className={"dashboard-header"}>
                        <h2>{project.name}</h2>
                        <div className={"dashboard-header--inner"}>
                            <button onClick={() => navigate(`/project/${project.id}/RFPUpload`)}>Upload RFP</button>
                            {(project.vendors && project.vendors.map(vendor => (
                                <button key={vendor.id} onClick={() => navigate(`/project/${project.id}/vendor/${vendor.id}/VPUpload`)}>Upload VP for {vendor.name}</button>
                            ))) || (<button className={"disabled-button"}>Upload VPs</button>)}
                        </div>
                    </div>
                    <div className={"h3"}>
                        <h3>My Tasks</h3>
                    </div>
                    <table className="project-table">
                        <thead>
                        <tr>
                            <th>Upload RFP</th>
                            <th>Criteria Definition</th>
                            <th>Assign Vendors</th>
                            <th>Upload VPs</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className={"complete unhoverable" + (getStatusClass(project.tasks.RFPUpload) ? " " + getStatusClass(project.tasks.RFPUpload) : "")}>{project.tasks.RFPUpload ? "Complete" : "Incomplete"}</td>
                            <td className={"complete" + (getStatusClass(project.tasks.criteriaDefinition) ? " " + getStatusClass(project.tasks.criteriaDefinition) : "")} onClick={() => handleCriteriaDefinitionButtonClick(project.id)}>{project.tasks.criteriaDefinition ? "Complete" : "Incomplete"}</td>
                            <td className={"complete" + (getStatusClass(project.tasks.vendorAssigning) ? " " + getStatusClass(project.tasks.vendorAssigning) : "")} onClick={() => handleAssignVendorsButtonClick(project.id)}>{project.tasks.vendorAssigning ? "Complete" : "Incomplete"}</td>
                            <td className={"complete unhoverable" + (getStatusClass(project.tasks.VPUpload) ? " " + getStatusClass(project.tasks.VPUpload) : "")}>{project.tasks.VPUpload ? "Complete" : "Incomplete"}</td>
                        </tr>

                        </tbody>
                    </table>

                    <div className={"h3-second"}>
                        <h3>Decision Maker Tasks</h3>
                    </div>

                    <table className="project-table">
                        <thead>
                        <tr>
                            <th>Decision Maker</th>
                            <th>Criteria Ranking Status</th>
                            <th>Vendor Ranking Status</th>
                            <th>Vendor Selection Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {project.decisionMakers.map(dm => (
                            <tr key={dm.id}>
                                <td className={"decision-maker__name unhoverable"}><b>{dm.name}</b></td>
                                <td className={"unhoverable " + (getStatusClass(dm.criteriaRankingComplete) ? getStatusClass(dm.criteriaRankingComplete) : "")}>
                                    {dm.criteriaRankingComplete ? "Complete" : "Incomplete"}
                                </td>
                                <td className={"unhoverable " + (getStatusClass(dm.vendorRankingComplete) ? getStatusClass(dm.vendorRankingComplete) : "")}>
                                    {dm.vendorRankingComplete ? "Complete" : "Incomplete"}
                                </td>
                                <td className={getStatusClass(dm.criteriaRankingComplete && dm.vendorRankingComplete)}
                                    onClick={() => handleFinalVendorRankingButtonClick(project.id)}>
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
