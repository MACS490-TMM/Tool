import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import {useEffect, useState} from "react";
import useProjectCriteria from "../ProjectSummary/apiConnection/criteriaWeighting/useProjectCriteria";
import submitCriteriaScoring from "../ProjectSummary/apiConnection/criteriaScoring/submitCriteriaScoring";
import useFetchCriteriaScores from "./apiConnections/useFetchCriteriaScores";
import useFetchInconsistencies from "../CriteriaWeighting/apiConnections/useFetchInconsistencies";
import useFetchConflictingCriteria from "../CriteriaWeighting/apiConnections/useFetchConflictingCriteria";
import {useNavigate} from "react-router-dom";

const useCriteriaScoringLogic = (projectId, decisionMakerId) => {
    const project = useFetchProject(projectId);
    const [projectBaseCriteria, setProjectBaseCriteria] = useState([]);
    const [criteriaMap, setCriteriaMap] = useState({}); // Used to handle criteria comparisons
    const [scores, setScores] = useState({});
    const [comments, setComments] = useState({});
    const [textExtracted, setTextExtracted] = useState({});
    const [inverted, setInverted] = useState({});

    const navigate = useNavigate();

    const vendorComparisons = useFetchCriteriaScores(projectId, decisionMakerId);

    const urlInconsistencies = `http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/scores/inconsistencies`;
    const urlConflicts = `http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/scores/conflicts`;

    const inconsistencyInCriteria = useFetchInconsistencies(projectId, decisionMakerId, urlInconsistencies); // Fetch all inconsistencies from the API
    const conflictingCriteria = useFetchConflictingCriteria(projectId, decisionMakerId, urlConflicts); // Fetch conflicting criteria from the API

    useProjectCriteria(project, setProjectBaseCriteria); // Custom hook to manage project criteria

    // Organize the data to handle criteria comparisons
    function organizeData(data) {
        const criteriaMap = {};
        data.forEach(item => {
            if (!criteriaMap[item.criterionId]) {
                criteriaMap[item.criterionId] = [];
            }
            criteriaMap[item.criterionId].push(item);
        });
        return criteriaMap;
    }

    useEffect(() => {
        setCriteriaMap(organizeData(vendorComparisons));
    }, [vendorComparisons]);


    // Adjust weight based on whether it is inverted
    const adjustScore = (score, isInverted) => isInverted ? -Math.abs(score || 1) : Math.abs(score || 1);

    // Handle weight change for a criteria-criteria pair
    const handleScoreChange = (key, newScore) => {
        setScores(prevScores => ({
            ...prevScores,
            [key]: adjustScore(newScore, inverted[key])
        }));
    };

    // Handle weight inversion for a criteria-criteria pair
    // If inverted, the weight (X) is stored as negative, but displayed as 1/X
    const handleInvertScore = (baseVendorId, comparedVendorId, criteriaId) => {
        const key = `${baseVendorId}-${comparedVendorId}-${criteriaId}`;
        setInverted(prevInverted => ({
            ...prevInverted,
            [key]: !prevInverted[key]
        }));
    };

    const handleCommentsChanged = (key, newComments) => {
        setComments(prevComments => ({
            ...prevComments,
            [key]: newComments
        }));
    };

    const handleTextExtractionChanged = (key, newExtractedText) => {
        setTextExtracted(prevExtractedText => ({
            ...prevExtractedText,
            [key]: newExtractedText
        }));
    };

    // Parse and prepare the data for submission
    const prepareDataForSubmission = () => {
        // Create an object to hold each criterion with its corresponding vendor comparisons
        const dataByCriterion = {};

        // Loop through each score entry and organize them by criterionId
        Object.entries(scores).forEach(([key, score]) => {
            const [baseVendorId, comparedVendorId, criterionId] = key.split('-');
            const comment = comments[key] || '';
            const extractedText = textExtracted[key] || '';

            // Prepare the comparison object for this specific comparison
            const comparison = {
                baseVendorId: parseInt(baseVendorId, 10),
                comparedVendorId: parseInt(comparedVendorId, 10),
                score: score,
                textExtracted: extractedText,
                comments: comment
            };

            // If the criterionId doesn't have an entry in the object, create it
            if (!dataByCriterion[criterionId]) {
                dataByCriterion[criterionId] = {
                    projectId: parseInt(projectId, 10),
                    criterionId: parseInt(criterionId, 10),
                    decisionMakerId: parseInt(decisionMakerId, 10),
                    comparisons: []
                };
            }

            // Push the new comparison into the list of comparisons for this criterion
            dataByCriterion[criterionId].comparisons.push(comparison);
        });

        // Convert the object into an array of objects
        return Object.values(dataByCriterion);
    };

    // Submit the criteria scores to the backend
    const handleSubmitScores = async () => {
        const data = prepareDataForSubmission();

        if (data.length) {
            try {
                await submitCriteriaScoring(data, projectId, decisionMakerId)
                    .then(() => {
                        alert('Criteria with scores were submitted successfully');
                        navigate(`/project/dashboard`)
                    });
            } catch (error) {
                alert('Failed to submit criteria and their scores \n' + error.message);
            }
        } else {
            alert('No criteria scores to submit');
        }
    };

    // Set initial weights when criteria are loaded/changed
    useEffect(() => {
        if (projectBaseCriteria.length > 0 && vendorComparisons.length > 0) {
            const newScores = {};
            const newInverted = {};
            const textExtracted = {};
            const newComments = {};
            vendorComparisons.forEach((comp) => {  // Removed the index because we'll be iterating inside the comparisons array
                comp.comparisons.forEach((comparison) => {
                    const key = `${comparison.baseVendorId}-${comparison.comparedVendorId}-${comp.criterionId}`;

                    newScores[key] = comparison.score || 0;
                    newInverted[key] = comparison.score < 0;
                    textExtracted[key] = comparison.textExtracted || '';
                    newComments[key] = comparison.comments || '';
                });
            });
            setScores(newScores);
            setInverted(newInverted);
            setTextExtracted(textExtracted);
            setComments(newComments);
        }
    }, [projectBaseCriteria, vendorComparisons]);


    return {
        criteria: projectBaseCriteria,
        scores: scores,
        criteriaMap,
        inverted,
        textExtracted,
        comments,
        handleScoreChange,
        handleInvertScore,
        handleTextExtractionChanged,
        handleCommentsChanged,
        handleSubmitScores,
        isInconsistencyDetected: (baseId, comparedId, criterionId) => {
            return inconsistencyInCriteria.some(criterion =>
                criterion.criterionId === criterionId &&
                criterion.comparisons.some(comp =>
                    comp.baseVendorId === baseId &&
                    comp.comparedVendorId === comparedId &&
                    comp.inconsistency
                )
            );
        },
        isConflictDetected: (baseId, comparedId, criterionId) => {
            return conflictingCriteria.some(criterion =>
                criterion.criterionId === criterionId &&
                criterion.comparisons.some(comp =>
                    comp.baseVendorId === baseId &&
                    comp.comparedVendorId === comparedId &&
                    comp.conflict
                )
            );
        }
    };
}

export default useCriteriaScoringLogic;
