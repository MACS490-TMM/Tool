import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import submitCriteriaScoring from "../ProjectSummary/apiConnection/Criteria/submitCriteriaScoring";
import "./CriteriaScoring.css";

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
                textExtracted: criterion.textExtracted ? criterion.textExtracted : "",
                comments: criterion.comments ? criterion.comments : ""
            }));
            console.log(updatedCriteria);
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

    const handleTextExtractionChanged = (criterionId, newText) => {
        const updatedCriteria = criteria.map(criterion =>
            criterion.id === criterionId ? { ...criterion, textExtracted: newText } : criterion
        );
        setCriteria(updatedCriteria);
    };

    const handleCommentsChanged = (criterionId, newComments) => {
        const updatedCriteria = criteria.map(criterion =>
            criterion.id === criterionId ? { ...criterion, comments: newComments } : criterion
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
        <div className={"criteria-scoring__outer-container"}>
            <div className={"criteria-scoring__container"}>
                {criteria.map(criterion => (
                    <div key={criterion.id}>
                        <h3>{criterion.name}</h3>
                        <p>{criterion.explanation}</p>
                        <CriteriaScoreInput
                            criterionId={criterion.id}
                            currentScore={criterion.score}
                            onScoreChange={handleScoreChange}
                        />
                        <div className={"text-extraction__container"}>
                            <textarea onChange={(e) => handleTextExtractionChanged(criterion.id, e.target.value)} placeholder={"Enter text extraction here"}/>
                        </div>
                        <div className={"criteria-comments__container"}>
                            <textarea onChange={(e) => handleCommentsChanged(criterion.id, e.target.value)} placeholder={"Enter comments here"}/>
                        </div>
                    </div>
                ))}
                <button onClick={handleSubmitScores}>Submit Scores</button>
            </div>
            <div className={"documents__container"}>
                Preview of text
            </div>
        </div>
    );
}

export default CriteriaScoring;
