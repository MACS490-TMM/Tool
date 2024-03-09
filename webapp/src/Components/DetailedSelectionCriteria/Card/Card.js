import React from "react";
import "./Card.css";

function Card({ SC, vendorData }) {

    // Extract vendor scores while omitting the 'name' property
    const vendors = Object.entries(vendorData).filter(([key, _]) => key !== 'name');

    return (
        <div className="card">
            <div className="container">
                <p>
                    <b>{SC}</b>
                </p>
                {vendors.map(([vendorName, score], index) => (
                    <div key={index}>
                        <div className={"vendor-score"}>
                            <p>{vendorName}</p> <b>{score}</b>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Card;