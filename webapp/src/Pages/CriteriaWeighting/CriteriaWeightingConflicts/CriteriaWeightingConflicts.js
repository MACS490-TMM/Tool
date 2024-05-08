import React from "react";
import "./CriteriaWeightingConflicts.css";
import {useParams} from "react-router-dom";
import CriteriaScoreInput from "../../../Components/CriteriaScoreInput/CriteriaScoreInput";
import useCriteriaWeightingLogic from "../useCriteriaWeightingLogic";
import PDFViewer from "../../../Components/PDFPreview/PDFPreview";
import {useAuth} from "../../../contexts/AuthContext";
import useFetchProject from "../../ProjectSummary/apiConnection/Project/useFetchProject";
import SwapIcon from "../../../SVGs/swap_horizontal.svg";
import SendPlane from "../../../SVGs/send_plane.svg";
import WarningIcon from "../../../SVGs/warning.svg";

function CriteriaWeightingConflicts() {
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
        isConflictDetected
    } = useCriteriaWeightingLogic(projectId, getUserID());

    const project = useFetchProject(projectId)

    const getPDFUrl = () => {
        return `http://localhost:8080/projects/${projectId}/files/RFP/RFP`;
    };

    const renderPDFView = () => {
        return <PDFViewer url={getPDFUrl()}/>;
    };

    return (
        <div className={"criteria-scoring__outer-container"}>
            <div className={"criteria-scoring__container"}>
                <div className={"criteria__weighting__header"}>
                    <h1 className={"header"}>{project.name}</h1>
                    <h2 className={"sub-header"}>Criteria Weighting w/Conflicts</h2>
                </div>
                {criteria.length > 0 ? (
                    criteria.map((baseCriterion) => (
                        <div key={baseCriterion.id}>
                            <div className={"criteria-explanations-group"}>
                                <h2 className={"criteria-name"}>{baseCriterion.name}</h2>
                                <p className={"criteria-explanation"}>{baseCriterion.explanation}</p>
                            </div>
                            <div className={"criteria-criteria-group"}>
                                {criteria.filter(c => c.id !== baseCriterion.id).map(comparedCriterion => (
                                    <div className={"criteria-criteria-section"} key={comparedCriterion.id}>
                                        <div className={"query-container"}>
                                            <p className={"text"}>How much more important is <b
                                                className={"bold"}>{baseCriterion.name}</b> in relation to <b
                                                className={"bold"}>{comparedCriterion.name}</b> ?</p>
                                            <button
                                                className={"invert-button"}
                                                onClick={() => handleInvertWeight(baseCriterion.id, comparedCriterion.id, weights[`${baseCriterion.id}-${comparedCriterion.id}`])}>
                                                <img className={"logo"} src={SwapIcon} alt="Invert Scores"/>
                                                Invert
                                            </button>
                                        </div>
                                        <CriteriaScoreInput
                                            criterionId={`${baseCriterion.id}-${comparedCriterion.id}`}
                                            currentScore={weights[`${baseCriterion.id}-${comparedCriterion.id}`] || 0}
                                            onScoreChange={(newWeight) => handleWeightChange(`${baseCriterion.id}-${comparedCriterion.id}`, newWeight)}
                                            isInverted={inverted[`${baseCriterion.id}-${comparedCriterion.id}`]}
                                        />
                                        <div className={"criteria-comments__container"}>
                                            <textarea
                                                className={"criteria-comments__input"}
                                                value={comments[`${baseCriterion.id}-${comparedCriterion.id}`] || ""}
                                                onChange={(e) => handleCommentsChanged(`${baseCriterion.id}-${comparedCriterion.id}`, e.target.value)}
                                                placeholder={"Enter comments here"}/>
                                        </div>
                                        {isConflictDetected(baseCriterion.id, comparedCriterion.id) && (
                                            <div className="inconsistency-indicator">
                                                <img className={"warning-icon"} src={WarningIcon} alt="Warning"/>
                                                <div className="tooltip">Conflict detected
                                                    <span className="tooltipText">
                                                    Conflict detected! Resolve it before progressing.
                                                </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))) : (criteria.criterionId <= 0 ? <p>Loading criteria...</p> : <div>No Criteria Found</div>)}
                <div className={"submit-button-container"}>
                    <button className={"button-send"} onClick={handleSubmitWeights}>
                    Submit <img src={SendPlane} alt="Submit"/>
                    </button>
                </div>
            </div>
            <div className={"documents__container"}>
                {renderPDFView()}
            </div>
        </div>
    );
}

export default CriteriaWeightingConflicts;