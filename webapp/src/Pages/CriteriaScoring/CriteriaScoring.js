import React, {useState} from "react";
import { useParams } from "react-router-dom";
import CriteriaScoreInput from "../../Components/CriteriaScoreInput/CriteriaScoreInput";
import "./CriteriaScoring.css";
import PDFViewer from "../../Components/PDFPreview/PDFPreview";
import useCriteriaScoringLogic from "./useCriteriaScoringLogic";
import useVendors from "./apiConnections/useVendors";
import {useAuth} from "../../contexts/AuthContext";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import SwapIcon from "../../SVGs/swap_horizontal.svg";
import SendPlane from "../../SVGs/send_plane.svg";

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

    const project = useFetchProject(projectId);

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
                <div className={"criteria__scoring__header"}>
                    <h1 className={"header"}>{project.name}</h1>
                    <h2 className={"sub-header"}>Criteria Scoring</h2>
                </div>
                {(criteria.length > 0 && Object.entries(criteriaMap).map(([criterionId, comparisons]) => (
                    <div key={criterionId}>
                        <h2 className={"criteria-name"}>{criteria.find(c => c.id.toString() === criterionId) ? criteria.find(c => c.id.toString() === criterionId).name : "Criterion not found"}</h2>
                        <div className={"criteria-criteria-group"}>
                            {comparisons.flatMap(comp => comp.comparisons.map((vendorComparison, index) => (
                                <div
                                    className={"criteria-criteria-section"}
                                    key={`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${index}`}>
                                    <div className={"query-container"}>
                                        <p className={"text"}>How much better
                                            does <b>Vendor {vendorComparison.baseVendorId}</b> perform in
                                            relation to <b>Vendor {vendorComparison.comparedVendorId}</b> in terms
                                            of <b>{criteria.find(c => c.id.toString() === criterionId).name}</b>?</p>
                                        <button
                                            className={"invert-button"}
                                            onClick={() => handleInvertScore(vendorComparison.baseVendorId, vendorComparison.comparedVendorId, criterionId)}>
                                            <img className={"logo"} src={SwapIcon} alt="Invert Scores"/>
                                            Invert
                                        </button>
                                    </div>
                                    <CriteriaScoreInput
                                        criterionId={`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`}
                                        currentScore={scores[`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`] || 0}
                                        onScoreChange={(newScore) => handleScoreChange(`${vendorComparison.baseVendorId}-${vendorComparison.comparedVendorId}-${criterionId}`, newScore)}
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
                    </div>
                ))) || (criteria.criterionId <= 0 ? <p>Loading criteria...</p> : <div>No Criteria Found</div>)}
                <div className={"submit-button-container"}>
                    <button className={"button-send"} onClick={handleSubmitScores}>
                        Submit <img src={SendPlane} alt="Submit"/>
                    </button>
                </div>
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
