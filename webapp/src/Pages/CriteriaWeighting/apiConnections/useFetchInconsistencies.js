import { useState, useEffect } from 'react';

// Fetch inconsistencies for every criteria-criteria pair
const useFetchInconsistencies = (projectId, decisionMakerId) => {
    const [inconsistencies, setInconsistencies] = useState([]);
    const url = `http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/inconsistencies`;

    useEffect(() => {
        const fetchInconsistencies = async () => {
            try {
                const response = await fetch(url, {
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

                setInconsistencies(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error('Error fetching inconsistencies:', error);
                setInconsistencies([]);
            }
        };

        if (projectId && decisionMakerId) {
            fetchInconsistencies().then(r => console.log('Inconsistencies fetched:', r));
        }
    }, [projectId, decisionMakerId, url]);

    return inconsistencies;
};

export default useFetchInconsistencies;
