// src/components/dashboard/FleetDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Calendar, Filter, Download, 
  RefreshCw, Map, Ship, AlertTriangle
} from 'lucide-react';
import VesselTable from '../manager/VesselTable/VesselTable';
import ArrivalsByPortChart from '../manager/Charts/ArrivalsByPortChart';
import ArrivalTimelineChart from '../manager/Charts/ArrivalTimelineChart';
import './DashboardStyles.css';

const FleetDashboard = ({ onOpenInstructions, fieldMappings }) => {
  // State variables
  const [vessels, setVessels] = useState([]);
  const [filteredVessels, setFilteredVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [portFilter, setPortFilter] = useState('All Ports');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // API endpoint
  const API_URL = 'https://mjh5sn35lm2474f7aqhv67gkre0vmvkv.lambda-url.ap-south-1.on.aws/api/vessels';

  // Process and filter vessels data - memoized to improve performance
  const processVesselsData = useCallback((data) => {
    // Get the latest record for each IMO number based on dwh_load_date
    const latestVesselData = {};
    
    data.forEach(vessel => {
      const imoNo = vessel.imo_no;
      const loadDate = vessel.dwh_load_date ? new Date(vessel.dwh_load_date) : null;
      
      // Skip records with missing IMO or load date
      if (!imoNo || !loadDate) return;
      
      // If we haven't seen this IMO yet, or this record is newer
      if (!latestVesselData[imoNo] || 
          loadDate > new Date(latestVesselData[imoNo].dwh_load_date)) {
          latestVesselData[imoNo] = vessel;
      }
    });
    
    // Convert back to array
    const uniqueVessels = Object.values(latestVesselData);
    console.log('Filtered to latest records by IMO:', uniqueVessels.length);
    
    // Filter vessels to only include those in port or arriving today or in the future
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to beginning of today
    
    // Process and filter data
    return uniqueVessels
      .map(vessel => {
        // Parse eta as Date object if it's a string
        let etaDate = null;
        if (vessel.eta) {
          try {
            etaDate = new Date(vessel.eta);
          } catch (e) {
            console.warn('Invalid eta date format:', vessel.eta);
          }
        }
        
        // Calculate days to go based on current date and ETA
        let days_to_go = 0;
        if (etaDate) {
          const timeDiff = etaDate.getTime() - currentDate.getTime();
          days_to_go = Math.max(0, Math.round(timeDiff / (1000 * 3600 * 24) * 10) / 10);
        } else if (vessel.DISTANCE_TO_GO) {
          // Fallback: calculate from distance if ETA isn't available
          days_to_go = parseFloat((vessel.DISTANCE_TO_GO / 350).toFixed(1));
        }
        
        return {
          ...vessel,
          etaDate,
          days_to_go,
          riskScore: Math.floor(Math.random() * 100)
        };
      })
      .filter(vessel => {
        // Keep if vessel is in port (event_type contains "port" or "Port")
        const isInPort = vessel.event_type && 
                        (vessel.event_type.toLowerCase().includes('port') || 
                        vessel.event_type.toLowerCase().includes('berth'));
        
        // Keep if vessel has a future arrival date (today or later)
        const hasFutureArrival = vessel.etaDate && vessel.etaDate >= currentDate;
        
        // Return true if either condition is met
        return isInPort || hasFutureArrival;
      });
  }, []);

  // Sort vessels data - memoized to improve performance
  const sortVesselsData = useCallback((processedData) => {
    return [...processedData].sort((a, b) => {
      // In-port vessels should be at the top
      const aInPort = a.event_type && (a.event_type.toLowerCase().includes('port') || a.event_type.toLowerCase().includes('berth'));
      const bInPort = b.event_type && (b.event_type.toLowerCase().includes('port') || b.event_type.toLowerCase().includes('berth'));
      
      if (aInPort && !bInPort) return -1;
      if (!aInPort && bInPort) return 1;
      
      // Then sort by ETA (earliest first for vessels not in port)
      if (!aInPort && !bInPort) {
        if (!a.etaDate && !b.etaDate) return 0;
        if (!a.etaDate) return 1;
        if (!b.etaDate) return -1;
        return a.etaDate - b.etaDate;
      }
      
      return 0;
    });
  }, []);

  // Fetch vessel data from API
  const fetchVessels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      let data = await response.json();
      console.log('Raw vessel data loaded:', data.length);
      
      // Process the data
      const processedData = processVesselsData(data);
      console.log('Filtered to in-port or future vessels:', processedData.length);
      
      // Sort the data
      const sortedData = sortVesselsData(processedData);
      
      // Initialize with filtered and sorted data
      setVessels(sortedData || []);
      setFilteredVessels(sortedData || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching vessel data:', err);
      setError('Failed to load vessel data. Please try again later.');
      // Set empty arrays on error to avoid undefined errors
      setVessels([]);
      setFilteredVessels([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, processVesselsData, sortVesselsData]);

  // Load data on component mount
  useEffect(() => {
    fetchVessels();
  }, [fetchVessels]);

  // Apply filters when data or filter values change
  useEffect(() => {
    if (!vessels.length) {
      setFilteredVessels([]);
      return;
    }
    
    let results = [...vessels];
    
    // Apply port filter if not "All Ports"
    if (portFilter !== 'All Ports') {
      results = results.filter(vessel => 
        vessel.arrival_port && vessel.arrival_port.includes(portFilter)
      );
    }
    
    // Apply status filter if not "All Status"
    if (statusFilter !== 'All Status') {
      results = results.filter(vessel => 
        vessel.event_type && vessel.event_type.includes(statusFilter)
      );
    }
    
    // Apply search term if not empty
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(vessel => 
        (vessel.vessel_name && vessel.vessel_name.toLowerCase().includes(term)) ||
        (vessel.imo_no && vessel.imo_no.toString().includes(term)) ||
        (vessel.arrival_port && vessel.arrival_port.toLowerCase().includes(term))
      );
    }
    
    console.log('Filtered vessels:', results.length);
    setFilteredVessels(results);
  }, [vessels, searchTerm, portFilter, statusFilter]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setPortFilter('All Ports');
    setStatusFilter('All Status');
  }, []);

  // Get unique arrival ports for filter dropdown - memoized to improve performance
  const uniquePorts = useMemo(() => {
    if (!vessels.length) return ['All Ports'];
    
    const ports = vessels
      .map(v => v.arrival_port)
      .filter(Boolean)
      .filter((port, index, self) => self.indexOf(port) === index);
    
    return ['All Ports', ...ports];
  }, [vessels]);

  // Get unique event types for filter dropdown - memoized to improve performance
  const uniqueStatuses = useMemo(() => {
    if (!vessels.length) return ['All Status'];
    
    const statuses = vessels
      .map(v => v.event_type)
      .filter(Boolean)
      .filter((status, index, self) => self.indexOf(status) === index);
    
    return ['All Status', ...statuses];
  }, [vessels]);
    
  // Count high risk vessels - memoized to improve performance
  const highRiskCount = useMemo(() => 
    vessels.filter(v => v.riskScore > 70).length, 
    [vessels]
  );

  // Process data for Vessels by Port chart - memoized to improve performance
  const vesselsByPortData = useMemo(() => {
    if (!vessels.length) return [];
    
    const portCounts = {};
    vessels.forEach(vessel => {
      if (vessel.arrival_port) {
        portCounts[vessel.arrival_port] = (portCounts[vessel.arrival_port] || 0) + 1;
      }
    });
    
    // Convert to format expected by your ArrivalsByPortChart component
    return Object.entries(portCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([port, count]) => ({
        port,
        vessels: count
      }));
  }, [vessels]);

  // Process data for Arrival Timeline chart - memoized to improve performance
  const arrivalTimelineData = useMemo(() => {
    if (!vessels.length) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const arrivingToday = vessels.filter(v => 
      v.etaDate && v.etaDate >= today && v.etaDate < tomorrow
    ).length;
    
    const arrivingThisWeek = vessels.filter(v => 
      v.etaDate && v.etaDate >= tomorrow && v.etaDate < nextWeek
    ).length;
    
    const arrivingLater = vessels.filter(v => 
      v.etaDate && v.etaDate >= nextWeek
    ).length;
    
    const inPort = vessels.filter(v => 
      v.event_type && (
        v.event_type.toLowerCase().includes('port') || 
        v.event_type.toLowerCase().includes('berth')
      )
    ).length;
    
    return [
      { range: 'In Port', vessels: inPort, color: '#2ECC71' },
      { range: 'Today', vessels: arrivingToday, color: '#E74C3C' },
      { range: 'This Week', vessels: arrivingThisWeek, color: '#F1C40F' },
      { range: 'Later', vessels: arrivingLater, color: '#3BADE5' }
    ];
  }, [vessels]);

  // Get vessel count safely
  const vesselCount = vessels.length;
  const filteredCount = filteredVessels.length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Fleet Overview</h1>
          <div className="fleet-stats">
            <div className="fleet-count">
              <Ship size={16} />
              <span>{vesselCount} Vessels</span>
            </div>
            <div className="alert-count warning">
              <AlertTriangle size={16} />
              <span>{highRiskCount} High Risk</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-controls">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search vessels, IMO, ports..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="control-buttons">
            <button className="control-btn refresh-btn" onClick={fetchVessels} title="Refresh data">
              <RefreshCw size={16} className={loading ? "spinning" : ""} />
            </button>
            <button className="control-btn export-btn" title="Export data">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="filter-bar">
        <div className="filter-label">
          <Filter size={16} />
        </div>
        
        <div className="filter-chips">
          <div className="filter-dropdown">
            <select 
              className="filter-select"
              value={portFilter}
              onChange={(e) => setPortFilter(e.target.value)}
            >
              <option value="All Ports">All Ports</option>
              {uniquePorts.filter(p => p !== 'All Ports').map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-dropdown">
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              {uniqueStatuses.filter(s => s !== 'All Status').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          {(portFilter !== 'All Ports' || statusFilter !== 'All Status' || searchTerm) && (
            <button className="reset-button" onClick={resetFilters}>
              Reset
            </button>
          )}
          
          <div className="date-filter">
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          </div>
        </div>
        
        <button className="map-toggle">
          <Map size={16} />
          <span>Map</span>
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="dashboard-charts">
        <div className="dashboard-card">
          <div className="dashboard-card-body">
            {loading ? (
              <div className="chart-loading">
                <div className="loading-spinner"></div>
                <span>Loading chart data...</span>
              </div>
            ) : (
              <ArrivalsByPortChart data={vesselsByPortData} />
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-body">
            {loading ? (
              <div className="chart-loading">
                <div className="loading-spinner"></div>
                <span>Loading chart data...</span>
              </div>
            ) : (
              <ArrivalTimelineChart data={arrivalTimelineData} />
            )}
          </div>
        </div>
      </div>
      
      <div className="vessel-table-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading fleet data...</p>
          </div>
        ) : filteredCount === 0 ? (
          <div className="no-results">
            <p>No vessels match your current filters. Try adjusting your search or filters.</p>
            <button className="reset-filters" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <VesselTable 
            vessels={filteredVessels}
            onOpenInstructions={onOpenInstructions}
            fieldMappings={fieldMappings}
          />
        )}
      </div>
      
      <div className="dashboard-footer">
        <div className="data-source">
          Data sources: AIS, Port Authorities, Weather API
        </div>
      </div>
    </div>
  );
};

export default FleetDashboard;