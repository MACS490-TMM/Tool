import React from "react";
import "./CriteriaDropdown.css";

function CriteriaDropdown({ index, criteriaList, selection, handleCriteriaChange, handleRemoveCriteria, isOptionDisabled }) {
    return (
        <div className="criteria-group">
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
                <button onClick={() => handleRemoveCriteria(index)}>Remove</button>
            </div>
        </div>
    );
}

export default CriteriaDropdown;
