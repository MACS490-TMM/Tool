import React, {useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";
import "./AdminHome.css";

function AdminHome() {
    const navigate = useNavigate();
    // Define state to store API response
    const [data, setData] = useState(null);

    const handleWeightingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaWeighting`);
    };

    const handleRankingButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaRanking`);
    }

    const handleVendorButtonClick = (projectId) => {
        navigate(`/project/${projectId}/vendorRanking`);
    }

    const handleWeightsInconsistencyButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaWeightingInconsistency`);
    }

    const handleWeightsConflictsButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaWeightingConflict`);
    }

    const handleScoringInconsistencyButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaScoreInconsistency`);
    }

    const handleScoringConflictsButtonClick = (projectId) => {
        navigate(`/project/${projectId}/criteriaScoreConflict`);
    }

    const handleCriteriaDefinitionButtonClick = (projectId) => {
        navigate(`/project/setup/criteriaDefinition/${projectId}`);
    }

    // Function to fetch data from API
    const fetchData = async (isMounted, url) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Ensures cookies are sent with the request
            });
            if (!response.ok) {
                new Error('Failed to fetch data');
            }
            const jsonData = await response.json();

            if (isMounted) { // Only update the state if the component is still mounted
                setData(jsonData);
                console.log('Data fetched:', jsonData);
            }
        } catch (error) {
            if (isMounted) { // Only log errors if the component is still mounted
                console.error('Error fetching data:', error);
            }
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        let url = 'http://localhost:8080/projects';
        let isMounted = true;
        fetchData(isMounted, url).then(r => console.log('Data fetched:', r));
        return () => {
            isMounted = false; // Set isMounted to false when component unmounts
        };
    }, []);

    return (
        <div className={"admin-home-container"}>
            <h1>Admin Home</h1>
            <p>Criteria Definition</p>
            {data && data.map((project) => (
                <div>
                    <button onClick={() => handleCriteriaDefinitionButtonClick(project.id)}>
                        {`Go to Criteria Definition for Project ${project.id}`}
                    </button>
                </div>
            ))}
            <p>Criteria Weighting</p>
            {data && data.map((project) => (
                <div>
                    <button onClick={() => handleWeightingButtonClick(project.id)}>
                        {`Go to Criteria Weighting for Project ${project.id}`}
                    </button>
                    <button onClick={() => handleWeightsInconsistencyButtonClick(project.id)}>
                        {`Go to Criteria Weight Inconsistency for Project ${project.id}`}
                    </button>
                    <button onClick={() => handleWeightsConflictsButtonClick(project.id)}>
                        {`Go to Criteria Weight Conflict for Project ${project.id}`}
                    </button>
                </div>
            ))}
            <p>Criteria Ranking</p>
            {data && data.map((project) => (
                <div>
                    <button onClick={() => handleRankingButtonClick(project.id)}>
                        {`Go to Criteria Ranking for Project ${project.id}`}
                    </button>
                    <button onClick={() => handleScoringInconsistencyButtonClick(project.id)}>
                        {`Go to Criteria Score Inconsistency for Project ${project.id}`}
                    </button>
                    <button onClick={() => handleScoringConflictsButtonClick(project.id)}>
                        {`Go to Criteria Score Conflict for Project ${project.id}`}
                    </button>
                </div>
            ))}
            <p>Vendor Ranking</p>
            {data && data.map((project) => (
                <div>
                    <button onClick={() => handleVendorButtonClick(project.id)}>
                        {`Go to Criteria Vendor for Project ${project.id}`}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default AdminHome;