import React from 'react';
import './LineChartCustom.css';
import {LineChart, Line, CartesianGrid, XAxis, Tooltip, Legend, YAxis, ResponsiveContainer, Label} from 'recharts';

function LineChartCustom({data}) {

    return (
        <div className={"outerContainer"}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{ stroke: 'gray', strokeWidth: 1 }} />
                    <Legend />
                    <Line type="bump" dataKey="Vendor_1" strokeWidth={2} stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="bump" dataKey="Vendor_2" strokeWidth={2} stroke="#82ca9d" activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LineChartCustom;