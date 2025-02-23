// src/pages/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import ArrivalsByPortChart from '../components/manager/Charts/ArrivalsByPortChart';
import ArrivalTimelineChart from '../components/manager/Charts/ArrivalTimelineChart';
import VesselTable from '../components/manager/VesselTable/VesselTable';
import VesselFilters from '../components/manager/Filters/VesselFilters';
import InstructionsPanel from '../components/manager/QuickActions/InstructionsPanel';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ManagerDashboard = () => {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [chartData, setChartData] = useState({
    arrivalsByPort: [],
    arrivalTimeline: []
  });
  const [filters, setFilters] = useState({
    port: '',
    status: '',
    vesselType: ''
  });

  useEffect(() => {
    fetchVesselData();
  }, []);

  const calculateDaysToGo = (eta) => {
    if (!eta) return null;
    const days = (new Date(eta) - new Date()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(days * 10) / 10);
  };

  const fetchVesselData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/vessels`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      const transformedData = data.map(vessel => ({
        id: vessel.imo_no,
        name: vessel.vessel_name,
        vesselType: 'Bulk Carrier',
        arrivingPort: vessel.toport,
        eta: vessel.eta ? new Date(vessel.eta).toLocaleString() : '-',
        etb: vessel.etb ? new Date(vessel.etb).toLocaleString() : '-',
        etd: vessel.etd ? new Date(vessel.etd).toLocaleString() : '-',
        daysToGo: calculateDaysToGo(vessel.eta),
        arrivalCountry: vessel.tocountry,
        fromPort: vessel.fromport,
        departureCountry: vessel.fromcountry,
        lastReportDate: new Date(vessel.report_date).toLocaleString(),
        eventType: vessel.event_type,
        departureDate: vessel.atd ? new Date(vessel.atd).toLocaleString() : '-',
        owner: vessel.owner,
        imoNo: vessel.imo_no,
        riskScore: Math.floor(Math.random() * 100) // Example risk score
      }));

      setVessels(transformedData);
      updateChartData(transformedData);
    } catch (err) {
      console.error('Error fetching vessel data:', err);
      setError('Failed to load vessel data');
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = (vesselData) => {
    // Calculate port statistics
    const portCounts = vesselData.reduce((acc, vessel) => {
      if (vessel.arrivingPort) {
        acc[vessel.arrivingPort] = (acc[vessel.arrivingPort] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate timeline data
    const threeDaysCount = vesselData.filter(v => {
      const days = calculateDaysToGo(v.eta);
      return days !== null && days <= 3;
    }).length;

    const tenDaysCount = vesselData.filter(v => {
      const days = calculateDaysToGo(v.eta);
      return days !== null && days > 3 && days <= 10;
    }).length;

    setChartData({
      arrivalsByPort: Object.entries(portCounts).map(([port, vessels]) => ({
        port,
        vessels
      })),
      arrivalTimeline: [
        { range: '<3 Days', vessels: threeDaysCount, color: '#E74C3C' },
        { range: '<10 Days', vessels: tenDaysCount, color: '#F1C40F' }
      ]
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleOpenInstructions = (vessel) => {
    setSelectedVessel(vessel);
    setShowInstructions(true);
  };

  const handleSaveInstructions = (vesselId, instructions) => {
    setVessels(prev =>
      prev.map(v => v.id === vesselId ? { ...v, instructions } : v)
    );
    setShowInstructions(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading vessel data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#f4f4f4',
        }}>
          Fleet Overview ({vessels.length} Vessels)
        </h1>
        <VesselFilters onFilterChange={handleFilterChange} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px',
      }}>
        <ArrivalsByPortChart data={chartData.arrivalsByPort} />
        <ArrivalTimelineChart data={chartData.arrivalTimeline} />
      </div>

      <VesselTable
        vessels={vessels}
        onOpenInstructions={handleOpenInstructions}
        columns={[
          { key: 'name', label: 'Vessel' },
          { key: 'vesselType', label: 'Vessel Type' },
          { key: 'arrivingPort', label: 'Arriving Port' },
          { key: 'eta', label: 'ETA' },
          { key: 'etb', label: 'ETB' },
          { key: 'etd', label: 'ETD' },
          { key: 'daysToGo', label: 'Days to Go' },
          { key: 'eventType', label: 'Status' },
          { key: 'riskScore', label: 'Risk Score' }
        ]}
        expandedColumns={[
          { key: 'arrivalCountry', label: 'Arrival Country' },
          { key: 'fromPort', label: 'From Port' },
          { key: 'departureCountry', label: 'Departure Country' },
          { key: 'lastReportDate', label: 'Last Report Date' },
          { key: 'departureDate', label: 'Departure Date' },
          { key: 'owner', label: 'Owner' },
          { key: 'imoNo', label: 'IMO NO' }
        ]}
      />

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