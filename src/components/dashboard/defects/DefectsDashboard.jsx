import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  PieChart, 
  BarChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar
} from 'recharts'; 
import TableRow from '../../common/Table/TableRow';
import '../DashboardStyles.css';
import '../../common/Table/tableStyles.css';
import { DEFECT_FIELDS, mapApiToDbFields } from './DefectFieldMappings';
import Table from '../../common/Table/Table';

const API_BASE_URL = 'https://msnvxmo3ezbbkd2pbmlsojhf440fxmpf.lambda-url.ap-south-1.on.aws'; // Replace with your API URL


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS = {
  'OPEN': '#FF8042',
  'IN PROGRESS': '#FFBB28',
  'CLOSED': '#00C49F'
};
const CRITICALITY_COLORS = {
  'High': '#FF0000',
  'Medium': '#FFBB28',
  'Low': '#00C49F'
};

const DefectsDashboard = () => {
  const [defects, setDefects] = useState([]);
  const [filteredDefects, setFilteredDefects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define columns based on field mappings
  const columns = useMemo(() => {
    return Object.values(DEFECT_FIELDS.TABLE)
      .filter(field => !field.isAction) // Filter out action columns
      .map(field => ({
        id: field.id,
        label: field.label,
        dbField: field.dbField,
        width: field.width
      }));
  }, []);

  useEffect(() => {
    fetchDefects();
  }, []);

  const fetchDefects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/defects`);
      console.log('Raw API Response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from API');
      }

      // Log the first item to inspect its structure
      if (response.data.length > 0) {
        console.log('First item in response:', response.data[0]);
      }

      // Map API fields to DB fields
      const mappedDefects = response.data.map(defect => {
        // Create a new object with mapped fields
        const mappedDefect = {};
        
        // Map each field from the API response to the corresponding DB field
        Object.entries(DEFECT_FIELDS.TABLE).forEach(([key, fieldConfig]) => {
          if (fieldConfig.dbField && defect[fieldConfig.dbField] !== undefined) {
            mappedDefect[fieldConfig.dbField] = defect[fieldConfig.dbField];
          }
        });
        
        return mappedDefect;
      });
      
      console.log('Mapped Defects:', mappedDefects);
      
      setDefects(mappedDefects);
      setFilteredDefects(mappedDefects);
    } catch (error) {
      console.error('Error fetching defects:', error);
      setError('Failed to fetch data. Please check the API connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredDefects(defects);
      return;
    }
    
    const filtered = defects.filter(defect => 
      Object.entries(defect).some(([key, value]) => 
        value && String(value).toLowerCase().includes(query)
      )
    );
    
    setFilteredDefects(filtered);
  };

  // Process data for Status Distribution chart
  const getStatusDistribution = useMemo(() => {
    if (!defects.length) return [];
    
    const statusField = DEFECT_FIELDS.TABLE.status.dbField;
    console.log('Status field:', statusField);
    
    // Count occurrences of each status
    const statusCounts = defects.reduce((acc, defect) => {
      const status = defect[statusField] || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Status counts:', statusCounts);
    
    // Convert to array format for chart
    return Object.entries(statusCounts).map(([name, value]) => ({ 
      name, 
      value 
    }));
  }, [defects]);

  // Process data for Criticality Distribution chart
  const getCriticalityDistribution = useMemo(() => {
    if (!defects.length) return [];
    
    const criticalityField = DEFECT_FIELDS.TABLE.criticality.dbField;
    console.log('Criticality field:', criticalityField);
    
    // Count occurrences of each criticality level
    const criticalityCounts = defects.reduce((acc, defect) => {
      const criticality = defect[criticalityField] || 'Unknown';
      acc[criticality] = (acc[criticality] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Criticality counts:', criticalityCounts);
    
    // Convert to array format for chart
    return Object.entries(criticalityCounts).map(([name, value]) => ({ 
      name, 
      value 
    }));
  }, [defects]);

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container error">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchDefects}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>FleetWatch Dashboard</h1>
        </div>
        <div className="dashboard-controls">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search defects..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button className="control-btn export-btn">Export</button>
        </div>
      </header>

      <div className="dashboard-charts">
        {/* Status Distribution Chart */}
        <div className="dashboard-card">
          <div className="dashboard-card-body">
            <h3>Status Distribution</h3>
            {getStatusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getStatusDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} defects`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>

        {/* Criticality Distribution Chart */}
        <div className="dashboard-card">
          <div className="dashboard-card-body">
            <h3>Criticality Distribution</h3>
            {getCriticalityDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getCriticalityDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} defects`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" name="Count">
                    {getCriticalityDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CRITICALITY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Defects Table */}
      <div className="vessel-table-wrapper">
        <Table
          data={filteredDefects}
          columns={columns.map(column => ({
            field: column.dbField,
            label: column.label,
            width: column.width || '150px',
            minWidth: column.minWidth || '80px',
            maxWidth: column.maxWidth || column.width || '150px',
            sortable: true
          }))}
          expandedContent={(defect) => (
            <div className="expanded-grid">
              {/* Your expanded content */}
            </div>
          )}
          uniqueIdField="id" // Make sure this matches the actual unique ID field in your defect data
          defaultSortKey={columns[0]?.dbField}
          emptyMessage="No defects found"
          className="vessel-table-container"
        />
      </div>
    </div>
  );
};

export default DefectsDashboard;