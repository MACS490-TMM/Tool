import React, { useEffect, useState } from 'react';

function Home() {
    // Define state to store API response
    const [data, setData] = useState(null);

    // Function to fetch data from API
    const fetchData = async (isMounted, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                new Error('Failed to fetch data');
            }
            const jsonData = await response.json();

            if (isMounted) { // Only update the state if the component is still mounted
                setData(jsonData);
                console.log('Data fetched:', jsonData);
            }
        } catch (error) {
            if (isMounted) { // Only log errors if the component is still mounted
                console.error('Error fetching data:', error);
            }
        }
    };

    /*
    useEffect(() => {
        fetch('http://127.0.0.1:8080/items/1')
            .then(response => response.json())
            .then(jsonData => {
                setData(jsonData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    */

    // Fetch data when component mounts
    useEffect(() => {
        let url = 'http://127.0.0.1:8080/items/1';
        let isMounted = true;
        fetchData(isMounted, url).then(r => console.log('Data fetched:', r));
        return () => {
            isMounted = false; // Set isMounted to false when component unmounts
        };
    }, []);

    return (
        <div>
            <h1>Home</h1>
            {data && (
                <div>
                    <h2>{data.name}</h2>
                </div>
            )}
        </div>
    );
}

export default Home;
