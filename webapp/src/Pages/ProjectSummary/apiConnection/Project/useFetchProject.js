import {useEffect, useState} from "react";

function useFetchProject(projectId, fetchUrl = 'http://localhost:8080/projects') {
    const [project, setProject] = useState({});

    const url = fetchUrl + '/' + projectId;
    const fetchData = async (isMounted, url, setData) => {
        try {
            const response = await fetch(url, {
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

        fetchData(isMounted, url, setProject)
            .then(r => console.log('Project fetched successfully', r));

        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted.current = false;
        };
    }, [url]);

    return project;
}

export default useFetchProject;
