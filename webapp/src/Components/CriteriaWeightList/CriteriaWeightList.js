import CriteriaScoreInput from "../CriteriaScoreInput/CriteriaScoreInput";
import React from "react";

function CriteriaWeightList(criteria, handleWeightChange, handleInvertWeight, handleCommentsChanged, isInconsistencyDetected) {
    const { weights, inverted } = criteria;

    return (
        <div>
            {criteria.map((baseCriterion) => (
                <div key={baseCriterion.id}>
                    <h2>{baseCriterion.name}</h2>
                    {criteria.filter(c => c.id !== baseCriterion.id).map(comparedCriterion => (
                        <div key={comparedCriterion.id}>
                            <div>
                                How much more important is {baseCriterion.name} in relation
                                to {comparedCriterion.name}
                            </div>
                            <CriteriaScoreInput
                                criterionId={`${baseCriterion.id}-${comparedCriterion.id}`}
                                currentScore={weights[`${baseCriterion.id}-${comparedCriterion.id}`] || 0}
                                onScoreChange={handleWeightChange}
                                onInvertScore={() => handleInvertWeight(baseCriterion.id, comparedCriterion.id)}
                                isInverted={!!inverted[`${baseCriterion.id}-${comparedCriterion.id}`]}
                            />
                            <div className={"criteria-comments__container"}>
                                <textarea
                                    onChange={(e) => handleCommentsChanged(`${baseCriterion.id}-${comparedCriterion.id}`, e.target.value)}
                                    placeholder={"Enter comments here"}/>
                            </div>
                            {isInconsistencyDetected(baseCriterion.id, comparedCriterion.id) && (
                                <div className="inconsistency-indicator">
                                    Inconsistency detected.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default CriteriaWeightList;