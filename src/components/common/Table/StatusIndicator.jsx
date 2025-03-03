// src/components/common/Table/StatusIndicator.jsx
import React from 'react';

const StatusIndicator = ({ 
  status,
  color,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`status-indicator ${className}`}
      style={style}
    >
      <span 
        className="status-dot"
        style={{ background: color }}
      ></span>
      {status || '-'}
    </div>
  );
};

export default StatusIndicator;