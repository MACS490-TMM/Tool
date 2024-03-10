import React from "react";
import "./CriteriaDropdown.css";
import Select from "react-select";
import "./CriteriaDropdown.css";

function CriteriaDropdown({ index, criteriaList, selection, handleCriteriaChange, isOptionDisabled }) {
    const options = criteriaList.map(criteria => ({
        value: criteria.name,
        label: criteria.name,
        isDisabled: isOptionDisabled(criteria.name),
    }));

    const selectedOption = options.find(option => option.value === selection.name);

    const handleChange = selectedOption => {
        handleCriteriaChange(index, { target: { value: selectedOption.value } });
    };

    return (
        <div className="criteria-group">
            <label className={"criteria-label"}>Selection Criteria {index + 1}</label>
            <div className={"criteria-dropdown"}>
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={options}
                />
            </div>
        </div>
    );
}

export default CriteriaDropdown;
