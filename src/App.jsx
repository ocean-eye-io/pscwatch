// src/App.jsx
import React, { useState } from 'react';
import NavigationHeader from './components/layout/NavigationHeader';
import FleetDashboard from './components/dashboard/FleetDashboard';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('fleet');
  
  // Define your fieldMappings structure
  const fieldMappings = {
    TABLE: {
      vessel_name: { 
        dbField: 'vessel_name', 
        label: 'Vessel', 
        priority: 1, 
        width: '180px' 
      },
      imo: { 
        dbField: 'imo_no', 
        label: 'IMO No', 
        priority: 2, 
        width: '120px' 
      },
      arriving_port: { 
        dbField: 'arrival_port', 
        label: 'Arriving Port', 
        priority: 3, 
        width: '150px' 
      },
      eta: { 
        dbField: 'eta', 
        label: 'ETA', 
        priority: 4, 
        width: '170px' 
      },
      etb: { 
        dbField: 'etb', 
        label: 'ETB', 
        priority: 5, 
        width: '150px' 
      },
      etd: { 
        dbField: 'etd', 
        label: 'ETD', 
        priority: 6, 
        width: '150px' 
      },
      event_type: { 
        dbField: 'event_type', 
        label: 'Status', 
        priority: 7, 
        width: '140px' 
      },
      riskScore: { 
        dbField: 'riskScore', 
        label: 'Risk Score', 
        priority: 8, 
        width: '120px' 
      },
      distance_to_go: { 
        dbField: 'distance_to_go', 
        label: 'Distance (nm)', 
        priority: 9, 
        width: '130px' 
      },
      days_to_go: { 
        dbField: 'days_to_go', 
        label: 'Days to Go', 
        priority: 10, 
        width: '120px' 
      }
    },
    EXPANDED: {
      captain: { 
        dbField: 'captain', 
        label: 'Captain', 
        priority: 1 
      },
      last_port: { 
        dbField: 'last_port', 
        label: 'Last Port', 
        priority: 2 
      },
      cargo_type: { 
        dbField: 'cargo_type', 
        label: 'Cargo Type', 
        priority: 3 
      },
      cargo_description: { 
        dbField: 'cargo_description', 
        label: 'Cargo Description', 
        priority: 4 
      },
      vessel_type: { 
        dbField: 'vessel_type', 
        label: 'Vessel Type', 
        priority: 5 
      },
      destination: { 
        dbField: 'destination', 
        label: 'Destination', 
        priority: 6 
      },
      draft: { 
        dbField: 'draft',
        label: 'Draft', 
        priority: 7 
      }
    }
  };
  
  const handleOpenInstructions = (vessel) => {
    console.log('Opening instructions for vessel:', vessel);
    // Your implementation here
  };

  return (
    <div className="app">
      <NavigationHeader activePage={activePage} />
      
      <main className="app-content">
        <FleetDashboard 
          onOpenInstructions={handleOpenInstructions}
          fieldMappings={fieldMappings}
        />
      </main>
    </div>
  );
}

export default App;