import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CommitteeDashboard from './components/CommitteeDashboard';
import './App.css';
import PetitionDashboard from './components/PetitionDashboard';

const App = () => {
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);

    const isAuthenticated = !!token; // Determina si el usuario está autenticado

    return (
        <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/dashboard" /> : <Login setToken={setToken} setUser={setUser} />
                    }
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
                />

                {/* Rutas privadas */}
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <>
                                {user?.role === 'admin' && <CommitteeDashboard token={token} />}
                                {user?.role === 'user' && <PetitionDashboard token={token} />}
                            </>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
