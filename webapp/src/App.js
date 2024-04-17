// src/App.js
import React, { Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Home from "./Pages/Home/Home";
import ProjectSummary from "./Pages/ProjectSummary/ProjectSummary";
import NavBar from "./Components/NavBar/NavBar";
import CriteriaDefinition from "./Pages/ProjectSetup/CriteriaDefinition/CriteriaDefinition";
import ProjectSetup from "./Pages/ProjectSetup/ProjectSetup";
import CriteriaScoring from "./Pages/CriteriaScoring/CriteriaScoring";
import VendorResult from "./Pages/VendorResult/VendorResult";
import Login from "./Pages/Login/Login";

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
                            <Route path="*" element={
                                <ProtectedRoute>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/project/summary" element={<ProjectSummary />} />
                                        <Route path="/project/setup" element={<ProjectSetup />} />
                                        <Route path="/project/setup/criteriaDefinition/:projectId" element={<CriteriaDefinition />} />
                                        <Route path="/project/decision making" element={<div>Decision Making</div>} />
                                        <Route path="/project/:projectId/criteriaRanking" element={<CriteriaScoring />} />
                                        <Route path="/project/:projectId/vendorRanking" element={<VendorResult />} />
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

export default App;
