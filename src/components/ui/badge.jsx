// src/components/ui/badge.jsx
import React from 'react';
import '../dashboard/DashboardStyles.css';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const variantClasses = {
    default: 'badge-default',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info'
  };

  const variantClass = variantClasses[variant] || variantClasses.default;

  return (
    <span 
      className={`badge ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };