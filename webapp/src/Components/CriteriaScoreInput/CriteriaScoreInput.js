import React from "react";
import "./CriteriaScoreInput.css";

function CriteriaScoreInput({ criterionId, currentScore, onScoreChange, onInvertScore, isInverted }) {
    return (
        <div className={"criteria-score__input__container"}>
            {Array.from({ length: 9 }, (_, index) => {
                const score = index + 1;
                const effectiveScore = isInverted ? -score : score;
                return (
                    <label className={"radio-button__container"} key={score}>
                        <input
                            type="radio"
                            name={`score-${criterionId}`}
                            value={effectiveScore}
                            checked={currentScore === effectiveScore}
                            onChange={(e) => onScoreChange(effectiveScore, parseInt(e.target.value, 10))}
                        />
                        <span className="checkmark"></span>
                        {isInverted ? `1/${score}` : score}
                    </label>
                );
            })}
            <button className="invert-button" onClick={onInvertScore}>
                Invert
            </button>
        </div>
    );
}

export default CriteriaScoreInput;