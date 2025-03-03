// src/components/common/Table/TableBadge.jsx
import React from 'react';

const TableBadge = ({ 
  children, 
  variant = 'info', 
  className = '',
  style = {}
}) => {
  return (
    <span 
      className={`badge badge-${variant} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

export default TableBadge;