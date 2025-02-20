// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import ManagerDashboard from './pages/ManagerDashboard';
import VesselInterface from './pages/VesselInterface';

const Navigation = () => (
  <nav
    style={{
      background: '#132337',
      padding: '1rem',
      borderBottom: '1px solid rgba(244, 244, 244, 0.1)',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
      }}
    >
      <div
        style={{
          color: '#f4f4f4',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          fontFamily: 'Nunito',
        }}
      >
        Maritime Operations
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link
          to="/manager"
          style={{
            color: '#f4f4f4',
            textDecoration: 'none',
            fontFamily: 'Nunito',
            fontSize: '0.875rem',
          }}
        >
          Manager Dashboard
        </Link>
        <Link
          to="/vessel"
          style={{
            color: '#f4f4f4',
            textDecoration: 'none',
            fontFamily: 'Nunito',
            fontSize: '0.875rem',
          }}
        >
          Vessel Interface
        </Link>
      </div>
    </div>
  </nav>
);

// Simple landing page component
const LandingPage = () => (
  <div
    style={{
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#f4f4f4',
      fontFamily: 'Nunito',
      gap: '2rem',
    }}
  >
    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
      Maritime Operations Platform
    </h1>
    <div
      style={{
        display: 'flex',
        gap: '1rem',
      }}
    >
      <Link
        to="/manager"
        style={{
          padding: '0.75rem 1.5rem',
          background: '#3BADE5',
          color: '#f4f4f4',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          fontWeight: '600',
        }}
      >
        Manager Dashboard
      </Link>
      <Link
        to="/vessel"
        style={{
          padding: '0.75rem 1.5rem',
          background: '#132337',
          color: '#f4f4f4',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          fontWeight: '600',
          border: '1px solid rgba(244, 244, 244, 0.1)',
        }}
      >
        Vessel Interface
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          background: '#0B1623',
          margin: 0,
          fontFamily: 'Nunito, sans-serif',
        }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/vessel" element={<VesselInterface />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
