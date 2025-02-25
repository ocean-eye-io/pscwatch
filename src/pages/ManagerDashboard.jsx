// src/pages/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import ArrivalsByPortChart from '../components/manager/Charts/ArrivalsByPortChart';
import ArrivalTimelineChart from '../components/manager/Charts/ArrivalTimelineChart';
import VesselTable from '../components/manager/VesselTable/VesselTable';
import VesselFilters from '../components/manager/Filters/VesselFilters';
import InstructionsPanel from '../components/manager/QuickActions/InstructionsPanel';
import { VESSEL_FIELDS, FILTER_FIELDS } from '../config/fieldMappings';
import { transformVesselData, calculateChartData, getUniqueFieldValues } from '../utils/vesselDataTransformer';

// Use environment variable for API URL
const API_URL = 'https://nxjfpzxlkrn6peljc572eo5sxm0pggon.lambda-url.us-east-1.on.aws';

const ManagerDashboard = () => {
  const [vessels, setVessels] = useState([]);
  const [filteredVessels, setFilteredVessels] = useState([]);
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
    country: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    ports: [],
    statuses: [],
    countries: []
  });

  useEffect(() => {
    fetchVesselData();
  }, []);

  useEffect(() => {
    // Apply filters whenever vessels or filters change
    applyFilters();
  }, [vessels, filters]);

  const fetchVesselData = async () => {
    try {
      setLoading(true);
      
      // Fetch vessel data
      const response = await fetch(`${API_URL}/api/vessels`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Find the latest data date
      const latestDate = data.reduce((latest, vessel) => {
        const vesselDate = new Date(vessel.dwh_load_date);
        return !latest || vesselDate > latest ? vesselDate : latest;
      }, null);

      // Filter for only latest data
      const latestData = data.filter(vessel => 
        new Date(vessel.dwh_load_date).getTime() === latestDate.getTime()
      );
      
      // Transform the data for UI
      const transformedData = transformVesselData(latestData);
      
      // Update state
      setVessels(transformedData);
      
      // Build filter options
      setFilterOptions({
        ports: getUniqueFieldValues(transformedData, 'arrival_port'),
        statuses: getUniqueFieldValues(transformedData, 'event_type'),
        countries: getUniqueFieldValues(transformedData, 'arrival_country')
      });
      
      // Calculate chart data
      setChartData(calculateChartData(transformedData));
      
    } catch (err) {
      console.error('Error fetching vessel data:', err);
      setError('Failed to load vessel data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...vessels];
    
    // Apply port filter
    if (filters.port) {
      result = result.filter(vessel => vessel.arrival_port === filters.port);
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(vessel => vessel.event_type === filters.status);
    }
    
    // Apply country filter
    if (filters.country) {
      result = result.filter(vessel => vessel.arrival_country === filters.country);
    }
    
    // Update filtered vessels and chart data
    setFilteredVessels(result);
    setChartData(calculateChartData(result));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleOpenInstructions = (vessel) => {
    setSelectedVessel(vessel);
    setShowInstructions(true);
  };

  const handleSaveInstructions = (vesselId, instructions) => {
    // Update instructions for this vessel
    setVessels(prev =>
      prev.map(v => v.imo_no === vesselId ? { ...v, instructions } : v)
    );
    setShowInstructions(false);
    
    // Here you would also make an API call to save the instructions
    // saveVesselInstructions(vesselId, instructions);
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

  const displayVessels = filteredVessels.length > 0 ? filteredVessels : vessels;

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
          Fleet Overview ({displayVessels.length} Vessels)
        </h1>
        <VesselFilters 
          onFilterChange={handleFilterChange}
          options={filterOptions}
          filters={filters}
        />
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
        vessels={displayVessels}
        onOpenInstructions={handleOpenInstructions}
        fieldMappings={VESSEL_FIELDS}
      />

      {showInstructions && selectedVessel && (
        <InstructionsPanel
          vessel={selectedVessel}
          onClose={() => setShowInstructions(false)}
          onSave={handleSaveInstructions}
          fieldMappings={INSTRUCTIONS_FIELDS}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;