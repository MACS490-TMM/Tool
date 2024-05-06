import React from "react";
import {useAuth} from "../../contexts/AuthContext";
import "./ProjectsDashboardDM.css";
import {useNavigate} from "react-router-dom";

function ProjectsDashboardDM() {
    const { getUserName } = useAuth();
    const navigate = useNavigate();

    const getStatusClass = (status) => {
        if (status === null) {
            return "pending";
        }
        return status ? "complete" : "incomplete";
    };

    const getStatusText = (status) => {
        if (status === null) {
            return "Pending";
        }
        return status ? "Complete" : "Incomplete";
    };

    const getStatusYesNo = (status) => {
        if (status === null) {
            return "Pending";
        }
        return status ? "Yes" : "No";
    };

    const isTaskComplete = (task) => {
        return task.criteriaRankingComplete && task.vendorRankingComplete &&
            !task.criteriaRankingConflicts && !task.criteriaRankingInconsistencies &&
            !task.vendorRankingConflicts && !task.vendorRankingInconsistencies &&
            task.criteriaRankingConflicts !== null && task.criteriaRankingInconsistencies !== null &&
            task.vendorRankingConflicts !== null && task.vendorRankingInconsistencies !== null;
    }

    const handleCriteriaWeightingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaWeighting`);
    };

    const handleCriteriaWeightingInconsistencyButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaWeightingInconsistency`);
    }

    const handleCriteriaWeightingConflictButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaWeightingConflict`);
    }

    const handleVendorRankingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaRanking`);
    };

    const handleVendorRankingInconsistencyButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaScoreInconsistency`);
    }

    const handleVendorRankingConflictButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaScoreConflict`);
    }

    // TODO: Get data from API
    const projects = [
        {
            "id": 1,
            "name": "Project Alpha",
            "tasks": [
                {
                    "decisionMakerName": "admin",
                    "criteriaRankingComplete": false,
                    "criteriaRankingInconsistencies": false,
                    "criteriaRankingConflicts": false,
                    "vendorRankingComplete": false,
                    "vendorRankingInconsistencies": false,
                    "vendorRankingConflicts": false,
                }
            ]
        },
        {
            "id": 2,
            "name": "Project Beta",
            "tasks": [
                {
                    "decisionMakerName": "admin",
                    "criteriaRankingComplete": true,
                    "criteriaRankingInconsistencies": false,
                    "criteriaRankingConflicts": false,
                    "vendorRankingComplete": true,
                    "vendorRankingInconsistencies": null,
                    "vendorRankingConflicts": false,
                },
                {
                    "decisionMakerName": "Bob Brown",
                    "criteriaRankingComplete": true,
                    "criteriaRankingInconsistencies": true,
                    "criteriaRankingConflicts": true,
                    "vendorRankingComplete": true,
                    "vendorRankingInconsistencies": false,
                    "vendorRankingConflicts": false,
                },
                {
                    "decisionMakerName": "Charlie White",
                    "criteriaRankingComplete": true,
                    "criteriaRankingInconsistencies": false,
                    "criteriaRankingConflicts": false,
                    "vendorRankingComplete": true,
                    "vendorRankingInconsistencies": false,
                    "vendorRankingConflicts": false,
                }
            ]
        },
        {
            "id": 3,
            "name": "Project Charlie",
            "tasks": [
                {
                    "decisionMakerName": "admin",
                    "criteriaRankingComplete": true,
                    "criteriaRankingInconsistencies": false,
                    "criteriaRankingConflicts": false,
                    "vendorRankingComplete": true,
                    "vendorRankingInconsistencies": false,
                    "vendorRankingConflicts": false,
                },
                {
                    "decisionMakerName": "Alex Green",
                    "criteriaRankingComplete": true,
                    "criteriaRankingInconsistencies": false,
                    "criteriaRankingConflicts": false,
                    "vendorRankingComplete": true,
                    "vendorRankingInconsistencies": false,
                    "vendorRankingConflicts": false,
                }
            ]
        }
    ];

    const canAccessVendorRanking = (task) => {
        return task.criteriaRankingComplete;
    };

    const canAccessInconsistenciesAndConflicts = (task) => {
        return task.criteriaRankingComplete;
    };

    const canAccessVendorTasks = (task) => {
        return task.criteriaRankingComplete && task.vendorRankingComplete;
    };


    return (
        <div className="projects-dashboard">
            <h1>Projects Dashboard</h1>
            {projects.map((project) => (
                <div key={project.id} className="project-section">
                    <h2>{project.name}</h2>
                    <table className="project-table">
                        <thead>
                        <tr>
                            <th>DM</th>
                            <th>Criteria Ranking (CR)</th>
                            <th>CR Inconsistencies</th>
                            <th>CR Conflicts</th>
                            <th>Vendor Ranking (VR)</th>
                            <th>VR Inconsistencies</th>
                            <th>VR Conflicts</th>
                            <th>Complete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {project.tasks.map((task) => {
                            const isCurrentUser = task.decisionMakerName === getUserName();
                            const taskCompleteClass = getStatusClass(isTaskComplete(task));
                            const taskCompleteText = isTaskComplete(task) ? "Complete" : "Pending";
                            const rowClass = !isCurrentUser ? "not-current-user-row" : "";
                            return (
                                <tr key={task.decisionMakerName} className={rowClass}>
                                    <td className={"decision-maker__name"}><b>{isCurrentUser ? getUserName() : "DM"}</b></td>
                                    {isCurrentUser ? (
                                        <>
                                            <td className={getStatusClass(task.criteriaRankingComplete)} onClick={() => handleCriteriaWeightingButtonClick(project.id)}>{getStatusText(task.criteriaRankingComplete)}</td>
                                            <td className={canAccessInconsistenciesAndConflicts(task) ? getStatusYesNo(task.criteriaRankingInconsistencies) : "unavailable"} onClick={() => canAccessInconsistenciesAndConflicts(task) && handleCriteriaWeightingInconsistencyButtonClick(project.id)}>{canAccessInconsistenciesAndConflicts(task) ? getStatusYesNo(task.criteriaRankingInconsistencies) : "Unavailable"}</td>
                                            <td className={canAccessInconsistenciesAndConflicts(task) ? getStatusYesNo(task.criteriaRankingConflicts) : "unavailable"} onClick={() => canAccessInconsistenciesAndConflicts(task) && handleCriteriaWeightingConflictButtonClick(project.id)}>{canAccessInconsistenciesAndConflicts(task) ? getStatusYesNo(task.criteriaRankingConflicts) : "Unavailable"}</td>
                                            <td className={canAccessVendorRanking(task) ? getStatusClass(task.vendorRankingComplete) : "unavailable"} onClick={() => canAccessVendorRanking(task) && handleVendorRankingButtonClick(project.id)}>{canAccessVendorRanking(task) ? getStatusText(task.vendorRankingComplete) : "Unavailable"}</td>
                                            <td className={canAccessVendorTasks(task) ? getStatusYesNo(task.vendorRankingInconsistencies) : "unavailable"} onClick={() => canAccessVendorTasks(task) && handleVendorRankingInconsistencyButtonClick(project.id)}>{canAccessVendorTasks(task) ? getStatusYesNo(task.vendorRankingInconsistencies) : "Unavailable"}</td>
                                            <td className={canAccessVendorTasks(task) ? getStatusYesNo(task.vendorRankingConflicts) : "unavailable"} onClick={() => canAccessVendorTasks(task) && handleVendorRankingConflictButtonClick(project.id)}>{canAccessVendorTasks(task) ? getStatusYesNo(task.vendorRankingConflicts) : "Unavailable"}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td colSpan="3" className={taskCompleteClass}>{taskCompleteText}</td>
                                            <td colSpan="3" className={taskCompleteClass}>{taskCompleteText}</td>
                                        </>
                                    )}
                                    <td className={taskCompleteClass}>{taskCompleteText}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );

}

export default ProjectsDashboardDM;