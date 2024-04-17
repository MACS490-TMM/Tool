import {useEffect, useState} from "react";

function useFetchCriteria(fetchUrl) {
    const [criteriaList, setCriteriaList] = useState([]);

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
                throw new Error('Failed to fetch data');
            }

            const jsonData = await response.json();

            if (isMounted.current) { // Using ref to check if component is still mounted
                setData(jsonData);
                console.log('Data fetched:', jsonData);
            }
        } catch (error) {
            if (isMounted.current) { // Only log errors if the component is still mounted
                console.error('Error fetching data:', error);
            }
        }
    };

    useEffect(() => {
        // Use a ref to track the mounted status of the component
        const isMounted = { current: true };

        fetchData(isMounted, fetchUrl, setCriteriaList)
            .then(r => console.log('Data fetched:', r));

        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted.current = false;
        };
    }, [fetchUrl]);

    return criteriaList;
}

export default useFetchCriteria;
