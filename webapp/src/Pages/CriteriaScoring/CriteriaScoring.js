import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import submitCriteriaScoring from "../ProjectSummary/apiConnection/Criteria/submitCriteriaScoring";

function CriteriaScoring() {
    let { projectId } = useParams();
    const [criteria, setCriteria] = useState([]);
    const project = useFetchProject(projectId);
    const decisionMakerId = 1; // TODO: Get the decision maker ID from the user

    // When project data is fetched and available, populate the criteria state
    useEffect(() => {
        if (project && project.criteria) {
            const updatedCriteria = project.criteria.map(criterion => ({
                ...criterion,
                score: criterion.score ? criterion.score : null,
            }));
            setCriteria(updatedCriteria);
        }
    }, [project]);

    /**
     * Handles the change of a criterion's score.
     * @param criterionId The ID of the criterion to change the score for.
     * @param newScore The new score to assign to the criterion.
     */
    const handleScoreChange = (criterionId, newScore) => {
        const updatedCriteria = criteria.map(criterion =>
            criterion.id === criterionId ? { ...criterion, score: newScore } : criterion
        );
        setCriteria(updatedCriteria);
    };

    /**
     * Handles the submission of criteria scores.
     * @returns {Promise<void>} A promise that resolves when the submission is complete.
     */
    const handleSubmitScores = async () => {
        try {
            await submitCriteriaScoring(projectId, decisionMakerId, criteria)
                .then(() => {
                    alert('Criteria with scores were submitted successfully');
                });
        } catch (error) {
            alert('Failed to submit criteria and their scores \n' + error.message);
        }
    };

    return (
        <div>
            {criteria.map(criterion => (
                <div key={criterion.id}>
                    <h3>{criterion.name}</h3>
                    <p>{criterion.explanation}</p>
                    <CriteriaScoreInput
                        criterionId={criterion.id}
                        currentScore={criterion.score}
                        onScoreChange={handleScoreChange}
                    />
                </div>
            ))}
            <button onClick={handleSubmitScores}>Submit Scores</button>
        </div>
    );
}

export default CriteriaScoring;
