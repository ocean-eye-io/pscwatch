import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import {
  Table,
  StatusIndicator,
  TableBadge,
  ExpandedItem,
  AlertIndicator
} from '../../common/Table';
import CheckboxField from '../../common/Table/CheckboxField';
import AlertModal from './AlertModal';

const VesselTable = ({ 
  vessels, 
  onOpenRemarks, 
  fieldMappings,
  onUpdateVessel
}) => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedVesselAlerts, setSelectedVesselAlerts] = useState(null);
  // Add a new state to store processed vessels with stable random values
  const [processedVessels, setProcessedVessels] = useState([]);

  // Process vessels only when the vessels prop changes
  useEffect(() => {
    const processedData = vessels.map(vessel => {
      const statuses = ['Completed', 'In Progress', 'Pending'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomPSCScore = Math.floor(Math.random() * 100);

      if (!vessel.alerts) {
        const redAlerts = Math.floor(Math.random() * 3);
        const yellowAlerts = Math.floor(Math.random() * 4) + 1;
        
        return {
          ...vessel,
          checklistStatus: randomStatus,
          pscScore: randomPSCScore,
          alerts: {
            redAlerts,
            yellowAlerts
          }
        };
      }
      return {
        ...vessel,
        checklistStatus: randomStatus,
        pscScore: randomPSCScore
      };
    });
    
    setProcessedVessels(processedData);
  }, [vessels]); // Only re-run if vessels prop changes

  const getGlassyStatusStyle = (status) => {
    const colors = {
      'Completed': {
        background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(46, 204, 113, 0.25))',
        border: '1px solid rgba(46, 204, 113, 0.3)',
        color: '#2ECC71',
        boxShadow: '0 2px 12px rgba(46, 204, 113, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      },
      'In Progress': {
        background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.15), rgba(241, 196, 15, 0.25))',
        border: '1px solid rgba(241, 196, 15, 0.3)',
        color: '#F1C40F',
        boxShadow: '0 2px 12px rgba(241, 196, 15, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      },
      'Pending': {
        background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.25))',
        border: '1px solid rgba(231, 76, 60, 0.3)',
        color: '#E74C3C',
        boxShadow: '0 2px 12px rgba(231, 76, 60, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      }
    };

    return {
      ...colors[status],
      padding: '4px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '12px',
      display: 'inline-block',
      backdropFilter: 'blur(8px)',
      transform: 'translateZ(0)',
      transition: 'all 0.2s ease',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
    };
  };

  const getPSCRiskStyle = (score) => {
    let style = {
      padding: '4px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      backdropFilter: 'blur(8px)',
      transform: 'translateZ(0)',
      transition: 'all 0.2s ease',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      width: 'fit-content'
    };

    if (score < 60) {
      return {
        ...style,
        background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.25))',
        border: '1px solid rgba(231, 76, 60, 0.3)',
        color: '#E74C3C',
        boxShadow: '0 2px 12px rgba(231, 76, 60, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      };
    } else if (score < 80) {
      return {
        ...style,
        background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.15), rgba(241, 196, 15, 0.25))',
        border: '1px solid rgba(241, 196, 15, 0.3)',
        color: '#F1C40F',
        boxShadow: '0 2px 12px rgba(241, 196, 15, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      };
    } else {
      return {
        ...style,
        background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(46, 204, 113, 0.25))',
        border: '1px solid rgba(46, 204, 113, 0.3)',
        color: '#2ECC71',
        boxShadow: '0 2px 12px rgba(46, 204, 113, 0.2), inset 0 1px rgba(255, 255, 255, 0.1)'
      };
    }
  };

  const handleOpenAlertModal = (vessel) => {
    setSelectedVesselAlerts({
      vesselName: vessel.vessel_name,
      pscScore: vessel.pscScore,
      ...vessel.alerts
    });
    setAlertModalOpen(true);
  };

  const formatDateTime = (dateString, includeTime = false) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      if (includeTime) {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#f4f4f4';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('at sea') || statusLower.includes('transit')) {
      return '#3498DB';
    } else if (statusLower.includes('port') || statusLower.includes('berth')) {
      return '#2ECC71';
    } else if (statusLower.includes('anchor')) {
      return '#F1C40F';
    } else {
      return '#f4f4f4';
    }
  };

  const getRiskScoreVariant = (score) => {
    if (!score && score !== 0) return 'info';
    if (score < 50) return 'success';
    if (score < 75) return 'warning';
    return 'danger';
  };

  const getTableColumns = () => {
    // Create a map to store our columns with consistent rendering
    const columnMap = {};
    
    // Process the standard columns from fieldMappings
    Object.entries(fieldMappings.TABLE)
      .filter(([fieldId, field]) => !field.isAction && fieldId !== 'comments')
      .forEach(([fieldId, field]) => {
        columnMap[field.dbField] = {
          field: field.dbField,
          label: field.label,
          width: field.width,
          minWidth: field.minWidth,
          render: (value, rowData) => {
            if (fieldId === 'event_type') {
              return (
                <StatusIndicator 
                  status={value}
                  color={getStatusColor(value)}
                />
              );
            }
            
            if (fieldId === 'riskScore') {
              const score = value !== null && value !== undefined ? Math.round(value) : null;
              return (
                <TableBadge 
                  variant={getRiskScoreVariant(score)}
                >
                  {score !== null ? score : '-'}
                </TableBadge>
              );
            }
            
            if (field.type === 'date') {
              return formatDateTime(value, false);
            }
            
            if (
              fieldId === 'eta' || 
              fieldId === 'etb' || 
              fieldId === 'etd' || 
              fieldId === 'atd' ||
              fieldId === 'psc_last_inspection_date'
            ) {
              return formatDateTime(value, true);
            }
            
            if (fieldId === 'daysToGo' && typeof value === 'number') {
              return value.toFixed(1);
            }
            
            if (fieldId === 'checklist_received') {
              return (
                <CheckboxField 
                  value={value}
                  vessel={rowData}
                  onUpdate={onUpdateVessel}
                />
              );
            }
            
            return value === null || value === undefined ? '-' : value;
          }
        };
      });

    // Define PSC Risk column
    const pscRiskColumn = {
      field: 'pscScore',
      label: 'PSC Risk',
      width: '150px',
      render: (value) => {
        const score = value !== null && value !== undefined ? Math.round(value) : null;
        const riskLevel = score < 60 ? 'High' : score < 80 ? 'Medium' : 'Low';
        
        return (
          <div 
            style={getPSCRiskStyle(score)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateZ(0) scale(1.02)';
              e.currentTarget.style.boxShadow = e.currentTarget.style.boxShadow.replace('2px', '4px');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateZ(0)';
              e.currentTarget.style.boxShadow = e.currentTarget.style.boxShadow.replace('4px', '2px');
            }}
          >
            <span>{riskLevel}</span>
            <span style={{ opacity: 0.8 }}>({score})</span>
          </div>
        );
      }
    };

    // Define Alerts column
    const alertsColumn = {
      field: 'alerts',
      label: 'Alerts',
      width: '100px',
      sortable: false,
      render: (value, rowData) => (
        <AlertIndicator
          redCount={value ? value.redAlerts : 0}
          yellowCount={value ? value.yellowAlerts : 0}
          onClick={() => handleOpenAlertModal(rowData)}
        />
      )
    };

    // Define Checklist Status column
    const checklistStatusColumn = {
      field: 'checklistStatus',
      label: 'Checklist Status',
      width: '150px',
      render: (value) => (
        <div 
          style={getGlassyStatusStyle(value)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateZ(0) scale(1.02)';
            e.currentTarget.style.boxShadow = e.currentTarget.style.boxShadow.replace('2px', '4px');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateZ(0)';
            e.currentTarget.style.boxShadow = e.currentTarget.style.boxShadow.replace('4px', '2px');
          }}
        >
          {value || '-'}
        </div>
      )
    };
    
    // Create the column sequence exactly as requested
    // Vessel, IMO No, ETA, Arrival Port, PSC Risk, Alerts, Checklist Status, Comments
    const orderedColumns = [
      columnMap['vessel_name'],  // Vessel Name
      columnMap['imo_no'],       // IMO No
      columnMap['eta'],          // ETA
      columnMap['port'],         // Arrival Port (assuming 'port' is the database field)
      pscRiskColumn,             // PSC Risk
      alertsColumn,              // Alerts
      checklistStatusColumn      // Checklist Status
      // Comments will be added as the actions column
    ];
    
    // Filter out any undefined columns (in case any field names don't match)
    return orderedColumns.filter(Boolean);
  };

  const renderExpandedContent = (vessel) => {
    const expandedColumns = Object.entries(fieldMappings.EXPANDED)
      .sort((a, b) => a[1].priority - b[1].priority);
      
    return (
      <div className="expanded-grid">
        {expandedColumns.map(([fieldId, field]) => {
          let value = vessel[field.dbField];
          
          if (field.type === 'date') {
            value = formatDateTime(value, false);
          } else if (
            fieldId === 'etd' || 
            fieldId === 'atd'
          ) {
            value = formatDateTime(value, true);
          }
          
          return (
            <ExpandedItem
              key={fieldId}
              label={field.label}
              value={value}
            />
          );
        })}
      </div>
    );
  };

  // Comments column (will be the last column as actions)
  const commentsColumn = {
    label: 'Comments',
    width: '180px',
    content: (vessel) => {
      const hasComments = vessel.comments && vessel.comments.trim().length > 0;
      
      return (
        <div className="comment-cell">
          <div 
            className={`comment-indicator ${hasComments ? 'has-comment' : 'no-comment'}`}
            onClick={() => onOpenRemarks(vessel)}
          >
            <div className="comment-icon">
              <MessageSquare size={16} />
            </div>
            
            {hasComments ? (
              <div className="comment-preview-text">
                {vessel.comments.length > 38 
                  ? `${vessel.comments.substring(0, 38)}...` 
                  : vessel.comments}
              </div>
            ) : (
              <div className="comment-add-text">Add comment</div>
            )}

            {hasComments && (
              <div className="comment-tooltip">
                <div className="comment-tooltip-content">
                  <div className="tooltip-header">
                    <span>Comment</span>
                    <button 
                      className="tooltip-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRemarks(vessel);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="tooltip-body">
                    {vessel.comments}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Table
        data={processedVessels}
        columns={getTableColumns()}
        expandedContent={renderExpandedContent}
        actions={commentsColumn} // Comments will be the last column
        uniqueIdField="imo_no"
        defaultSortKey="eta"
        defaultSortDirection="desc"
      />
      
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        alerts={selectedVesselAlerts || { redAlerts: 0, yellowAlerts: 0 }}
        vesselName={selectedVesselAlerts?.vesselName || 'Vessel'}
        pscScore={selectedVesselAlerts?.pscScore}
      />
    </>
  );
};

export default VesselTable;