import React, {Suspense, useEffect, useState} from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import {AuthProvider, useAuth} from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Home from "./Pages/Home/Home";
import ProjectSummary from "./Pages/ProjectSummary/ProjectSummary";
import NavBar from "./Components/NavBar/NavBar";
import CriteriaDefinition from "./Pages/ProjectSetup/CriteriaDefinition/CriteriaDefinition";
import ProjectSetup from "./Pages/ProjectSetup/ProjectSetup";
import CriteriaScoring from "./Pages/CriteriaScoring/CriteriaScoring";
import VendorResult from "./Pages/VendorResult/VendorResult";
import Login from "./Pages/Login/Login";
import AdminHome from "./Pages/Home/AdminHome/AdminHome";
import UserPage from "./Pages/UserPage/UserPage";
import CriteriaWeighting from "./Pages/CriteriaWeighting/CriteriaWeighting";
import CriteriaWeightingInconsistency from "./Pages/CriteriaWeighting/CriteriaWeightingInconsistency/CriteriaWeightingInconsistency";
import CriteriaWeightingConflicts from "./Pages/CriteriaWeighting/CriteriaWeightingConflicts/CriteriaWeightingConflicts";
import CriteriaScoringConflicts from "./Pages/CriteriaScoring/CriteriaScoringConflicts/CriteriaScoringConflicts";
import CriteriaScoringInconsistencies
    from "./Pages/CriteriaScoring/CriteriaScoringInconsistencies/CriteriaScoringInconsistencies";
import VendorAssigning from "./Pages/VendorAssigning/VendorAssigning";
import RFPUploadPage from "./Pages/FileUploadPages/RFPUploadPage/RFPUploadPage";
import VPUploadPage from "./Pages/FileUploadPages/VPUploadPage/VPUploadPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app-container">
                    <header className="header">
                        <NavBar/>
                    </header>
                </div>
                <main className="content">
                    <Suspense fallback={<p>Loading...</p>}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <HomeWithRole />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={
                                <ProtectedRoute>
                                    <Routes>
                                        <Route path="/project/summary" element={<ProjectSummary />} />
                                        <Route path="/project/setup" element={<ProjectSetup />} />
                                        <Route path="/project/setup/criteriaDefinition/:projectId" element={<CriteriaDefinition />} />
                                        <Route path="/project/decision making" element={<div>Decision Making</div>} />
                                        <Route path="/project/:projectId/criteriaRanking" element={<CriteriaScoring />} />
                                        <Route path="/project/:projectId/vendorRanking" element={<VendorResult />} />
                                        <Route path="/user/:userName" element={<UserPage />} />
                                        <Route path={"/project/:projectId/criteriaWeighting"} element={<CriteriaWeighting />} />
                                        <Route path={"/project/:projectId/criteriaWeightingInconsistency"} element={<CriteriaWeightingInconsistency />} />
                                        <Route path={"/project/:projectId/criteriaWeightingConflict"} element={<CriteriaWeightingConflicts />} />
                                        <Route path="/project/:projectId/criteriaScoreConflict" element={<CriteriaScoringConflicts />} />
                                        <Route path="/project/:projectId/criteriaScoreInconsistency" element={<CriteriaScoringInconsistencies />} />
                                        <Route path={"/project/:projectId/assignVendors"} element={<VendorAssigning />} />

                                        <Route path={"/project/:projectId/RFPUpload"} element={<RFPUploadPage />} />
                                        <Route path={"/project/:projectId/vendor/:vendorId/VPUpload"} element={<VPUploadPage />} />
                                        <Route path="*" element={<NotFoundPage />} />
                                    </Routes>
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Suspense>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
}

// Custom hook to get the user's role
export function useRole() {
    const { getUserRole } = useAuth();
    const [role, setRole] = useState(null);

    useEffect(() => {
        setRole(getUserRole());
    }, [getUserRole]);

    return role;
}

// Component to determine which home page to render
function HomeWithRole() {
    const role = useRole();

    if (role === null) {
        return <div>Loading...</div>;
    }

    return role === 'admin' ? <AdminHome /> : <Home />;
}

function NotFoundPage() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
}

export default App;
