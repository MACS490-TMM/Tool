import React, {useState} from "react";
import {useParams} from "react-router-dom";
import handleSubmitVP from "./handleSubmitVP";

function VPUploadPage() {
    let { projectId, vendorId } = useParams();

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Set the file to the one selected
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await handleSubmitVP(projectId, vendorId, file);
            alert('Successfully submitted vendor proposal, ' + response.status);

        } catch (error) {
            alert('Error uploading file: ' + error.message);
        }
    };

    return (
        <div>
            <h1>File Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload File</button>
            </form>
        </div>
    );
}

export default VPUploadPage;