import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import handleSubmitVP from "./handleSubmitVP";
import "./VPUploadPage.css";
import useFetchProject from "../../ProjectSummary/apiConnection/Project/useFetchProject";

function VPUploadPage() {
    let { projectId, vendorId } = useParams();
    const [file, setFile] = useState(null);
    const project = useFetchProject(projectId);

    const [vendor, setVendor] = useState( { id: null, name: 'Default Vendor' } );

    useEffect(() => {
        if (project && project.vendors) {
            const foundVendor = project.vendors.find(vendor => vendor.id === Number(vendorId));
            setVendor(foundVendor || { id: null, name: 'Default Vendor' });
        }
    }, [project, vendorId]);


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
        <div className="upload-container">
            <div className={"upload-inner-container"}>
                <h1>Vendor Proposal Upload</h1>
                <p>Upload proposal from <b className={"bold"}>{vendor.name}</b> for project <b className={"bold"}>{project.name}</b></p>
            </div>
            <form onSubmit={handleSubmit} className="form-upload">
                <label htmlFor="file-upload" className="input-file">
                    Choose file to upload
                </label>
                <input className={"input"} id="file-upload" type="file" onChange={handleFileChange} />
                <button type="submit" className="submit-button">Upload File</button>
            </form>
        </div>
    );
}

export default VPUploadPage;
