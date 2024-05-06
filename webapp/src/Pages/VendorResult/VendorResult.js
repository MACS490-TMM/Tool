import React, { useEffect, useState } from "react";
import "./VendorResult.css";
import { useParams } from "react-router-dom";
import fetchData from "./apiConnections";
import useFetchProject from "../ProjectSummary/apiConnection/Project/useFetchProject";

function VendorResult() {
    let { projectId } = useParams();

    const project = useFetchProject(projectId);

    const [data, setData] = useState(null);
    const [selectedVendorId, setSelectedVendorId] = useState(null);

    // Fetch data when component mounts
    useEffect(() => {
        let url = `http://localhost:8080/projects/${projectId}/vendorRanking`;
        let isMounted = true;

        fetchData(isMounted, url)
            .then(r => {
                console.log("Response: ", r);
                return r; // Return the response to pass it down the promise chain
            })
            .then(data => {
                setData(data);
            })
            .catch(error => { console.log("Error here: " + error) });


        return () => {
            isMounted = false; // Set isMounted to false when component unmounts
        };
    }, [projectId]);

    const handleRadioChange = (vendorId) => {
        setSelectedVendorId(vendorId);
    };

    const handleContactVendor = () => {
        if (selectedVendorId) {
            // TODO: Implement contact vendor logic
            console.log(`Contact vendor with ID: ${selectedVendorId}`);
        } else {
            console.log('No vendor selected.');
        }
    };

    const handleVendorDetails = (vendorId) => {
        // TODO: Implement logic to show vendor details
        console.log(`Show details for vendor with ID: ${vendorId}`);
    }

    return (
        <div className="vendor-result">
            <div className={"vendor-result-header"}>
                <h1 className={"header"}>{project.name}</h1>
                <h2 className={"sub-header"}>Vendor Ranking</h2>
            </div>
            <div className="vendor-list">
                <div className="vendor-list-header">
                    <div className="vendor-name-header">Vendor</div>
                    <div className="vendor-points-header">Points</div>
                </div>
                {data && data.map((vendor) => (
                    <div key={vendor.vendorId} className="vendor-item">
                        <div className="rank">{vendor.ranking}.</div>
                        <div className="details">
                            <div className="vendor-name">Vendor {vendor.vendorId}</div>
                            <div className="vendor-points">{vendor.score}p</div>
                        </div>
                        <div className="actions">
                            <input
                                className={"vendor-radio"}
                                type="radio"
                                name="vendorSelection"
                                id={`select-${vendor.vendorId}`}
                                onChange={() => handleRadioChange(vendor.vendorId)}
                                checked={selectedVendorId === vendor.vendorId}
                            />
                            <button
                                className="details-button"
                                onClick={() => {
                                    handleVendorDetails(vendor.vendorId)
                                }}>
                                Vendor details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="contact-button" disabled={selectedVendorId == null} onClick={handleContactVendor}>
                Contact selected alternative
            </button>
        </div>
    );
}

export default VendorResult;
