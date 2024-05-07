import React from "react";
import "./CriteriaScoreInput.css";


function CriteriaScoreInput({ criterionId, currentScore, onScoreChange, isInverted }) {  // Removed onInvertScore
    const fuzzyTexts = {
        1: 'Equally Important',
        3: 'Weakly Important',
        5: 'Fairly Important',
        7: 'Strongly Important',
        9: 'Absolutely Important'
    };

    const fuzzyTextsReciprocal = {
        1: 'Equally Important',
        '1/3': 'Weakly Less Important',
        '1/5': 'Fairly Less Important',
        '1/7': 'Strongly Less Important',
        '1/9': 'Absolutely Less Important'
    };

    const renderFuzzyText = (text) => {
        const words = text.split(' ');
        const boldCount = words.length > 2 ? 2 : 1; // Bold two words if more than two words, otherwise bold one
        const boldWords = words.slice(0, boldCount).join(' ');
        const restOfText = words.slice(boldCount).join(' ');
        return (
            <>
                <span className="bold-words">{boldWords}</span> {restOfText}
            </>
        );
    };

    return (
        <div className={"criteria-score__input__container"}>
            {Array.from({ length: 9 }, (_, index) => {
                const score = index + 1;
                const effectiveScore = isInverted ? -score : score;
                const displayScore = isInverted ? (score > 1 ? `1/${score}` : '1') : score;
                const fuzzyText = isInverted ? fuzzyTextsReciprocal[displayScore.toString()] : fuzzyTexts[score];

                return (
                    <label className={"radio-button__container"} key={score}>
                        <div className="score-label">
                            {displayScore}
                        </div>
                        <input
                            type="radio"
                            name={`score-${criterionId}`}
                            value={effectiveScore}
                            checked={currentScore === effectiveScore}
                            onChange={(e) => onScoreChange(effectiveScore, parseInt(e.target.value, 10))}
                        />
                        <span className="checkmark"></span>
                        {fuzzyText && renderFuzzyText(fuzzyText)}
                    </label>
                );
            })}
        </div>
    );
}

export default CriteriaScoreInput;
