import React from 'react';
import LineChartCustom from "../../Components/LineChartCustom/LineChartCustom";
import "./ProjectSummary.css";

function ProjectSummary() {
    const data = [
        {
            name: 'SC 1',
            Vendor_1: 4,
            Vendor_2: 5,
            Vendor_3: 6,
            Vendor_4: 7,
            Vendor_5: 5,
        },
        {
            name: 'SC 2',
            Vendor_1: 7,
            Vendor_2: 6,
            Vendor_3: 5,
            Vendor_4: 7,
            Vendor_5: 7
        },
        {
            name: 'SC 3',
            Vendor_1: 2,
            Vendor_2: 3,
            Vendor_3: 4,
            Vendor_4: 3,
            Vendor_5: 4
        },
        {
            name: 'SC 4',
            Vendor_1: 7,
            Vendor_2: 9,
            Vendor_3: 7,
            Vendor_4: 8,
            Vendor_5: 9
        },
        {
            name: 'SC 5',
            Vendor_1: 7,
            Vendor_2: 7,
            Vendor_3: 8,
            Vendor_4: 9,
            Vendor_5: 8
        },
        {
            name: 'SC 6',
            Vendor_1: 4,
            Vendor_2: 5,
            Vendor_3: 6,
            Vendor_4: 5,
            Vendor_5: 6
        },
        {
            name: 'SC 7',
            Vendor_1: 9,
            Vendor_2: 7,
            Vendor_3: 8,
            Vendor_4: 7,
            Vendor_5: 8
        },
        {
            name: 'SC 8',
            Vendor_1: 8,
            Vendor_2: 3,
            Vendor_3: 4,
            Vendor_4: 5,
            Vendor_5: 6
        },
        {
            name: 'SC 9',
            Vendor_1: 7,
            Vendor_2: 8,
            Vendor_3: 9,
            Vendor_4: 8,
            Vendor_5: 7
        },
        {
            name: 'SC 10',
            Vendor_1: 6,
            Vendor_2: 7,
            Vendor_3: 6,
            Vendor_4: 5,
            Vendor_5: 5
        }
    ];

    return (
        <div>
            <h1>Project Summary</h1>
            <LineChartCustom data={data}/>
        </div>
    );
}

export default ProjectSummary;