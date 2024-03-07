import React from 'react';
import LineChartCustom from "../../Components/LineChartCustom/LineChartCustom";
import "./ProjectSummary.css";

function ProjectSummary() {
    const data = [
        {
            name: 'SC 1',
            Vendor_1: 4,
            Vendor_2: 5,
        },
        {
            name: 'SC 2',
            Vendor_1: 7,
            Vendor_2: 6,
        },
        {
            name: 'SC 3',
            Vendor_1: 2,
            Vendor_2: 3,
        },
        {
            name: 'SC 4',
            Vendor_1: 7,
            Vendor_2: 9,
        },
        {
            name: 'SC 5',
            Vendor_1: 7,
            Vendor_2: 7,
        },
        {
            name: 'SC 6',
            Vendor_1: 4,
            Vendor_2: 5,
        },
        {
            name: 'SC 7',
            Vendor_1: 9,
            Vendor_2: 7,
        },
        {
            name: 'SC 8',
            Vendor_1: 8,
            Vendor_2: 3,
        },
        {
            name: 'SC 9',
            Vendor_1: 7,
            Vendor_2: 8,
        },
        {
            name: 'SC 10',
            Vendor_1: 6,
            Vendor_2: 7,
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