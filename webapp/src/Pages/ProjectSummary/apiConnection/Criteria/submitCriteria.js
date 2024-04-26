export async function submitCriteria(project, selections, decisionMakerId, url) {
    const filteredSelections = selections.filter(selection => selection.selected);
    const data = {
        criteria: filteredSelections.map(({ id, name, explanation }) => ({
            id,
            name,
            explanation
        })),
    };

    try {
        const response = await fetch(`${url}/${project.id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Submission successful:', result);
        return result; // Optionally return the result
    } catch (error) {
        console.error('Error submitting criteria:', error);
        throw error;
    }
}

export default submitCriteria;