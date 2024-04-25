/**
 * Submits criteria scores to the specified URL.
 * @param criteriaData
 * @param projectId The ID of the project to submit criteria scores for.
 * @param decisionMakerId The ID of the decision maker assigning and submitting the scores.
 * @param {String} url The URL to submit the data to.
 * @returns {Promise<void>} A promise that resolves when the submission is complete.
 */
async function submitCriteriaScoring(criteriaData, projectId, decisionMakerId, url = 'http://localhost:8080/projects') {
    url = url + `/${projectId}/decisionMaker/${decisionMakerId}/criteria/scores`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Ensures cookies are sent with the request
            body: JSON.stringify(criteriaData),
        });

        if (!response.ok) {
            throw new Error('Failed to submit criteria scores');
        }

        // TODO: Handle success
        console.log('Scores submitted successfully');
        // Possibly navigate to another route or display a success message
    } catch (error) {
        console.error('Error submitting criteria scores:', error);
        alert('Failed to submit criteria scores, please try again.');
    }
}


export default submitCriteriaScoring;
