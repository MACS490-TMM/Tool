import React, {useState} from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './ProjectSetup.css';
import submitProject from '../ProjectSummary/apiConnection/Project/submitProject';
import useFetchDecisionMakers from '../ProjectSummary/apiConnection/decisionMakers/useFetchDecisionMakers';
import useFetchStakeholders from '../ProjectSummary/apiConnection/stakeholders/useFetchStakeholders';
import SendPlane from "../../SVGs/send_plane.svg";

const animatedComponents = makeAnimated();
const ProjectSetup = () => {
    const [projectName, setProjectName] = useState('');
    const [selectedStakeholders, setSelectedStakeholders] = useState([]);
    const [selectedDecisionMakers, setSelectedDecisionMakers] = useState([]);

    const stakeholders = useFetchStakeholders('http://127.0.0.1:8080/stakeholders');
    const decisionMakers = useFetchDecisionMakers('http://127.0.0.1:8080/decisionMakers');

    const stakeholderOptions = stakeholders.map(s => ({ value: s.id, label: s.name }));
    const decisionMakerOptions = decisionMakers.map(dm => ({ value: dm.id, label: dm.name }));

    const handleProjectNameChange = (event) => {
        setProjectName(event.target.value);
    };

    const handleSubmit = async () => {
        const projectData = {
            name: projectName,
            criteria: [
                // Add criteria input or fetch it from somewhere
            ],
            stakeholders: selectedStakeholders.map(option => ({
                id: option.value,
                name: option.label,
                role: "Some Role" // Have a different method to assign roles / fetch from somewhere
            })),
            decisionMakers: selectedDecisionMakers.map(option => ({
                id: option.value,
                name: option.label,
                role: "Some Role" // Again, manage roles differently
            })),
            vendors: [
                // Similar to criteria, depending on UI for vendor input
            ]
        };

        try {
            await submitProject(projectData)
                .then(() => {
                    alert('Project submitted successfully');
                });
        } catch (error) {
            // Error handling if submitProject throws an error
            alert('Failed to submit project \n' + error.message);
        }
    };

    return (
        <div className={"project__setup-outer__container"}>
            <div className={"project__setup-inner__container"}>
                <h2>Project Setup</h2>
                <p>
                    Project Name
                </p>
                <div className={"project-name__group"}>
                    <input
                        type="text"
                        value={projectName}
                        onChange={handleProjectNameChange}
                        placeholder="Project Name"
                    />
                </div>
                <p>
                    Select Stakeholders
                </p>
                <div className={"project-stakeholder__group"}>
                    <Select
                        className={"select__stakeholders"}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={stakeholderOptions}
                        onChange={setSelectedStakeholders}
                        placeholder="Select Stakeholders"
                    />
                </div>
                <p>
                    Select Decision Makers
                </p>
                <div className={"project-decision-maker__group"}>
                    <Select
                        className={"select__decision-makers"}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={decisionMakerOptions}
                        onChange={setSelectedDecisionMakers}
                        placeholder="Select Decision Makers"
                    />
                </div>

                <button
                    className={"button-send"}
                    onClick={handleSubmit}
                    disabled={projectName === '' || selectedStakeholders.length === 0 || selectedDecisionMakers.length === 0}
                >
                    Submit <img src={SendPlane} alt="Submit"/>
                </button>
            </div>
        </div>
    );
};

export default ProjectSetup;
