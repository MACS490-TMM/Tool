import React, {useState} from "react";
import "./CriteriaScoringInconsistencies.css";
import {useParams} from "react-router-dom";
import CriteriaScoreInput from "../../../Components/CriteriaScoreInput/CriteriaScoreInput";
import useCriteriaScoringLogic from "../useCriteriaScoringLogic";
import PDFViewer from "../../../Components/PDFPreview/PDFPreview";

function CriteriaScoringInconsistencies() {
    let { projectId } = useParams();
    let decisionMakerId = 1; // TODO: Get the decision maker ID from the user

    const {
        criteria,
        scores,
        inverted,
        criteriaMap,
        textExtracted,
        comments,
        handleScoreChange,
        handleInvertScore,
        handleTextExtractionChanged,
        handleCommentsChanged,
        handleSubmitScores,
        isInconsistencyDetected,
    } = useCriteriaScoringLogic(projectId, decisionMakerId);

    const [activePDF, setActivePDF] = useState('RFP'); // Added state for active PDF

    const handleChangeActivePDF = (pdfType) => {
        setActivePDF(pdfType);
    };
    return (
        <div className={"criteria-scoring__outer-container"}>
            <div className={"criteria-scoring__container"}>
                <h1>Criteria Scoring w/Inconsistencies</h1>
                {(criteria.length > 0 && Object.entries(criteriaMap).map(([criterionId, comparisons]) => (
                    <div key={criterionId}>
                        <h2>{criteria.find(c => c.id.toString() === criterionId).name}</h2>
                        {comparisons.flatMap(comp => comp.comparisons.map((vendorComparison, index) => (
                            <div key={`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${index}`}>
                                <p>How much better does <b>Vendor {vendorComparison.baseVendorId}</b> perform in
                                    relation to <b>Vendor {vendorComparison.comparedVendorId}</b> in terms
                                    of <b>{criteria.find(c => c.id.toString() === criterionId).name}</b>?</p>
                                <CriteriaScoreInput
                                    criterionId={`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`}
                                    currentScore={scores[`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`] || 0}
                                    onScoreChange={(newScore) => handleScoreChange(`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`, newScore)}
                                    onInvertScore={() => handleInvertScore(vendorComparison.baseVendorId, vendorComparison.comparedVendorId, criterionId)}
                                    isInverted={inverted[`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`]}
                                />
                                <div className={"text-extraction__container"}>
                                    <textarea
                                        value={textExtracted[`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`] || ""}
                                        onChange={(e) => handleTextExtractionChanged(`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`, e.target.value)}
                                        placeholder={"Enter text extraction here"}/>
                                </div>
                                <div className={"criteria-comments__container"}>
                                    <textarea
                                        value={comments[`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`] || ""}
                                        onChange={(e) => handleCommentsChanged(`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`, e.target.value)}
                                        placeholder={"Enter comments here"}/>
                                </div>
                                {isInconsistencyDetected(vendorComparison.baseVendorId, vendorComparison.comparedVendorId, parseInt(criterionId)) && (
                                    <div className="inconsistency-indicator">
                                        Inconsistency detected.
                                    </div>
                                )}
                            </div>
                        )))}
                    </div>
                ))) || (criteria.criterionId <= 0 ? <p>Loading criteria...</p> : <div>No Criteria Found</div>)}
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

export default CriteriaScoringInconsistencies;