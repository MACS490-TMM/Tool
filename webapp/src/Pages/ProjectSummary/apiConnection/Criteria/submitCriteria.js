/**
 * Submits selected criteria to the specified URL.
 * @param project
 * @param {Array} selections The selected criteria to submit.
 * @param {String} url The URL to submit the data to.
 * @returns {Promise<void>} A promise that resolves when the submission is complete.
 */
async function submitCriteria(project, selections, url = 'http://localhost:8080/projects/update') {
    // Filter selections to only include those that are selected
    const filteredSelections = selections.filter(selection => selection.selected);

    url = url + '/' + project.id;

    // Validate that there is at least one selected criterion
    if (filteredSelections.length === 0) {
        throw new Error('At least one criterion must be selected before submitting.');
    }

    const data = {
        criteria: filteredSelections.map(({ id, name, explanation }) => ({
            id,
            name,
            explanation
        })),
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Ensures cookies are sent with the request
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Submission successful', result);
        // Optionally return the result or handle it as needed

    } catch (error) {
        console.error('Error submitting the form:', error);
        // Optionally re-throw the error or handle it as needed
        throw error;
    }
}


export default submitCriteria;
