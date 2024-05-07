import React, { useState } from 'react';
import {useParams} from "react-router-dom";
import handleSubmitRFP from "./handleSubmitRFP";
import './RFPUploadPage.css';
import useFetchProject from "../../ProjectSummary/apiConnection/Project/useFetchProject";

function RFPUploadPage() {
    let { projectId } = useParams();

    const [file, setFile] = useState(null);
    const project = useFetchProject(projectId);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Set the file to the one selected
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await handleSubmitRFP(projectId, file);
            alert('Successfully submitted RFP, ' + response.status);
        } catch (error) {
            alert('Error uploading file: ' + error.message);
        }
    };

    return (
        <div className="upload-container">
            <div className={"upload-inner-container"}>
                <h1>Request for Proposal Upload</h1>
                <p>Upload RFP for project <b className={"bold"}>{project.name}</b></p>
            </div>
            <form onSubmit={handleSubmit} className="form-upload">
                <label htmlFor="file-upload" className="input-file">
                    Choose file to upload
                </label>
                <input className={"input"} id="file-upload" type="file" onChange={handleFileChange}/>
                <button type="submit" className="submit-button">Upload File</button>
            </form>
        </div>
    );
}

export default RFPUploadPage;