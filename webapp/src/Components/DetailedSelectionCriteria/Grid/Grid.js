import React from "react";
import "./Grid.css";
import Card from "../Card/Card";

function Grid({ data }) {
    return (
        <div className="grid__outer-container">
            <div className="grid">
                {data.map((item, index) => (
                    <Card key={index} SC={item.name} vendorData={item} />
                ))}
            </div>
        </div>
    );
}

export default Grid;