import React, {useState} from "react";
import { useParams } from "react-router-dom";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import "./CriteriaScoring.css";
import PDFViewer from "../../Components/PDFPreview/PDFPreview";
import useCriteriaScoringLogic from "./useCriteriaScoringLogic";
import useVendors from "./apiConnections/useVendors";
import {useAuth} from "../../contexts/AuthContext";

function CriteriaScoring() {
    const { getUserID } = useAuth();
    let { projectId } = useParams();

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
    } = useCriteriaScoringLogic(projectId, getUserID());

    const [activeVendorId, setActiveVendorId] = useState(null);
    const { vendors, isLoading, error } = useVendors(projectId);

    const handleVendorChange = (vendorId) => {
        setActiveVendorId(vendorId);
    };

    const getPDFUrl = () => {
        if (activeVendorId === null) {
            return `http://localhost:8080/projects/${projectId}/files/RFP/RFP`;
        } else {
            return `http://localhost:8080/projects/${projectId}/files/VPs/vendor/${activeVendorId}/VP`;
        }
    };

    const renderPDFView = () => {
        if (isLoading) {
            return <p>Loading documents...</p>;
        } else if (error) {
            return <p>Error loading documents: {error}</p>;
        } else {
            return <PDFViewer url={getPDFUrl()} />;
        }
    };

    return (
        <div className={"criteria-scoring__outer-container"}>
            <div className={"criteria-scoring__container"}>
                <h1>Criteria Scoring</h1>
                {(criteria.length > 0 && Object.entries(criteriaMap).map(([criterionId, comparisons]) => (
                    <div key={criterionId}>
                        <h2>{criteria.find(c => c.id.toString() === criterionId) ? criteria.find(c => c.id.toString() === criterionId).name : "Criterion not found"}</h2>
                        {comparisons.flatMap(comp => comp.comparisons.map((vendorComparison, index) => (
                            <div
                                key={`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${index}`}>
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
                            </div>
                        )))}
                    </div>
                ))) || (criteria.criterionId <= 0 ? <p>Loading criteria...</p> : <div>No Criteria Found</div>)}
                <button className={"button-send"} onClick={handleSubmitScores}>Submit Scores</button>
            </div>
            <div className="documents__container">
                <div>
                    <button className={"button-paper-selection"} onClick={() => setActiveVendorId(null)}>RFP</button>
                    {vendors.map(vendor => (
                        <button className={"button-paper-selection"} key={vendor.id} onClick={() => handleVendorChange(vendor.id)}>
                            {vendor.name}'s VP
                        </button>
                    ))}
                </div>
                {renderPDFView()}
            </div>
        </div>
    );
}

export default CriteriaScoring;
