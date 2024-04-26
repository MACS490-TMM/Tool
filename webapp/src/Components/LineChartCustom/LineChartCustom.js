import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, Legend, YAxis, ResponsiveContainer } from 'recharts';
import './LineChartCustom.css';

function LineChartCustom({ data }) {

    /**
     * Generate an object with keys as the vendor names and values as true if the line should be visible.
     * Initialize all lines to be visible by default.
     *
     * @param data - the data to generate the visible lines from
     * @returns {{}} - the object with vendor names as keys and true as values
     */
    const generateVisibleLines = (data) => {
        const visibleLines = {};
        data.forEach(item => {
            Object.keys(item).forEach(key => {
                visibleLines[key] = true;
            });
        });
        return visibleLines;
    };

    const [visibleLines, setVisibleLines] = useState(generateVisibleLines(data));

    // Track the last toggled line and its visibility - used for controlling animation
    const [lastToggled, setLastToggled] = useState({ vendor: null, isVisible: false });

    /**
     * Toggles the visibility of a line.
     * @param vendor - the vendor name
     */
    const toggleLineVisibility = (vendor) => {
        const isVisible = !visibleLines[vendor];
        setVisibleLines(prevState => ({
            ...prevState,
            [vendor]: isVisible,
        }));
        // Track the last toggled line and its visibility
        setLastToggled({ vendor, isVisible });
    };

    // Define colors for each vendor/line
    const colors = {
        Vendor_1: '#A4D4B4',
        Vendor_2: '#463F3A',
        Vendor_3: '#F7934C',
        Vendor_4: '#CC5803',
        Vendor_5: '#1F1300',
    }

    return (
        <div className={"container-outer"}>
            <div className={"container-chart"}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip cursor={{ stroke: 'gray', strokeWidth: 1 }} />
                        <Legend />

                        {Object.keys(visibleLines).map(vendor => (
                            visibleLines[vendor] && ( // Only render the line if its visibility is true
                                <Line
                                    key={vendor}
                                    type="linear"
                                    dataKey={vendor}
                                    strokeWidth={2}
                                    stroke={colors[vendor]}
                                    activeDot={{ r: 8 }}
                                    isAnimationActive={lastToggled.vendor === vendor} // Control animation
                                />
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>

                <div className="container-chart-buttons">
                    {Object.keys(visibleLines).map(vendor => ( // Render a button for each vendor
                        <div key={vendor} className="vendor-option">
                            <button
                                className={`button ${visibleLines[vendor] ? 'button-active' : ''}`}
                                onClick={() => toggleLineVisibility(vendor)}
                            />
                            <span className="vendor-text">{vendor}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LineChartCustom;
