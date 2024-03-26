/**
 * Submits the project data to the server
 * @param projectData The project data to submit
 * @param url The URL to submit the data to
 * @returns {Promise<any>} A promise that resolves when the submission is complete
 */
const submitProject = async (projectData, url = 'http://127.0.0.1:8080/projects') => {
    try {
        const response = await fetch(url, { // Use your actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        });

        console.log(JSON.stringify(projectData));

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Submission successful', result);
        // Handle success response, possibly navigating to a different page or showing a success message
        return result;
    } catch (error) {
        console.error('Error submitting the project:', error);
        // Handle error response, possibly showing an error message to the user
        throw error;
    }
};

export default submitProject;