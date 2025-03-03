// src/components/common/Table/ActionButton.jsx
import React from 'react';

const ActionButton = ({ 
  children, 
  onClick, 
  icon,
  className = '',
  style = {}
}) => {
  return (
    <button
      className={`action-button ${className}`}
      onClick={onClick}
      style={style}
    >
      {icon && React.cloneElement(icon, { size: 16 })}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;