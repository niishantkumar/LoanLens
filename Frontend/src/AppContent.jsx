import React from 'react'
import { Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext'; // Combined imports
import ProtectedRoute from './components/ProtectedRoute';
import "./main.css"

import LandingPage from './Pages/LandingPage/LandingPage';
import LoginPage from './Pages/LoginSignupPage/LoginPage';
import SignupPage from './Pages/LoginSignupPage/SignupPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import LoanDetails from './Pages/Dashboard/LoanDetails/LoanDetailsPage';
import NotFound from './Pages/NotFound';

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-5 pt-5'>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                <Route path="/loan/:id" element={<ProtectedRoute><LoanDetails /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default AppContent;