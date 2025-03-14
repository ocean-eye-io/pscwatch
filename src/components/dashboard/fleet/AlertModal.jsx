import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, X, ChevronRight, Clock, Shield, ExternalLink } from 'lucide-react';

// Alert recommendation data with enhanced details
const ALERT_RECOMMENDATIONS = {
  red: [
    {
      title: "ECDIS System Malfunction",
      description: "Critical navigation system malfunction detected in ECDIS primary unit. Internal diagnostics show database corruption.",
      //timeDetected: "2 hours ago",
      recommendation: "Schedule immediate service at next port. Use backup navigation systems until resolved.",
      severity: "HIGH"
    },
    {
      title: "Hull Integrity Issue",
      description: "Sensors detected potential structural integrity anomaly in forward starboard section near frame #42.",
      //timeDetected: "4 hours ago",
      recommendation: "Immediate inspection required by qualified personnel. Reduce speed in rough seas.",
      severity: "HIGH"
    },
    {
      title: "Engine Performance Critical",
      description: "Main engine performance 28% below critical threshold. Abnormal vibration detected in cylinder #3.",
      //timeDetected: "1 day ago",
      recommendation: "Reduce operational speed by 30%. Arrange immediate maintenance at next port.",
      severity: "HIGH"
    },
    {
      title: "Weather Alert - Severe Storm",
      description: "Severe weather system detected in vessel path. Wind speeds exceeding 55 knots and wave heights of 6-8 meters forecasted.",
      //timeDetected: "5 hours ago",
      recommendation: "Consider route adjustment of minimum 120NM to the south to ensure crew and cargo safety.",
      severity: "HIGH"
    },
    {
      title: "Security Breach Detected",
      description: "Multiple unauthorized access attempts detected on vessel's communication systems from external IP addresses.",
      //timeDetected: "30 minutes ago",
      recommendation: "Security protocols should be reviewed immediately. Update firewall rules and credentials.",
      severity: "HIGH"
    },
    {
      title: "Ballast Water System Failure",
      description: "Ballast system pressure dropping in tanks 3B and 4B. Potential valve failure or leak affecting vessel stability.",
      //timeDetected: "3 hours ago",
      recommendation: "Immediate assessment of affected tanks required. Prepare contingency stability plan.",
      severity: "HIGH"
    },
    {
      title: "Fuel Quality Critical",
      description: "Fuel sample analysis shows contamination exceeding ISO 8217 limits. High catalyst fines (Al+Si) at 87 mg/kg.",
      //timeDetected: "12 hours ago",
      recommendation: "Switch to alternative bunker supply immediately. Increase purifier throughput and decrease settling time.",
      severity: "HIGH"
    }
  ],
  yellow: [
    {
      title: "Maintenance Schedule Overdue",
      description: "16 routine maintenance tasks are between 14-21 days overdue, including critical safety equipment checks.",
      //timeDetected: "5 days ago",
      recommendation: "Schedule maintenance at earliest convenience. Prioritize safety-critical systems.",
      severity: "MEDIUM"
    },
    {
      title: "Certificate Expiration Warning",
      description: "Multiple vessel certificates expire within 30 days: IOPP (21 days), Safety Equipment (28 days), Class (30 days).",
      //timeDetected: "2 days ago",
      recommendation: "Initiate renewal process immediately. Contact flag administration for extensions if necessary.",
      severity: "MEDIUM"
    },
    {
      title: "Crew Change Required",
      description: "4 crew members approaching maximum contract duration (Chief Engineer, 2x ABs, Cook). Onboard time exceeding 9 months.",
      //timeDetected: "1 week ago",
      recommendation: "Schedule relief personnel at next suitable port. Prepare documentation for immigration.",
      severity: "MEDIUM"
    },
    {
      title: "Fuel Consumption Anomaly",
      description: "Fuel consumption 15.3% above expected parameters for current speed and draft. Potential hull fouling or propeller issue.",
      //timeDetected: "4 days ago",
      recommendation: "Monitor and investigate cause. Schedule underwater inspection if trend continues.",
      severity: "MEDIUM"
    },
    {
      title: "Weather Advisory - High Seas",
      description: "Moderate sea conditions expected in upcoming route segment. Forecasted wave heights 3-4m with occasional 5m swells.",
      //timeDetected: "6 hours ago",
      recommendation: "Monitor for potential changes. Secure deck cargo and prepare vessel for moderate rolling.",
      severity: "MEDIUM"
    },
    {
      title: "Port Congestion Alert",
      description: "Destination port reporting extended delays averaging 3.5 days for vessels of similar class. 14 vessels in queue.",
      //timeDetected: "1 day ago",
      recommendation: "Consider schedule adjustments and slow steaming to optimize arrival time and reduce fuel consumption.",
      severity: "MEDIUM"
    },
    {
      title: "Planned Maintenance Due",
      description: "Multiple scheduled maintenance items due within 7 days, including main engine injector replacement and generator overhaul.",
      //timeDetected: "3 days ago",
      recommendation: "Confirm parts availability on board. Schedule engineer's time appropriately before port arrival.",
      severity: "MEDIUM"
    },
    {
      title: "Communication System Degraded",
      description: "Satellite communication system operating at 68% capacity. Intermittent connectivity issues reported by bridge team.",
      //timeDetected: "8 hours ago",
      recommendation: "Monitor and troubleshoot antenna alignment. Schedule technician inspection at next port.",
      severity: "MEDIUM"
    }
  ]
};

const AlertModal = ({ isOpen, onClose, alerts, vesselName, pscScore }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [isOpen]);
  
  if (!isOpen && !visible) {
    return null;
  }

  const getPSCRiskStyle = (score) => {
    const baseStyle = {
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    };

    if (score < 60) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.25))',
        border: '1px solid rgba(231, 76, 60, 0.3)',
        color: '#E74C3C',
        boxShadow: '0 2px 12px rgba(231, 76, 60, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      };
    } else if (score < 80) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.15), rgba(241, 196, 15, 0.25))',
        border: '1px solid rgba(241, 196, 15, 0.3)',
        color: '#F1C40F',
        boxShadow: '0 2px 12px rgba(241, 196, 15, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      };
    } else {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(46, 204, 113, 0.25))',
        border: '1px solid rgba(46, 204, 113, 0.3)',
        color: '#2ECC71',
        boxShadow: '0 2px 12px rgba(46, 204, 113, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      };
    }
  };
  
  return (
    <div 
      className={`alert-modal-backdrop ${visible ? 'visible' : ''}`}
      onClick={onClose}
    >
      <div 
        className={`alert-modal ${visible ? 'visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="alert-modal-header">
          <div className="alert-modal-title-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={24} color="#3BADE5" />
              <h3 className="alert-modal-title">
                Alert Center: {vesselName || 'Vessel'}
              </h3>
            </div>
            {pscScore !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '32px', fontSize: '13px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>PSC Risk:</span>
                <div style={getPSCRiskStyle(pscScore)}>
                  <span>{pscScore < 60 ? 'High' : pscScore < 80 ? 'Medium' : 'Low'}</span>
                  <span style={{ opacity: 0.8 }}>({Math.round(pscScore)})</span>
                </div>
              </div>
            )}
          </div>
          <button 
            className="alert-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="alert-modal-body">
          {alerts.redAlerts > 0 && (
            <div className="alert-section critical">
              <div className="alert-section-header">
                <div className="alert-section-icon critical">
                  <AlertCircle size={20} color="#E74C3C" />
                </div>
                <h4 className="alert-section-title">
                  Critical Alerts
                  <span className="alert-count">{alerts.redAlerts}</span>
                </h4>
              </div>
              
              <ul className="alert-list">
                {ALERT_RECOMMENDATIONS.red
                  .slice(0, alerts.redAlerts)
                  .map((alert, index) => (
                    <li 
                      key={`red-${index}`} 
                      className="alert-item critical"
                      style={{"--index": index}}
                    >
                      <div className="alert-item-header">
                        <div className="alert-item-title">
                          {alert.title}
                        </div>
                        <span className="alert-severity severity-critical">
                          Critical
                        </span>
                      </div>
                      
                      <p className="alert-item-description">{alert.description}</p>
                      
                      <div className="alert-item-metadata">
                        {/* <div className="metadata-item">
                          <Clock size={12} />
                          <span>{alert.timeDetected}</span>
                        </div> */}
                        <div className="metadata-item">
                          <Shield size={12} />
                          <span>{alert.recommendation}</span>
                        </div>
                      </div>
                      
                      {/* <div className="alert-actions">
                        <button className="alert-action-button">
                          Take Action
                        </button>
                      </div> */}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          
          {alerts.yellowAlerts > 0 && (
            <div className="alert-section warning">
              <div className="alert-section-header">
                <div className="alert-section-icon warning">
                  <AlertTriangle size={20} color="#F1C40F" />
                </div>
                <h4 className="alert-section-title">
                  Warning Alerts
                  <span className="alert-count">{alerts.yellowAlerts}</span>
                </h4>
              </div>
              
              <ul className="alert-list">
                {ALERT_RECOMMENDATIONS.yellow
                  .slice(0, alerts.yellowAlerts)
                  .map((alert, index) => (
                    <li 
                      key={`yellow-${index}`} 
                      className="alert-item warning"
                      style={{"--index": index}}
                    >
                      <div className="alert-item-header">
                        <div className="alert-item-title">
                          {alert.title}
                        </div>
                        <span className="alert-severity severity-warning">
                          Warning
                        </span>
                      </div>
                      
                      <p className="alert-item-description">{alert.description}</p>
                      
                      <div className="alert-item-metadata">
                        {/* <div className="metadata-item">
                          <Clock size={12} />
                          <span>{alert.timeDetected}</span>
                        </div> */}
                        <div className="metadata-item">
                          <Shield size={12} />
                          <span>{alert.recommendation}</span>
                        </div>
                      </div>
                      
                      <div className="alert-actions">
                        {/* <button className="alert-action-button">
                          Review
                        </button> */}
                        {/* <button className="alert-action-button secondary">
                          View Details <ChevronRight size={12} />
                        </button> */}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;