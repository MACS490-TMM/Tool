import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import useProjectCriteria from "../ProjectSummary/apiConnection/criteriaScoring/useProjectCriteria";  // Import the custom hook
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import submitCriteriaScoring from "../ProjectSummary/apiConnection/criteriaScoring/submitCriteriaScoring";
import "./CriteriaScoring.css";
import PDFViewer from "../../Components/PDFPreview/PDFPreview";

function CriteriaScoring() {
    let { projectId } = useParams();
    const [criteria, setCriteria] = useState([]);
    const project = useFetchProject(projectId);
    const decisionMakerId = 1; // TODO: Get the decision maker ID from the user
    const [activePDF, setActivePDF] = useState('RFP'); // Added state for active PDF

    // Custom hook to manage project criteria
    useProjectCriteria(project, setCriteria);

    const handleChangeActivePDF = (pdfType) => {
        setActivePDF(pdfType);
    };

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
                <div>
                    <button onClick={() => handleChangeActivePDF('RFP')}>RFP</button>
                    <button onClick={() => handleChangeActivePDF('VP')}>VP</button>
                </div>
                {activePDF === 'RFP' ? (
                    <PDFViewer url={`http://localhost:8080/projects/${projectId}/pdf/test`} />
                ) : (
                    <PDFViewer url={`http://localhost:8080/projects/${projectId}/pdf/test2`} />
                )}
            </div>
        </div>
    );
}

export default CriteriaScoring;
