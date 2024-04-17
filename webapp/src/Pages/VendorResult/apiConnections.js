// Function to fetch data from API
const fetchData = async (isMounted, url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Ensures cookies are sent with the request
        });
        console.log("Response new: " + response)
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json().then(data => data.sort((a, b) => a.ranking - b.ranking));

        if (isMounted) { // Only update the state if the component is still mounted
            console.log('Data fetched and sorted:', jsonData);
            return jsonData;
        }

    } catch (error) {
        if (isMounted) { // Only log errors if the component is still mounted
            console.error('Error fetching data:', error);
            return null;
        }
    }
};

export default fetchData;