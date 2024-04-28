import { useState, useEffect } from 'react';

const useVendors = (projectId) => {
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/projects/${projectId}/vendors`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }
                const data = await response.json();
                setVendors(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchVendors().then(r => console.log('Vendors fetched:', r));
        }
    }, [projectId]);

    return { vendors, isLoading, error };
};

export default useVendors;
