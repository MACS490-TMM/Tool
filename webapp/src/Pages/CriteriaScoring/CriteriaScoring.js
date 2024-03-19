import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";

function CriteriaScoring() {
    let { projectId } = useParams();

    const [criteria, setCriteria] = useState([]);

    const project = useFetchProject(projectId);

    // When project data is fetched and available, populate the selections state
    useEffect(() => {
        if (project && project.criteria) {
            const criteria = project.criteria.map(criterion => ({
                id: criterion.id,
                name: criterion.name,
                explanation: criterion.explanation,
                score: null,
            }));
            setCriteria(criteria);
        }
    }, [project]);

    return (
        <div>
            {criteria.map(criterion => (
                <div key={criterion.id}>
                    <h3>{criterion.name}</h3>
                    <p>{criterion.explanation}</p>
                    <input type="number" min="0" max="10" step="1" />
                </div>
            ))}
        </div>
    );
}

export default CriteriaScoring;