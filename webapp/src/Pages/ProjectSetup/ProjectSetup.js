import React, {useEffect, useState} from "react";
import "./ProjectSetup.css";

function ProjectSetup() { // TODO: Move criteria list to be passed in for the project
    const [criteriaList, setCriteriaList] = useState([]);

    // A list of all the criteria that is to be selected for the project, initialized with empty values
    const [selections, setSelections] = useState([]);

    // A list of booleans that tracks which criteria (explanations) is currently being edited, initialized with all false values
    const [isEditing, setIsEditing] = useState(Array(criteriaList.length).fill(false));

    // A list of explanations that is currently being edited (temporary storage), initialized with the default explanations
    const [editExplanations, setEditExplanations] = useState(criteriaList.map(c => c.explanation));

    /**
     * Handles editing the explanation for a specific criteria (facilitates the switch to editing mode)
     * @param index The index of the criteria to edit
     */
    const handleEditCriteriaExplanation = (index) => {
        // Set the editing state for the specific criteria to true
        const editingState = [...isEditing];
        editingState[index] = true;
        setIsEditing(editingState);

        // Copy the current explanation to the editing array
        const newEditExplanations = [...editExplanations];
        newEditExplanations[index] = selections[index].explanation || '';
        setEditExplanations(newEditExplanations);
    };

    /**
     * Handles the change of the explanation for a specific criteria (the action of typing in the input field)
     * @param index The index of the criteria to edit
     * @param event The event object - the input field value
     */
    const handleExplanationChange = (index, event) => {
        // Update the explanation in the editing array as the user types
        const newEditExplanations = [...editExplanations];
        newEditExplanations[index] = event.target.value;
        setEditExplanations(newEditExplanations);
    };

    /**
     * Handles saving the explanation for a specific criteria (stores explanation and facilitates the switch to non-editing mode)
     * @param index The index of the criteria to edit
     */
    const handleSaveExplanation = (index) => {
        // Save the edited explanation back to the selections array
        const newSelections = [...selections];
        newSelections[index].explanation = editExplanations[index];
        setSelections(newSelections);

        // Exit editing mode for this criteria
        const editingState = [...isEditing];
        editingState[index] = false;
        setIsEditing(editingState);
    };

    /**
     * Handles the change of the selected criteria for the project in the dropdown
     * @param index The index of the criteria to select
     * @param event The event object - the selected criteria
     */
    const handleCriteriaChange = (index, event) => {
        const selectedCriteriaName = event.target.value;
        const criteria = criteriaList.find(c => c.name === selectedCriteriaName);

        const newSelections = selections.map((selection, i) => {
            if (i === index) {
                return criteria ? { ...criteria, selected: true } : { id: null, name: '', explanation: '', selected: false };
            }
            return selection;
        });

        setSelections(newSelections);
    };

    /**
     * Handles adding a new criteria to the project (initializes a new selection with default or empty values)
     */
    const handleAddCriteria = () => {
        // Add a new selection with default or empty values
        setSelections(selections => [...selections, { id: null, name: '', explanation: '', selected: false }]);
    };

    /**
     * Handles removing/un-assigning a criteria from the selection/project
     * @param index The index of the criteria to remove
     */
    const handleRemoveCriteria = (index) => {
        const newSelections = selections.filter((_, i) => i !== index);
        setSelections(newSelections);
    };

    /**
     * Checks if a specific criteria is already selected for the project
     * @param optionName The name of the criteria to check
     * @returns {boolean} True if the criteria is already selected, false otherwise
     */
    const isOptionDisabled = (optionName) => {
        return selections.some(selection => selection.name === optionName);
    };

    /**
     * Fetches the criteria list from the API
     * @param isMounted A ref to track the mounted status of the component
     * @param url The URL to fetch the data from
     * @param setData The state setter function to update the criteria list
     * @returns {Promise<void>} A promise that resolves when the data is fetched
     */
    const fetchData = async (isMounted, url, setData) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const jsonData = await response.json();

            if (isMounted.current) { // Using ref to check if component is still mounted
                setData(jsonData);
                console.log('Data fetched:', jsonData);
            }
        } catch (error) {
            if (isMounted.current) { // Only log errors if the component is still mounted
                console.error('Error fetching data:', error);
            }
        }
    };

    useEffect(() => {
        // Use a ref to track the mounted status of the component
        const isMounted = { current: true };

        fetchData(isMounted, 'http://localhost:8080/api/criteria', setCriteriaList)
            .then(r => console.log('Data fetched:', r));

        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted.current = false;
        };
    }, []); // Empty dependency array means this effect runs once on mount

    /**
     * Handles submitting the criteria selection to the API
     * @returns {Promise<void>} A promise that resolves when the submission is complete
     */
    const handleSubmit = async () => {
        const url = 'http://127.0.0.1:8080/criteria';
        const data = {
            // Structure the payload as needed by your API
            // For example, if your API expects an array of criteria:
            criteria: selections.filter(selection => selection.selected).map(({id, name, explanation}) => ({
                id,
                name,
                explanation
            })),
        };

        try {
            const response = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Submission successful', result);
            // Handle success response, possibly resetting state or redirecting the user
        } catch (error) {
            console.error('Error submitting the form:', error);
            // Handle error response
        }
    };

    return (
        <div className="criteria-page">
            <h1>Project name - Selection Criteria definition</h1>
            <div className="criteria-container">
                <div className="criteria-selection">
                    {selections.map((selection, index) => (
                        <div className="criteria-group" key={index}>
                            <label>Selection Criteria {index + 1}</label>
                            <div>
                                <select
                                    value={selection.name || ''}
                                    onChange={(e) => handleCriteriaChange(index, e)}
                                >
                                    <option value="">Select a criteria</option>
                                    {criteriaList.map((criteria) => (
                                        <option
                                            key={criteria.id}
                                            value={criteria.name}
                                            disabled={isOptionDisabled(criteria.name)}
                                        >
                                            {criteria.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => handleRemoveCriteria(index)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button className="add-button" onClick={handleAddCriteria}>
                        Add
                    </button>
                </div>
                <div className="criteria-explanations">
                    {selections.map((selection, index) => (
                        <div className="explanation-group" key={index}>
                            {isEditing[index] ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editExplanations[index]}
                                        onChange={(event) => handleExplanationChange(index, event)}
                                    />
                                    <button onClick={() => handleSaveExplanation(index)}>
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <span>{selection.explanation}</span>
                                    <button onClick={() => handleEditCriteriaExplanation(index)}>
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleSubmit}>Submit Criteria</button>
        </div>
    );

}

export default ProjectSetup;
