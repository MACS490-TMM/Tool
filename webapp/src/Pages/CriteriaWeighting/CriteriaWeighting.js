import React from "react";
import {useParams} from "react-router-dom";
import "./CriteriaWeighting.css";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import PDFViewer from "../../Components/PDFPreview/PDFPreview";
import useCriteriaWeightingLogic from "./useCriteriaWeightingLogic";

function CriteriaWeighting() {
    let { projectId } = useParams();
    let decisionMakerId = 1; // TODO: Get the decision maker ID from the user
    const {
        criteria,
        weights,
        inverted,
        comments,
        handleWeightChange,
        handleInvertWeight,
        handleCommentsChanged,
        handleSubmitWeights,
    } = useCriteriaWeightingLogic(projectId, decisionMakerId);

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
                                    <p>How much more important is <b>{baseCriterion.name}</b> in relation to <b>{comparedCriterion.name}</b></p>
                                    <CriteriaScoreInput
                                        criterionId={`${baseCriterion.id}-${comparedCriterion.id}`}
                                        currentScore={weights[`${baseCriterion.id}-${comparedCriterion.id}`] || 0}
                                        onScoreChange={(newWeight) => handleWeightChange(`${baseCriterion.id}-${comparedCriterion.id}`, newWeight)}
                                        onInvertScore={() => handleInvertWeight(baseCriterion.id, comparedCriterion.id, weights[`${baseCriterion.id}-${comparedCriterion.id}`])}
                                        isInverted={inverted[`${baseCriterion.id}-${comparedCriterion.id}`]}
                                    />
                                    <div className={"criteria-comments__container"}>
                                        <textarea
                                            value={comments[`${baseCriterion.id}-${comparedCriterion.id}`] || ""}
                                            onChange={(e) => handleCommentsChanged(`${baseCriterion.id}-${comparedCriterion.id}`, e.target.value)}
                                            placeholder={"Enter comments here"}/>
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
