import React from "react";
import "./CriteriaScoreInput.css";

function CriteriaScoreInput({ criterionId, currentScore, onScoreChange }) {
    return (
        <div className={"criteria-score__input__container"}>
            {Array.from({ length: 9 }, (_, index) => index + 1).map(score => (
                <label className={"radio-button__container"} key={score}>
                    <input
                        type="radio"
                        name={`score-${criterionId}`}
                        value={score}
                        checked={currentScore === score}
                        onChange={(e) => onScoreChange(criterionId, parseInt(e.target.value, 10))}
                    />
                    <span className="checkmark"></span>
                    {score}
                </label>
            ))}
        </div>
    );
}

export default CriteriaScoreInput;