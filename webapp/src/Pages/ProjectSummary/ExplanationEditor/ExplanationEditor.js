import React from "react";
import "./ExplanationEditor.css";

function ExplanationEditor({ initialExplanation, isEditing, onChange }) {
    return (
        <div className="explanation-group">
            <label className="criteria-label">Explanation</label>
            {isEditing ? (
                <input
                    type="text"
                    value={initialExplanation}
                    onChange={(event) => onChange(event.target.value)}
                />
            ) : initialExplanation && initialExplanation.trim().length > 0 ? (
                <input
                    type="text"
                    value={initialExplanation}
                    disabled={true}
                />
            ) : (
                <input
                    type="text"
                    value={"N/A"}
                    disabled={true}
                />
            )}
        </div>
    );
}

export default ExplanationEditor;
