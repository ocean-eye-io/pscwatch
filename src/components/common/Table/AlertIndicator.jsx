import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const AlertIndicator = ({ 
  redCount = 0,
  yellowCount = 0,
  onClick,
  className = '',
  style = {}
}) => {
  const totalAlerts = redCount + yellowCount;
  
  if (totalAlerts === 0) {
    return <span className="no-alerts">-</span>;
  }
  
  return (
    <div 
      className={`advanced-alert-indicator ${className}`}
      style={style}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${totalAlerts} alerts: ${redCount} critical, ${yellowCount} warnings`}
    >
      <div className="alert-indicator-content">
        <div className="alert-counter-pill">
          <span className="alert-counter-number">{totalAlerts}</span>
        </div>
        
        <div className="alert-type-icons">
          {redCount > 0 && (
            <div className="alert-icon-container critical-alert">
              <AlertCircle size={16} />
              <span className="alert-count-bubble">{redCount}</span>
            </div>
          )}
          
          {yellowCount > 0 && (
            <div className="alert-icon-container warning-alert">
              <AlertTriangle size={16} />
              <span className="alert-count-bubble">{yellowCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertIndicator;