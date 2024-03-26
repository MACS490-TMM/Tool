/**
 * Submits criteria scores to the specified URL.
 * @param projectId The ID of the project to submit criteria scores for.
 * @param decisionMakerId The ID of the decision maker assigning and submitting the scores.
 * @param {Array} criteria The criteria to assign scores to.
 * @param {String} url The URL to submit the data to.
 * @returns {Promise<void>} A promise that resolves when the submission is complete.
 */
async function submitCriteriaScoring(projectId, decisionMakerId, criteria, url = 'http://127.0.0.1:8080/projects') {
    url = url + '/' + projectId + "/decisionMaker/" + decisionMakerId + "/scores";

    if (criteria.length === 0) {
        throw new Error('At least one criterion must be included before submitting.');
    }

    const data = criteria.map(({ id, score, textExtracted, comments }) => ({
        criterionId: id,
        decisionMakerId,
        score,
        textExtracted,
        comments
    }));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to submit criteria scores');
        }

        // Handle success
        console.log('Scores submitted successfully');
        // Possibly navigate to another route or display a success message
    } catch (error) {
        console.error('Error submitting criteria scores:', error);
        // Handle error, possibly by showing an error message to the user
    }
}


export default submitCriteriaScoring;
