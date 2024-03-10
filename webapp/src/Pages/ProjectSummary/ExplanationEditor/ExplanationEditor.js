import React, {useEffect, useState} from "react";
import "./ExplanationEditor.css";

function ExplanationEditor({ index, initialExplanation, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        setExplanation(initialExplanation);
    }, [initialExplanation]);

    const handleEdit = () => setIsEditing(true);

    const handleChange = (event) => {
        setExplanation(event.target.value);
    };

    const handleSave = () => {
        onSave(index, explanation); // Invoke the passed onSave function with the new explanation
        setIsEditing(false);
    };

    return (
        <div className="explanation-group">
            {isEditing ? (
                <div>
                    <input type="text" value={explanation} onChange={handleChange} />
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <span>{explanation}</span>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}
        </div>
    );
}

export default ExplanationEditor;
