/**
 * Submits selected criteria to the specified URL.
 * @param project
 * @param {Array} selections The selected criteria to submit.
 * @param decisionMakerId
 * @param {String} url The URL to submit the data to.
 * @returns {Promise<void>} A promise that resolves when the submission is complete.
 */
async function submitCriteria(project, selections, decisionMakerId, url = 'http://localhost:8080/projects') {
    // Filter selections to only include those that are selected
    const filteredSelections = selections.filter(selection => selection.selected);
    const data2 = [];

    const url1 = url + '/' + project.id + '/update';

    const url2 = url + '/' + project.id + '/decisionMaker/' + decisionMakerId + '/weights';

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

    filteredSelections.forEach((baseCriterion) => {
        filteredSelections.forEach((comparedCriterion) => {
            if (baseCriterion.id !== comparedCriterion.id) {  // Ensure you do not compare the same criterion to itself
                data2.push({
                    projectId: project.id,
                    decisionMakerId: decisionMakerId,
                    baseCriterionId: parseInt(baseCriterion.id, 10),
                    comparedCriterionId: parseInt(comparedCriterion.id, 10),
                    importanceScore: 0,
                    comments: "",
                    inconsistency: false,
                    conflict: false
                });
            }
        });
    });

    try {
        const response = await fetch(url1, {
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
        console.log('Submission 1 successful', result);
        // Optionally return the result or handle it as needed

    } catch (error) {
        console.error('Error submitting the form:', error);
        // Optionally re-throw the error or handle it as needed
        throw error;
    }

    try {
        const response = await fetch(url2, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Ensures cookies are sent with the request
            body: JSON.stringify(data2),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Submission 2 successful', result);
        // Optionally return the result or handle it as needed

    } catch (error) {
        console.error('Error submitting the form:', error);
        // Optionally re-throw the error or handle it as needed
        throw error;
    }
}


export default submitCriteria;
