// Function to fetch data from API
const fetchData = async (isMounted, url) => {
    try {
        const response = await fetch(url);
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
        }
    }
};

export default fetchData;