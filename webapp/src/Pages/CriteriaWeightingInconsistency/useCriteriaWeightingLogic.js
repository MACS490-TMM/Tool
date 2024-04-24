import {useEffect, useState} from 'react';
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";
import useProjectCriteria from "../ProjectSummary/apiConnection/criteriaWeighting/useProjectCriteria";
import submitCriteriaWeights from "../ProjectSummary/apiConnection/criteriaWeighting/submitCriteriaWeights";

const useCriteriaWeightingLogic = (projectId, decisionMakerId) => {
    const project = useFetchProject(projectId);
    const [projectBaseCriteria, setProjectBaseCriteria] = useState([]);
    const [criteriaComparisons, setCriteriaComparisons] = useState([]);
    const [weights, setWeights] = useState({});
    const [comments, setComments] = useState({});
    const [inverted, setInverted] = useState({});
    const [inconsistencies, setInconsistencies] = useState([]);

    useProjectCriteria(project, setProjectBaseCriteria);

    useEffect(() => {
        const fetchCriteriaWeights = async () => {
            try {
                const response = await fetch(`http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/criteria/weights`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch criteria weights');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCriteriaComparisons(data);
                } else {
                    setCriteriaComparisons([]);
                }
            } catch (error) {
                console.error('Error fetching criteria weights:', error);
                setCriteriaComparisons([]);
            }
        };

        if (projectId && decisionMakerId) {
            fetchCriteriaWeights().then(r => console.log('Criteria weights fetched:', r));
        }
    }, [projectId, decisionMakerId]);

    useEffect(() => {
        const fetchInconsistencies = async () => {
            try {
                const response = await fetch(`http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/inconsistencies`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch inconsistencies');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setInconsistencies(data);
                } else {
                    setInconsistencies([]);
                }
                return data;
            } catch (error) {
                console.error('Error fetching inconsistencies:', error);
                setInconsistencies([]);
            }
        };

        if (projectId && decisionMakerId) {
            fetchInconsistencies().then(r => console.log('Inconsistencies fetched:', r));
        }
    }, [projectId, decisionMakerId]);

    const adjustWeight = (weight, isInverted) => isInverted ? -Math.abs(weight || 1) : Math.abs(weight || 1);

    const handleWeightChange = (key, newWeight) => {
        setWeights(prevWeights => ({
            ...prevWeights,
            [key]: adjustWeight(newWeight, inverted[key])
        }));
    };

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

    useEffect(() => {
        // Set initial weights when criteria are loaded/changed
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
