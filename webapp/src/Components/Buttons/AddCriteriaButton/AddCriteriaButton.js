import React from "react";
import "./AddCriteriaButton.css";
import AddIcon from "../../../SVGs/add_plus_nocircle.svg";

function AddCriteriaButton({ onAdd }) {
    return (
        <button className={"button-add"} onClick={onAdd}>
            Add Criteria <img src={AddIcon} alt="Delete"/>
        </button>
    );
}

export default AddCriteriaButton;