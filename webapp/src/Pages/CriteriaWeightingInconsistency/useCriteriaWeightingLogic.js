import {useEffect, useState} from 'react';
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import useProjectCriteria from "../ProjectSummary/apiConnection/criteriaWeighting/useProjectCriteria";
import submitCriteriaWeights from "../ProjectSummary/apiConnection/criteriaWeighting/submitCriteriaWeights";
import useFetchCriteriaWeights from "./apiConnections/useFetchCriteriaWeights";
import useFetchInconsistencies from "./apiConnections/useFetchInconsistencies";

const useCriteriaWeightingLogic = (projectId, decisionMakerId) => {
    const project = useFetchProject(projectId); // Fetch the project
    const [projectBaseCriteria, setProjectBaseCriteria] = useState([]); // Base criteria

    const [weights, setWeights] = useState({});
    const [comments, setComments] = useState({});
    const [inverted, setInverted] = useState({});

    const criteriaComparisons = useFetchCriteriaWeights(projectId, decisionMakerId); // Fetch criteria weights for every criteria-criteria pair from the API
    const inconsistencies = useFetchInconsistencies(projectId, decisionMakerId); // Fetch all inconsistencies from the API

    useProjectCriteria(project, setProjectBaseCriteria); // Custom hook to manage project criteria

    // Adjust weight based on whether it is inverted
    const adjustWeight = (weight, isInverted) => isInverted ? -Math.abs(weight || 1) : Math.abs(weight || 1);

    // Handle weight change for a criteria-criteria pair
    const handleWeightChange = (key, newWeight) => {
        setWeights(prevWeights => ({
            ...prevWeights,
            [key]: adjustWeight(newWeight, inverted[key])
        }));
    };

    // Handle weight inversion for a criteria-criteria pair
    // If inverted, the weight (X) is stored as negative, but displayed as 1/X
    const handleInvertWeight = (baseId, comparedId) => {
        const key = `${baseId}-${comparedId}`;
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

    // Parse and prepare the data for submission
    const prepareDataForSubmission = () => Object.entries(weights).map(([key, importanceScore]) => {
        const [baseCriterionId, comparedCriterionId] = key.split('-');
        const comment = comments[key] || '';
        return {
            projectId: parseInt(projectId, 10),
            decisionMakerId: parseInt(decisionMakerId, 10),
            baseCriterionId: parseInt(baseCriterionId, 10),
            comparedCriterionId: parseInt(comparedCriterionId, 10),
            importanceScore,
            comments: comment
        };
    });

    // Submit the criteria weights to the backend
    const handleSubmitWeights = async () => {
        const data = prepareDataForSubmission();
        if (data.length) {
            try {
                await submitCriteriaWeights(data, projectId, decisionMakerId);
                alert('Criteria comparisons submitted successfully');
            } catch (error) {
                alert('Failed to submit comparisons: ' + error.message);
            }
        } else {
            alert('No criteria comparisons to submit');
        }
    };

    // Set initial weights when criteria are loaded/changed
    useEffect(() => {
        if (projectBaseCriteria.length > 0 && criteriaComparisons.length > 0) {
            const newWeights = {};
            const newInverted = {};
            criteriaComparisons.forEach(weight => {
                const key = `${weight.baseCriterionId}-${weight.comparedCriterionId}`;
                // Initialize weight from the fetched importanceScore or default to 0 if none
                newWeights[key] = weight.importanceScore || 0;
                newInverted[key] = weight.importanceScore < 0;
            });
            setWeights(newWeights);
            setInverted(newInverted)
        }
    }, [projectBaseCriteria, criteriaComparisons]);

    return {
        criteria: projectBaseCriteria,
        weights,
        inverted,
        handleWeightChange,
        handleInvertWeight,
        handleCommentsChanged,
        handleSubmitWeights,
        isInconsistencyDetected: (baseId, comparedId) => inconsistencies.some(inconsistency => inconsistency.baseCriterionId === baseId && inconsistency.comparedCriterionId === comparedId)
    };
};

export default useCriteriaWeightingLogic;
