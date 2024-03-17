import { useEffect, useState } from "react";

function useFetchStakeholders(fetchUrl) {
    const [stakeholders, setStakeholders] = useState([]);
    const fetchData = async (isMounted, fetchUrl, setData) => {
        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch decision makers');
            }

            const jsonData = await response.json();

            if (isMounted.current) {  // Using ref to check if component is still mounted
                setStakeholders(jsonData);
            }
        } catch (error) {
            if (isMounted.current) { // Only log errors if the component is still mounted
                console.error('Error fetching decision makers:', error);
            }
        }
    };

    useEffect(() => {
        const isMounted = { current: true };

        fetchData(isMounted, fetchUrl, setStakeholders)
            .then(r => console.log('Data fetched:', r));

        return () => {
            isMounted.current = false;
        };
    }, [fetchUrl]);

    return stakeholders;
}

export default useFetchStakeholders;
