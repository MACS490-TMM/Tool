import React from "react";
import {useParams} from "react-router-dom";
import "./CriteriaWeighting.css";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import PDFViewer from "../../Components/PDFPreview/PDFPreview";
import useCriteriaWeightingLogic from "./useCriteriaWeightingLogic";
import {useAuth} from "../../contexts/AuthContext";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";

function CriteriaWeighting() {
    const { getUserID } = useAuth();
    let { projectId } = useParams();
    const {
        criteria,
        weights,
        inverted,
        comments,
        handleWeightChange,
        handleInvertWeight,
        handleCommentsChanged,
        handleSubmitWeights,
    } = useCriteriaWeightingLogic(projectId, getUserID());

    const project = useFetchProject(projectId)

    const getPDFUrl = () => {
        return `http://localhost:8080/projects/${projectId}/files/RFP/RFP`;
    };

    const renderPDFView = () => {
        return <PDFViewer url={getPDFUrl()} />;
    };

    return (
        <div className={"criteria-scoring__outer-container"}>
            <div className={"criteria-scoring__container"}>
                <div className={"criteria__weighting__header"}>
                    <h1 className={"header"}>{project.name}</h1>
                    <h2 className={"sub-header"}>Criteria Weighting</h2>
                </div>
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
                    ))) : (criteria.criterionId <= 0 ? <p>Loading criteria...</p> : <div>No Criteria Found</div>)}
                <button className={"button-send"} onClick={handleSubmitWeights}>Submit Comparisons</button>
            </div>
            <div className={"documents__container"}>
                {renderPDFView()}
            </div>
        </div>
    );
}

export default CriteriaWeighting;
