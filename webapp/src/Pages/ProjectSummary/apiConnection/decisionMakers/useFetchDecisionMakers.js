import { useEffect, useState } from "react";

function useFetchDecisionMakers(fetchUrl) {
    const [decisionMakers, setDecisionMakers] = useState([]);
    const fetchData = async (isMounted, fetchUrl, setData) => {
        try {
            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Ensures cookies are sent with the request
            });
            if (!response.ok) {
                throw new Error('Failed to fetch decision makers');
            }

            const jsonData = await response.json();

            if (isMounted.current) {  // Using ref to check if component is still mounted
                setData(jsonData);
            }
        } catch (error) {
            if (isMounted.current) { // Only log errors if the component is still mounted
                console.error('Error fetching decision makers:', error);
            }
        }
    };

    useEffect(() => {
        const isMounted = { current: true };

        fetchData(isMounted, fetchUrl, setDecisionMakers)
            .then(r => console.log('Data fetched:', r));

        return () => {
            isMounted.current = false;
        };
    }, [fetchUrl]);

    return decisionMakers;
}

export default useFetchDecisionMakers;
