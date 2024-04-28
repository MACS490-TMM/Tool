import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ProjectSummary.css';
import useFetchCriteriaScores from "../CriteriaScoring/apiConnections/useFetchCriteriaScores";
import useFetchProject from "./apiConnection/Project/useFetchProject";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProjectSummary() {
    let { projectId } = useParams();
    let { getUserID } = useAuth();
    const [transformedData, setTransformedData] = useState([]);
    const [criteriaNames, setCriteriaNames] = useState({});
    const [visibleCriteria, setVisibleCriteria] = useState({});
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
    const [visibleVendors, setVisibleVendors] = useState({});


    const fetchedProject = useFetchProject(projectId);

    useEffect(() => {
        if (fetchedProject && fetchedProject.criteria) {
            const namesMap = {};
            const visibility = {};
            fetchedProject.criteria.forEach(criterion => {
                namesMap[criterion.id] = criterion.name;
                visibility[criterion.name] = true;
            });
            setCriteriaNames(namesMap);
            setVisibleCriteria(visibility);
        }
    }, [fetchedProject]);

    const fetchedData = useFetchCriteriaScores(projectId, getUserID());

    useEffect(() => {
        if (fetchedData && Object.keys(criteriaNames).length) {
            let dataByCriteria = {};

            fetchedData.forEach(item => {
                const criteriaName = criteriaNames[item.criterionId];
                if (visibleCriteria[criteriaName]) {
                    if (!dataByCriteria[criteriaName]) {
                        dataByCriteria[criteriaName] = [];
                    }
                    item.comparisons.forEach(comp => {
                        const pairName = `Vendor ${comp.baseVendorId}-${comp.comparedVendorId}`;
                        dataByCriteria[criteriaName].push({
                            name: pairName,
                            score: comp.score,
                            criterionId: item.criterionId
                        });
                    });
                }
            });

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
    }, [fetchedData, criteriaNames, visibleCriteria]);

    const toggleCriterionVisibility = (criterion) => {
        setVisibleCriteria(prev => ({
            ...prev,
            [criterion]: !prev[criterion]
        }));
    };

    const toggleVendorVisibility = (vendor) => {
        setVisibleVendors(prev => ({
            ...prev,
            [vendor]: !prev[vendor]
        }));
    }

    if (!transformedData.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="project-summary__outer-container">
            <div className="content-container">
                <div className="vendor-group-toggles">
                    {transformedData.length > 0 && Object.keys(transformedData[0])
                        .filter(key => key !== 'criteriaKey')
                        .map(vendor => (
                            <button key={vendor} onClick={() => toggleVendorVisibility(vendor)}>
                                {visibleVendors[vendor] ? `Hide ${vendor}` : `Show ${vendor}`}
                            </button>
                        ))}
                </div>
                <div className="bar-chart">
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="criteriaKey" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {transformedData.length > 0 && Object.keys(transformedData[0])
                                .filter(key => key !== 'criteriaKey')
                                .map((key, index) => visibleVendors[key] &&
                                    <Bar
                                        key={`bar-${key}`}
                                        dataKey={key}
                                        fill={colors[index % colors.length]}
                                        name={key}
                                    />
                                )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="criteria-toggles">
                {Object.keys(visibleCriteria).map(criterion => (
                    <button key={criterion} onClick={() => toggleCriterionVisibility(criterion)}>
                        {visibleCriteria[criterion] ? `Hide ${criterion}` : `Show ${criterion}`}
                    </button>
                ))}
            </div>
        </div>
    );

}

export default ProjectSummary
