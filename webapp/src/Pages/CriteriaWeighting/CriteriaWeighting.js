import React, {useState} from "react";
import {useParams} from "react-router-dom";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import useProjectCriteria from "../ProjectSummary/apiConnection/criteriaWeighting/useProjectCriteria";
import "./CriteriaWeighting.css";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import submitCriteriaWeights from "../ProjectSummary/apiConnection/criteriaWeighting/submitCriteriaWeights";

function CriteriaWeighting() {
    let { projectId } = useParams();
    let decisionMakerId = 1; // TODO: Get the decision maker ID from the user
    const project = useFetchProject(projectId);
    const [criteria, setCriteria] = useState([]);
    const [weights, setWeights] = useState({});
    const [comments, setComments] = useState({}); // TODO: Implement comments for each comparison

    useProjectCriteria(project, setCriteria);

    const handleWeightChange = (criterionId, newWeight) => {
        setWeights(prevWeights => ({
            ...prevWeights,
            [criterionId]: newWeight
        }));
    };

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
        <div className="criteria-weighting">
            <h1>Criteria Weighting</h1>
            {criteria.length > 0 ? (
                criteria.map((baseCriterion) => (
                    <div key={baseCriterion.id}>
                        <h2>{baseCriterion.name}</h2>
                        {criteria.filter(c => c.id !== baseCriterion.id).map(comparedCriterion => (
                            <div key={comparedCriterion.id}>
                                How much more important is {baseCriterion.name} in relation to {comparedCriterion.name}
                                <CriteriaScoreInput
                                    criterionId={`${baseCriterion.id}-${comparedCriterion.id}`}
                                    currentScore={weights[`${baseCriterion.id}-${comparedCriterion.id}`] || 0} // TODO: Set the default score to 1?
                                    onScoreChange={handleWeightChange}
                                />
                            </div>
                        ))}
                    </div>
                ))) : <p>Loading criteria...</p>}
            <button className={"button-send"} onClick={handleSubmitWeights}>Submit Comparisons</button>
        </div>
    );
}

export default CriteriaWeighting;
