import React, {useState} from "react";
import {useParams} from "react-router-dom";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import useProjectCriteria from "../ProjectSummary/apiConnection/criteriaWeighting/useProjectCriteria";
import "./CriteriaWeighting.css";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import submitCriteriaWeights from "../ProjectSummary/apiConnection/criteriaWeighting/submitCriteriaWeights";
import PDFViewer from "../../Components/PDFPreview/PDFPreview";

function CriteriaWeighting() {
    let { projectId } = useParams();
    let decisionMakerId = 1; // TODO: Get the decision maker ID from the user
    const project = useFetchProject(projectId);
    const [criteria, setCriteria] = useState([]);
    const [weights, setWeights] = useState({});
    const [comments, setComments] = useState({});
    const [inverted, setInverted] = useState({}); // State to track inversion of weights

    useProjectCriteria(project, setCriteria);

    // Helper function to adjust weight based on inversion state
    const adjustWeight = (weight, isInverted) => {
        // Ensure there's a valid score to invert from
        const validWeight = weight || 1;
        return isInverted ? -Math.abs(validWeight) : Math.abs(validWeight);
    };


    // Handles the change of a criterion's weight
    const handleWeightChange = (key, newWeight) => {
        setWeights(prevWeights => ({
            ...prevWeights,
            [key]: adjustWeight(newWeight, inverted[key])
        }));
    };


    // Handles the inversion and change of a criterion's weight
    const handleInvertWeight = (baseId, comparedId) => {
        const key = `${baseId}-${comparedId}`;
        const currentWeight = weights[key];
        const isInverted = !inverted[key];

        // Toggle inversion state
        setInverted(prevInverted => ({
            ...prevInverted,
            [key]: isInverted
        }));

        // Adjust weight based on new inversion state
        setWeights(prevWeights => ({
            ...prevWeights,
            [key]: adjustWeight(currentWeight, isInverted)
        }));
    };

    const handleCommentsChanged = (criterionId, newComments) => {
        setComments(prevComments => ({
            ...prevComments,
            [criterionId]: newComments
        }));
    }

    const prepareDataForSubmission = () => {
        return Object.entries(weights).map(([key, importanceScore]) => {
            const [baseCriterionId, comparedCriterionId] = key.split('-');
            const comment = comments[key] || '';
            return {
                projectId: parseInt(projectId, 10),
                decisionMakerId: decisionMakerId,
                baseCriterionId: parseInt(baseCriterionId, 10),
                comparedCriterionId: parseInt(comparedCriterionId, 10),
                importanceScore,
                comments: comment
            };
        });
    };
    const handleSubmitWeights = async () => {
        try {
            const data = prepareDataForSubmission();

            if (!data.length) {
                alert('No criteria comparisons to submit');
                return;
            }

            await submitCriteriaWeights(data, projectId, decisionMakerId).then(() => {
                alert('Criteria comparisons submitted successfully');
            });
        } catch (error) {
            alert('Failed to submit comparisons: ' + error.message);
        }
    };

    return (
        <div className={"criteria-scoring__outer-container"}>
            <div className={"criteria-scoring__container"}>
                <h1>Criteria Weighting</h1>
                {criteria.length > 0 ? (
                    criteria.map((baseCriterion) => (
                        <div key={baseCriterion.id}>
                            <h2>{baseCriterion.name}</h2>
                            {criteria.filter(c => c.id !== baseCriterion.id).map(comparedCriterion => (
                                <div key={comparedCriterion.id}>
                                    How much more important is {baseCriterion.name} in relation
                                    to {comparedCriterion.name}
                                    <CriteriaScoreInput
                                        criterionId={`${baseCriterion.id}-${comparedCriterion.id}`}
                                        currentScore={weights[`${baseCriterion.id}-${comparedCriterion.id}`] || 0}
                                        onScoreChange={handleWeightChange}
                                        onInvertScore={() => handleInvertWeight(baseCriterion.id, comparedCriterion.id)}
                                        isInverted={!!inverted[`${baseCriterion.id}-${comparedCriterion.id}`]}
                                    />
                                    <div className={"criteria-comments__container"}>
                                        <textarea onChange={(e) => handleCommentsChanged(`${baseCriterion.id}-${comparedCriterion.id}`, e.target.value)} placeholder={"Enter comments here"}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))) : <p>Loading criteria...</p>}
                <button className={"button-send"} onClick={handleSubmitWeights}>Submit Comparisons</button>
            </div>
            <div className={"documents__container"}>
                <PDFViewer url={`http://localhost:8080/projects/${projectId}/pdf/test`}/>
            </div>
        </div>
    );
}

export default CriteriaWeighting;
