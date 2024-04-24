import { useState, useEffect } from 'react';

// Fetch criteria weights for every criteria-criteria pair
const useFetchCriteriaWeights = (projectId, decisionMakerId) => {
    const [criteriaComparisons, setCriteriaComparisons] = useState([]);
    const url = `http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/criteria/weights`;
    useEffect(() => {
        const fetchCriteriaWeights = async () => {
            try {
                const response = await fetch(url, {
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

                setCriteriaComparisons(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error('Error fetching criteria weights:', error);
                setCriteriaComparisons([]);
            }
        };

        if (projectId && decisionMakerId) {
            fetchCriteriaWeights().then(r => console.log('Criteria weights fetched:', r));
        }
    }, [projectId, decisionMakerId, url]);

    return criteriaComparisons;
};

export default useFetchCriteriaWeights;
