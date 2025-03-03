// src/components/common/Table/ExpandedItem.jsx
import React from 'react';

const ExpandedItem = ({ 
  label, 
  value, 
  className = '',
  style = {}
}) => {
  return (
    <div className={`expanded-item ${className}`} style={style}>
      <p className="expanded-label">{label}</p>
      <p className="expanded-value">{value || '-'}</p>
    </div>
  );
};

export default ExpandedItem;