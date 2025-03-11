// src/App.jsx
import React, { useState } from 'react';
import NavigationHeader from './components/layout/NavigationHeader';
import FleetDashboard from './components/dashboard/fleet/FleetDashboard';
import DefectsDashboard from './components/dashboard/defects/DefectsDashboard';
import VesselReportingPage from './components/dashboard/reporting/VesselReportingPage';
import { fleetFieldMappings } from './components/dashboard/fleet/FleetFieldMappings';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('fleet');
  
  const handleOpenInstructions = (vessel) => {
    console.log('Opening instructions for vessel:', vessel);
    // Your implementation here
  };
  
  const handleNavigation = (page) => {
    setActivePage(page);
  };

  return (
    <div className="app">
      <NavigationHeader 
        activePage={activePage}
        onNavigate={handleNavigation}
      />
      
      <main className="app-content">
        {activePage === 'fleet' ? (
          <FleetDashboard
            onOpenInstructions={handleOpenInstructions}
            fieldMappings={fleetFieldMappings}
          />
        ) : activePage === 'defects' ? (
          <DefectsDashboard />
        ) : activePage === 'reporting' ? (
          <VesselReportingPage />
        ) : null}
      </main>
    </div>
  );
}

export default App;