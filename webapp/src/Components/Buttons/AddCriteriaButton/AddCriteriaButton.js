import React from "react";
import "./AddCriteriaButton.css";

function AddCriteriaButton({ onAdd }) {
    return (
        <button className="add-button" onClick={onAdd}>
            Add Criteria
        </button>
    );
}

export default AddCriteriaButton;