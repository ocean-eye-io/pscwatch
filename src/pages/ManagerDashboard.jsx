// src/pages/ManagerDashboard.jsx
import React, { useState } from 'react';
import ArrivalsByPortChart from '../components/manager/Charts/ArrivalsByPortChart';
import ArrivalTimelineChart from '../components/manager/Charts/ArrivalTimelineChart';
import VesselTable from '../components/manager/VesselTable/VesselTable';
import VesselFilters from '../components/manager/Filters/VesselFilters';
import InstructionsPanel from '../components/manager/QuickActions/InstructionsPanel';

// Sample data - combine both screenshot data and MVP requirements
const vesselData = [
  {
    id: 1,
    name: 'SDTR ERICA',
    vesselType: 'Bulk Carrier',
    doc: 'SMBL',
    arrivingPort: 'GLADSTONE',
    eta: '19-Feb-25 02:00:00',
    etb: '',
    etd: '',
    lastAMSA: '13-Jan-24',
    lastPSC: '06-Oct-23',
    daysToGo: 0.1,
    arrivalCountry: 'AUSTRALIA',
    fromPort: 'GOVE',
    departureCountry: 'AU',
    lastReportDate: '17-Feb-25 03:57:36',
    eventType: 'At Sea',
    departureDate: '12-Feb-25 04:02:18',
    owner: 'SDTR MARINE PTE LTD',
    imoNo: '9877872',
    // MVP specific fields
    checklistStatus: 'complete',
    notificationStatus: 'sent',
    riskScore: 75,
    openDefects: 3,
    instructions: '',
  },
  // Add more sample data...
];

// Chart data calculations
const arrivalsByPort = [
  { port: 'GLADSTONE', vessels: 3 },
  { port: 'NEWCASTLE', vessels: 2 },
  { port: 'MELBOURNE', vessels: 2 },
  { port: 'DAMPIER', vessels: 1 },
];

const arrivalTimeline = [
  { range: '<3 Days', vessels: 6, color: '#E74C3C' },
  { range: '<10 Days', vessels: 3, color: '#F1C40F' },
];

const ManagerDashboard = () => {
  const [vessels, setVessels] = useState(vesselData);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [filters, setFilters] = useState({
    port: '',
    status: '',
    vesselType: '',
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
  };

  const handleOpenInstructions = (vessel) => {
    setSelectedVessel(vessel);
    setShowInstructions(true);
  };

  const handleSaveInstructions = (vesselId, instructions) => {
    const updatedVessels = vessels.map((v) =>
      v.id === vesselId ? { ...v, instructions } : v
    );
    setVessels(updatedVessels);
    setShowInstructions(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#f4f4f4',
          }}
        >
          Fleet Overview
        </h1>

        <VesselFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <ArrivalsByPortChart data={arrivalsByPort} />
        <ArrivalTimelineChart data={arrivalTimeline} />
      </div>

      {/* Vessels Table */}
      <VesselTable
        vessels={vessels}
        onOpenInstructions={handleOpenInstructions}
        columns={[
          { key: 'name', label: 'Vessel' },
          { key: 'vesselType', label: 'Vessel Type' },
          { key: 'doc', label: 'DOC' },
          { key: 'arrivingPort', label: 'Arriving Port' },
          { key: 'eta', label: 'ETA' },
          { key: 'etb', label: 'ETB' },
          { key: 'etd', label: 'ETD' },
          { key: 'lastAMSA', label: 'Last AMSA' },
          { key: 'lastPSC', label: 'Last PSC' },
          { key: 'daysToGo', label: 'Days to Go' },
          { key: 'checklistStatus', label: 'Checklist Status' },
          { key: 'notificationStatus', label: 'Notice Status' },
          { key: 'riskScore', label: 'Risk Score' },
          { key: 'openDefects', label: 'Open Defects' },
        ]}
        expandedColumns={[
          { key: 'arrivalCountry', label: 'Arrival Country' },
          { key: 'fromPort', label: 'From Port' },
          { key: 'departureCountry', label: 'Departure Country' },
          { key: 'lastReportDate', label: 'Last Report Date' },
          { key: 'eventType', label: 'Event Type' },
          { key: 'departureDate', label: 'Departure Date' },
          { key: 'owner', label: 'Owner' },
          { key: 'imoNo', label: 'IMO NO' },
        ]}
      />

      {/* Instructions Panel */}
      {showInstructions && selectedVessel && (
        <InstructionsPanel
          vessel={selectedVessel}
          onClose={() => setShowInstructions(false)}
          onSave={handleSaveInstructions}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
