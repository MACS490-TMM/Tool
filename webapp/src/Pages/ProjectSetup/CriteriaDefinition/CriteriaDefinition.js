import React, {useEffect, useState} from "react";
import "./CriteriaDefinition.css";
import CriteriaDropdown from "../../ProjectSummary/CriteriaDropdown/CriteriaDropdown";
import ExplanationEditor from "../../ProjectSummary/ExplanationEditor/ExplanationEditor";
import useFetchCriteria from "../../ProjectSummary/apiConnection/Criteria/useFetchCriteria";
import {submitCriteria} from "../../ProjectSummary/apiConnection/Criteria/submitCriteria";
import AddCriteriaButton from "../../../Components/Buttons/AddCriteriaButton/AddCriteriaButton";
import SaveIcon from "../../../SVGs/save.svg";
import EditIcon from "../../../SVGs/edit_pen.svg";
import DeleteIcon from "../../../SVGs/delete_trashcan.svg";
import SendPlane from "../../../SVGs/send_plane.svg";
import useFetchProject from "../../ProjectSummary/apiConnection/Project/useFetchProject";
import {useParams} from "react-router-dom";
import {updateWeights} from "../../ProjectSummary/apiConnection/Criteria/submitWeights";
import {submitScores} from "../../ProjectSummary/apiConnection/Criteria/submitScores";

function CriteriaDefinition() {

    let { projectId } = useParams();
    let decisionMakerId = 1; // TODO: Get the decision maker ID from the user

    const project = useFetchProject(projectId);

    // State to track the index of the criteria being edited
    const [editingIndex, setEditingIndex] = useState(null);

    // Fetch the list of criteria from the API
    const criteriaList = useFetchCriteria('http://localhost:8080/api/criteria');

    // A list of all the criteria that is to be selected for the project, initialized with empty values
    const [selections, setSelections] = useState([]);

    // A list of explanations that is currently being edited (temporary storage), initialized with the default explanations
    const [editExplanations, setEditExplanations] = useState(criteriaList.map(c => c.explanation));

    // When project data is fetched and available, populate the selections state
    useEffect(() => {
        if (project && project.criteria) {
            const newSelections = project.criteria.map(criterion => ({
                id: criterion.id,
                name: criterion.name,
                explanation: criterion.explanation,
                selected: true,
            }));
            setSelections(newSelections);

            const newEditExplanations = project.criteria.map(criterion => criterion.explanation);
            setEditExplanations(newEditExplanations);
        }
    }, [project]);

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

        const newEditExplanations = editExplanations.filter((_, i) => i !== index);
        setEditExplanations(newEditExplanations);
    };

    /**
     * Handles the change of the explanation for a selected criteria
     * @param index The index of the criteria to change the explanation for
     * @param newText The new explanation text
     */
    const handleExplanationChange = (index, newText) => {
        const newEditExplanations = [...editExplanations];
        newEditExplanations[index] = newText;
        setEditExplanations(newEditExplanations);
    };

    /**
     * Handles the saving of the explanation for a selected criteria
     * @param index The index of the criteria to save the explanation for
     * @param newExplanation The new explanation text
     */
    const handleSaveExplanation = (index, newExplanation) => {
        const updatedSelections = selections.map((selection, i) => {
            if (i === index) {
                return { ...selection, explanation: newExplanation };
            }
            return selection;
        });
        setSelections(updatedSelections);
        setEditingIndex(null); // Exit edit mode
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
            const url = 'http://localhost:8080/projects'; // API URL
            await submitCriteria(project, selections, decisionMakerId, url)
                .then(() => {
                    updateWeights(project, selections, url);
                    submitScores(project, selections, url);
                })
                .then(() => {
                    alert('Criteria submitted successfully');
                });
        } catch (error) {
            console.error('Error:', error);
        }
        /*try {
            await submitCriteria(project, selections, decisionMakerId)
                .then(() => {
                alert('Criteria submitted successfully');
            });
        } catch (error) {
            // Error handling if submitCriteria throws an error
            alert('Failed to submit criteria \n' + error.message);
        }*/
    };

    return (
        <div className="criteria-page">
            <h1>Project name - Selection Criteria definition</h1>
            <div className="criteria-selection">
                {selections.map((selection, index) => (
                    <div className={"criteria-container"} key={index}>
                        <CriteriaDropdown
                            index={index}
                            criteriaList={criteriaList}
                            selection={selection}
                            handleCriteriaChange={handleCriteriaChange}
                            isOptionDisabled={isOptionDisabled}
                        />
                        <div className={"explanation-container"}>
                            <ExplanationEditor
                                initialExplanation={editExplanations[index] || ''}
                                isEditing={editingIndex === index}
                                onChange={(newText) => handleExplanationChange(index, newText)}
                            />
                            {editingIndex === index ? (
                                <button className={"button-save"}
                                        onClick={() => handleSaveExplanation(index, editExplanations[index])}>
                                    <img src={SaveIcon} alt="Save"/>
                                </button>
                            ) : (
                                <button className={"button-edit"} onClick={() => setEditingIndex(index)}>
                                    <img src={EditIcon} alt="Save"/>
                                </button>
                            )}
                            <button className={"button-delete"} onClick={() => handleRemoveCriteria(index)}>
                                <img src={DeleteIcon} alt="Delete"/>
                            </button>
                        </div>
                    </div>
                ))}
                <AddCriteriaButton onAdd={handleAddCriteria}/>
            </div>
            <button
                className={"button-send"}
                onClick={handleSubmit}
                disabled={selections.length === 0} // This disables the button if selections is empty
            >
                Submit <img src={SendPlane} alt="Submit"/>
            </button>
        </div>
    );
}

export default CriteriaDefinition;
