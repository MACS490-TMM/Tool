export async function updateWeights(project, selections, url) {
    const filteredSelections = selections.filter(selection => selection.selected);

    try {
        const weights = [];
        project.decisionMakers.forEach((decisionMaker) => {
            filteredSelections.forEach((baseCriterion) => {
                filteredSelections.forEach((comparedCriterion) => {
                    if (baseCriterion.id !== comparedCriterion.id) {
                        weights.push({
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
            })
        });

        const response = await fetch(`${url}/${project.id}/criteria/addInitialWeights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(weights),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Weights update successful:', result);
        return result; // Optionally return the result
    } catch (error) {
        console.error('Error updating weights:', error);
        throw error;
    }
}