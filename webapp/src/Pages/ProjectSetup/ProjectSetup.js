import React, {useState} from "react";
import "./ProjectSetup.css";
import CriteriaDropdown from "../ProjectSummary/CriteriaDropdown/CriteriaDropdown";
import ExplanationEditor from "../ProjectSummary/ExplanationEditor/ExplanationEditor";
import useFetchCriteria from "../ProjectSummary/apiConnection/useFetchCriteria";
import submitCriteria from "../ProjectSummary/apiConnection/submitCriteria";
import AddCriteriaButton from "../../Components/Buttons/AddCriteriaButton/AddCriteriaButton";

function ProjectSetup() {
    // Fetch the list of criteria from the API
    const criteriaList = useFetchCriteria('http://localhost:8080/api/criteria');

    // A list of all the criteria that is to be selected for the project, initialized with empty values
    const [selections, setSelections] = useState([]);

    // A list of explanations that is currently being edited (temporary storage), initialized with the default explanations
    const [editExplanations, setEditExplanations] = useState(criteriaList.map(c => c.explanation));

    /**
     * Handles the saving of the explanation for a specific criteria
     * @param index The index of the criteria to save the explanation for
     * @param newExplanation The new explanation to save
     */
    const handleSaveExplanation = (index, newExplanation) => {
        const updatedSelections = selections.map((selection, i) => {
            if (i === index) {
                return { ...selection, explanation: newExplanation };
            }
            return selection;
        });
        setSelections(updatedSelections);
    };

    /**
     * Handles the change of the selected criteria for the project in the dropdown
     * @param index The index of the criteria to select
     * @param event The event object - the selected criteria
     */
    const handleCriteriaChange = (index, event) => {
        const selectedCriteriaName = event.target.value;
        const criteria = criteriaList.find(c => c.name === selectedCriteriaName);

        if (criteria) {
            const newSelections = [...selections];
            newSelections[index] = { ...criteria, selected: true }; // Ensure the explanation is included
            setSelections(newSelections);

            // Update editExplanations to reflect the new or existing explanation
            const newEditExplanations = [...editExplanations];
            newEditExplanations[index] = criteria.explanation;
            setEditExplanations(newEditExplanations);
        }
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
     * Handles the submission of the selected criteria to the API
     * @returns {Promise<void>} A promise that resolves when the submission is complete
     */
    const handleSubmit = async () => {
        try {
            await submitCriteria(selections)
                .then(() => {
                alert('Criteria submitted successfully');
            });
        } catch (error) {
            // Error handling if submitCriteria throws an error
            alert('Failed to submit criteria \n' + error.message);
        }
    };

    return (
        <div className="criteria-page">
            <h1>Project name - Selection Criteria definition</h1>
            <div className="criteria-selection">
                {selections.map((selection, index) => (
                    <div key={index}>
                        <CriteriaDropdown
                            index={index}
                            criteriaList={criteriaList}
                            selection={selection}
                            handleCriteriaChange={handleCriteriaChange}
                            handleRemoveCriteria={() => handleRemoveCriteria(index)}
                            isOptionDisabled={isOptionDisabled}
                        />
                        <ExplanationEditor
                            key={index}
                            index={index}
                            initialExplanation={selection.explanation || criteriaList.find(c => c.name === selection.name)?.explanation || ''}
                            onSave={handleSaveExplanation}
                        />
                    </div>
                ))}
                <AddCriteriaButton onAdd={handleAddCriteria} />
            </div>
            <button onClick={handleSubmit}>Submit Criteria</button>
        </div>
    );
}

export default ProjectSetup;
