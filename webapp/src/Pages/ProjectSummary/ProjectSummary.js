import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ProjectSummary.css';
import useFetchCriteriaScores from "../CriteriaScoring/apiConnections/useFetchCriteriaScores";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useFetchProject from "./apiConnection/Project/useFetchProject";

function ProjectSummary() {
    let { projectId } = useParams();
    let { getUserID } = useAuth();
    const [transformedData, setTransformedData] = useState([]);
    const [criteriaNames, setCriteriaNames] = useState({});
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

    const fetchedProject = useFetchProject(projectId);

    useEffect(() => {
        if (fetchedProject && fetchedProject.criteria) {
            const namesMap = fetchedProject.criteria.reduce((map, criterion) => {
                map[criterion.id] = criterion.name;
                return map;
            }, {});
            setCriteriaNames(namesMap);
        }
    }, [fetchedProject]);

    const fetchedData = useFetchCriteriaScores(projectId, getUserID());

    useEffect(() => {
        if (fetchedData && Object.keys(criteriaNames).length) {
            let dataByCriteria = {};

            fetchedData.forEach(item => {
                // Use the criteria name instead of 'Criterion X'
                const criteriaName = criteriaNames[item.criterionId] || `Unknown Criterion ${item.criterionId}`;
                if (!dataByCriteria[criteriaName]) {
                    dataByCriteria[criteriaName] = [];
                }
                item.comparisons.forEach(comp => {
                    dataByCriteria[criteriaName].push({
                        name: `Vendor ${comp.baseVendorId}-${comp.comparedVendorId}`,
                        score: comp.score,
                        criterionId: item.criterionId
                    });
                });
            });

            // Convert object into array format required by Recharts
            let chartData = [];
            Object.keys(dataByCriteria).forEach(criteriaName => {
                let groupData = { criteriaKey: criteriaName };
                dataByCriteria[criteriaName].forEach(vendorComparison => {
                    groupData[vendorComparison.name] = vendorComparison.score;
                });
                chartData.push(groupData);
            });

            setTransformedData(chartData);
        }
    }, [fetchedData, criteriaNames]);

    if (!transformedData.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"project-summary__outer-container"}>
            <div className={"bar-chart"}>
                <ResponsiveContainer width="100%" height={600}>
                    <BarChart
                        data={transformedData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis dataKey="criteriaKey" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {transformedData.length > 0 && Object.keys(transformedData[0])
                            .filter(key => key !== 'criteriaKey')
                            .map((key, index) => (
                                <Bar
                                    key={`bar-${key}`}
                                    dataKey={key}
                                    fill={colors[index % colors.length]}
                                    name={key}
                                />
                            ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ProjectSummary;
