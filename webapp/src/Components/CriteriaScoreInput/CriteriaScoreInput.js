import React from "react";

function CriteriaScoreInput({ criterionId, currentScore, onScoreChange }) {
    return (
        <div>
            {Array.from({ length: 9 }, (_, index) => index + 1).map(score => (
                <label key={score}>
                    <input
                        type="radio"
                        name={`score-${criterionId}`}
                        value={score}
                        checked={currentScore === score}
                        onChange={(e) => onScoreChange(criterionId, parseInt(e.target.value, 10))}
                    />
                    {score}
                </label>
            ))}
        </div>
    );
}

export default CriteriaScoreInput;