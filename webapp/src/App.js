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
import CriteriaScoringInconsistencies from "./Pages/CriteriaScoring/CriteriaScoringInconsistencies/CriteriaScoringInconsistencies";
import VendorAssigning from "./Pages/VendorAssigning/VendorAssigning";
import RFPUploadPage from "./Pages/FileUploadPages/RFPUploadPage/RFPUploadPage";
import VPUploadPage from "./Pages/FileUploadPages/VPUploadPage/VPUploadPage";
import ProjectsDashboard from "./Pages/ProjectsDashboard/ProjectsDashboard";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";

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
                                <ProtectedRoute allowedRoles={['admin', 'stakeholder', 'decision-maker']}>
                                    <HomeWithRole />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={
                                <Routes>
                                    <Route path="/project/:projectId/summary" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <ProjectSummary />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/setup" element={
                                        <ProtectedRoute allowedRoles={['admin', 'stakeholder']}>
                                            <ProjectSetup />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/setup/criteriaDefinition/:projectId" element={
                                        <ProtectedRoute allowedRoles={['admin', 'stakeholder']}>
                                            <CriteriaDefinition />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/criteriaRanking" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <CriteriaScoring />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/vendorRanking" element={
                                        <ProtectedRoute allowedRoles={['admin', 'stakeholder']}>
                                            <VendorResult />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/user/:userName" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <UserPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/criteriaWeighting" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <CriteriaWeighting />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/criteriaWeightingInconsistency" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <CriteriaWeightingInconsistency />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/criteriaWeightingConflict" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <CriteriaWeightingConflicts />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/criteriaScoreConflict" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <CriteriaScoringConflicts />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/criteriaScoreInconsistency" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <CriteriaScoringInconsistencies />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/assignVendors" element={
                                        <ProtectedRoute allowedRoles={['admin', 'stakeholder']}>
                                            <VendorAssigning />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/RFPUpload" element={
                                        <ProtectedRoute allowedRoles={['admin', 'stakeholder']}>
                                            <RFPUploadPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/:projectId/vendor/:vendorId/VPUpload" element={
                                        <ProtectedRoute allowedRoles={['admin', 'stakeholder']}>
                                            <VPUploadPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/project/dashboard" element={
                                        <ProtectedRoute allowedRoles={['decision-maker', 'admin', 'stakeholder']}>
                                            <ProjectsDashboard />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
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

export default App;
