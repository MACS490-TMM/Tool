import './App.css';
import React, { Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home/Home";
import ProjectSummary from "./Pages/ProjectSummary/ProjectSummary";
import NavBar from "./Components/NavBar/NavBar";
import CriteriaDefinition from "./Pages/ProjectSetup/CriteriaDefinition/CriteriaDefinition";
import ProjectSetup from "./Pages/ProjectSetup/ProjectSetup";

function App() {
    return (
        <Router>
            <div className="app-container">
                <header className="header">
                    <NavBar/>
                </header>
            </div>
            <main className="content">
                <Suspense fallback={<p>Loading... </p>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path={"/project/summary"} element={<ProjectSummary />} />
                        <Route path={"/project/setup"} element={<ProjectSetup />} />
                        <Route path={"/project/setup/criteriaDefinition/:projectId"} element={<CriteriaDefinition />} />
                        <Route path={"/project/decision making"} element={<div>Decision Making</div>}/>
                    </Routes>
                </Suspense>
            </main>
        </Router>
    );
}

export default App;
