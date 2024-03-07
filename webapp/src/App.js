import './App.css';
import React, { Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home/Home";

function App() {
    return (
        <Router>
            <div className="app-container">
                <header className="header">
                    Navbar
                </header>
            </div>
            <main className="content">
                <Suspense fallback={<p>Loading... </p>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Suspense>
            </main>
        </Router>
    );
}

export default App;
