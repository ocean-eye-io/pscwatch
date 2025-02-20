// src/components/manager/Filters/VesselFilters.jsx
import React from 'react';

const VesselFilters = ({ onFilterChange }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '12px',
      marginBottom: '24px'
    }}>
      <select 
        onChange={(e) => onFilterChange('port', e.target.value)}
        style={{
          background: '#132337',
          border: '1px solid rgba(244, 244, 244, 0.1)',
          borderRadius: '4px',
          padding: '8px 12px',
          color: '#f4f4f4',
          fontFamily: 'Nunito'
        }}
      >
        <option value="">All Ports</option>
        <option value="SYDNEY">Sydney</option>
        <option value="MELBOURNE">Melbourne</option>
        <option value="BRISBANE">Brisbane</option>
      </select>

      <select 
        onChange={(e) => onFilterChange('status', e.target.value)}
        style={{
          background: '#132337',
          border: '1px solid rgba(244, 244, 244, 0.1)',
          borderRadius: '4px',
          padding: '8px 12px',
          color: '#f4f4f4',
          fontFamily: 'Nunito'
        }}
      >
        <option value="">All Status</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
};

export default VesselFilters;

