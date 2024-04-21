const submitCriteriaWeights = async (criteriaData, projectId, decisionMakerId, url = 'http://localhost:8080/projects/') => {
    url = url + `${projectId}/decisionMaker/${decisionMakerId}/weights`;

    if (criteriaData.length === 0) {
        throw new Error('At least one criterion must be included before submitting.');
    }

    try {
        // Call the API to submit the comparisons
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(criteriaData),
        });

        console.log(JSON.stringify(criteriaData));

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Submission successful', result);

        return result;
    } catch (error) {
        throw new Error('Failed to submit comparisons: ' + error.message);
    }
}

export default submitCriteriaWeights;