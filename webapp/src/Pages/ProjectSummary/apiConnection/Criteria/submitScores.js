export async function submitScores(project, selections, url) {
    const filteredSelections = selections.filter(selection => selection.selected);

    try {
        const data = [];


        project.decisionMakers.forEach((decisionMaker) => {
            // Iterate through each criterion
            filteredSelections.forEach((criterion) => {
                // Ensure you do not compare the same criterion to itself
                if (criterion.id) {
                    let comparisons = [];

                    comparisons.push({
                        baseVendorId: null,
                        comparedVendorId: null,
                        score: 0,
                        textExtracted: "",
                        comments: "",
                        conflict: false,
                        inconsistency: false
                    });

                    // Add the criterion comparison object to the data to send
                    data.push({
                        projectId: project.id,
                        criterionId: criterion.id,
                        decisionMakerId: decisionMaker.id,
                        comparisons: comparisons
                    });
                }
            });
        });

        /*
        project.decisionMakers.forEach(decisionMaker => {
            filteredSelections.forEach(baseCriterion => {
                filteredSelections.forEach(comparedCriterion => {
                    if (baseCriterion.id !== comparedCriterion.id) {
                        data.push({
                            projectId: project.id,
                            decisionMakerId: decisionMaker.id,
                            baseCriterionId: baseCriterion.id,
                            comparedCriterionId: comparedCriterion.id,
                            importanceScore: 0,
                            comments: "",
                            inconsistency: false,
                            conflict: false
                        });
                    }
                });
            });
        });
        */

        const response = await fetch(`${url}/${project.id}/criteria/scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const result = await response.json();
            console.log('Scores update successful:', result);
            return result; // Optionally return the result
        }
    } catch (error) {
        console.error('Error updating scores:', error);
        throw error;
    }
}