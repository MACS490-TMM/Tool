/**
 * Submits selected criteria to the specified URL.
 * @param {Array} selections The selected criteria to submit.
 * @param {String} url The URL to submit the data to.
 * @returns {Promise<void>} A promise that resolves when the submission is complete.
 */
async function submitCriteria(selections, url = 'http://127.0.0.1:8080/criteria') {
    // Filter selections to only include those that are selected
    const filteredSelections = selections.filter(selection => selection.selected);

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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
