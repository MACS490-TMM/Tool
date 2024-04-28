import React, {useState} from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {submitVendors} from "./submitVendors";
import useFetchVendors from "./useFetchVendors";
import {useParams} from "react-router-dom";

const animatedComponents = makeAnimated();

function VendorAssigning() {
    const [selectedVendors, setSelectedVendors] = useState([]);

    let { projectId } = useParams();

    const vendors = useFetchVendors();

    const vendorOptions = vendors.map(v => ({value: v.id, label: v.name}));

    const handleVendorChange = (selectedOptions) => {
        setSelectedVendors(selectedOptions);
    }

    const handleSubmit = async () => {
        const vendorData = selectedVendors.map(vendor => ({
            id: vendor.value,
            name: vendor.label,
        }));

        try {
            // Submitting the vendors to both the file of projects and the project scoring comparison file
            const response = await submitVendors(projectId, vendorData, `http://localhost:8080/projects/${projectId}/addVendors`)
                .then(await submitVendors(projectId, {vendors: vendorData}, `http://localhost:8080/projects/${projectId}/update`));
            alert('Vendors submitted successfully, ' + response.status);
        } catch (error) {
            alert('Failed to submit vendors \n' + error.message);
        }
    }

    return ( //TODO: Add updated styling
        <div className={"project__setup-outer__container"}>
            <div className={"project__setup-inner__container"}>
                <h1>Vendor Assigning</h1>
                <div className={"project-stakeholder__group"}>
                    <Select
                        className={"select__stakeholders"}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={vendorOptions}
                        onChange={handleVendorChange}
                        placeholder="Select Vendors"
                    />
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>

        </div>
    );
}

export default VendorAssigning;