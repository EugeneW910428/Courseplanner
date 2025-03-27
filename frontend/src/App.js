import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Courses from './components/Courses';
import ScheduleGenerator from './components/ScheduleGenerator';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="app-container">
            <header className="app-header bg-dark text-white py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="app-title">Auto Course Planner</h1>
                    <nav>
                        <ul className="nav">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link text-white">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/courses" className="nav-link text-white">
                                    Courses
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/schedule" className="nav-link text-white">
                                    Schedule Generator
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="app-main py-4">
                <div className="container">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="text-center">
                                    <h2>Welcome to Auto Course Planner</h2>
                                    <p className="lead">
                                        Plan your courses effortlessly with our AI-powered tool.
                                    </p>
                                    <NavLink to="/schedule" className="btn btn-primary btn-lg">
                                        Get Started
                                    </NavLink>
                                </div>
                            }
                        />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/schedule" element={<ScheduleGenerator />} />
                    </Routes>
                </div>
            </main>

            <footer className="app-footer bg-dark text-white py-3">
                <div className="container text-center">
                    <p>&copy; 2024 Auto Course Planner. All rights reserved.</p>
                    <p>
                        <a href="https://yourwebsite.com" className="text-white text-decoration-none">
                            Visit our website
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;










