import React, {useState} from "react";
import { useParams } from "react-router-dom";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import "./CriteriaScoring.css";
import PDFViewer from "../../Components/PDFPreview/PDFPreview";
import useCriteriaScoringLogic from "./useCriteriaScoringLogic";

function CriteriaScoring() {
    let { projectId } = useParams();
    const decisionMakerId = 1; // TODO: Get the decision maker ID from the user
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
    } = useCriteriaScoringLogic(projectId, decisionMakerId);

    const [activePDF, setActivePDF] = useState('RFP'); // Added state for active PDF

    const handleChangeActivePDF = (pdfType) => {
        setActivePDF(pdfType);
    };

    return (
        <div className={"criteria-scoring__outer-container"}>
            <div className={"criteria-scoring__container"}>
                    {(criteria.length > 0 && Object.entries(criteriaMap).map(([criterionId, comparisons]) => (
                        <div key={criterionId}>
                            <h2>{criteria.find(c => c.id.toString() === criterionId).name}</h2>
                            {comparisons.flatMap(comp => comp.comparisons.map((vendorComparison, index) => (
                                <div key={`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${index}`}>
                                    <p>Compare Vendor {vendorComparison.baseVendorId} vs Vendor {vendorComparison.comparedVendorId}</p>
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
                                </div>
                            )))}
                        </div>
                    ))) || (<p>Loading criteria...</p>)}
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
