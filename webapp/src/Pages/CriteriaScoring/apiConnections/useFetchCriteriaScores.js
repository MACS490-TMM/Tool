import { useState, useEffect } from 'react';

// Fetch criteria weights for every criteria-criteria pair
const useFetchCriteriaScores = (projectId, decisionMakerId) => {
    const [criteriaComparisons, setCriteriaComparisons] = useState([]);
    const url = `http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/criteria/getAllScores`;
    useEffect(() => {
        const fetchCriteriaScores = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch criteria scores');
                }

                const data = await response.json();

                setCriteriaComparisons(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error('Error fetching criteria scores:', error);
                setCriteriaComparisons([]);
            }
        };

        if (projectId && decisionMakerId) {
            fetchCriteriaScores().then(r => console.log('Criteria scores fetched:', r));
        }
    }, [projectId, decisionMakerId, url]);

    return criteriaComparisons;
};

export default useFetchCriteriaScores;
