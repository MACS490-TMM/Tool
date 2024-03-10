import {useEffect, useState} from "react";

function useFetchCriteria(fetchUrl) {
    const [criteriaList, setCriteriaList] = useState([]);

    const fetchData = async (isMounted, url, setData) => {
        try {
            const response = await fetch(url);
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
    }, []); // Empty dependency array means this effect runs once on mount

    return criteriaList;
}

export default useFetchCriteria;
