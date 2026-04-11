import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';

import "./main.css"

import Navbar from './Pages/Navbar';
import AppContent from './AppContent';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppContent />
      </AuthProvider>
    </BrowserRouter >
  </StrictMode >,
)