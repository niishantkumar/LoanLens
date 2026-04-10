import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import "./main.css"

import LandingPage from './Pages/LandingPage/LandingPage';
import Navbar from './Pages/Navbar';
import LoginPage from './Pages/LoginSignupPage/LoginPage';
import SignupPage from './Pages/LoginSignupPage/SignupPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import LoanDetails from './Pages/Dashboard/LoanDetails/LoanDetailsPage';
import NotFound from './Pages/NotFound';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
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
      </AuthProvider>
    </BrowserRouter >
  </StrictMode >,
)
