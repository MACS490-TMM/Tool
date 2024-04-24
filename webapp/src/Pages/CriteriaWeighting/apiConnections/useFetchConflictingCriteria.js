import { useState, useEffect } from 'react';

// Fetch conflicts for every criteria-criteria pair
const useFetchConflictingCriteria = (projectId, decisionMakerId) => {
    const [conflicts, setConflicts] = useState([]);
    const url = `http://localhost:8080/projects/${projectId}/decisionMaker/${decisionMakerId}/conflicts`;

    useEffect(() => {
        const fetchConflicts = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch conflicts');
                }

                const data = await response.json();

                setConflicts(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error('Error fetching conflicts:', error);
                setConflicts([]);
            }
        };

        if (projectId && decisionMakerId) {
            fetchConflicts().then(r => console.log('Conflicts fetched:', r));
        }
    }, [projectId, decisionMakerId, url]);

    return conflicts;
}

export default useFetchConflictingCriteria;
