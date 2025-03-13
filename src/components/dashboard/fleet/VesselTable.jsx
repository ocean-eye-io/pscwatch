import React, { useState } from 'react';
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
  // State for alert modal
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedVesselAlerts, setSelectedVesselAlerts] = useState(null);
  
  // Generate random alerts for each vessel (if not already present)
  const vesselsWithAlerts = vessels.map(vessel => {
    if (!vessel.alerts) {
      // Generate random alert counts
      const redAlerts = Math.floor(Math.random() * 3); // 0-2 red alerts
      const yellowAlerts = Math.floor(Math.random() * 4) + 1; // 1-4 yellow alerts
      
      return {
        ...vessel,
        alerts: {
          redAlerts,
          yellowAlerts
        }
      };
    }
    return vessel;
  });
  
  // Handler for opening alert modal
  const handleOpenAlertModal = (vessel) => {
    setSelectedVesselAlerts({
      vesselName: vessel.vessel_name,
      ...vessel.alerts
    });
    setAlertModalOpen(true);
  };

  // Enhanced format function that can handle both date and date+time
  const formatDateTime = (dateString, includeTime = false) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      
      if (includeTime) {
        // Format as "Month Day, Year, HH:MM"
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } else {
        // Format as "Month Day, Year"
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      return dateString; // Return original on error
    }
  };

  // Helper function to get status color based on vessel status
  const getStatusColor = (status) => {
    if (!status) return '#f4f4f4';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('at sea') || statusLower.includes('transit')) {
      return '#3498DB'; // Blue for at sea
    } else if (statusLower.includes('port') || statusLower.includes('berth')) {
      return '#2ECC71'; // Green for at port
    } else if (statusLower.includes('anchor')) {
      return '#F1C40F'; // Yellow for at anchor
    } else {
      return '#f4f4f4'; // Default
    }
  };

  // Helper function to get risk score color based on score value
  const getRiskScoreVariant = (score) => {
    if (!score && score !== 0) return 'info';
    if (score < 50) return 'success';
    if (score < 75) return 'warning';
    return 'danger';
  };

  // Convert field mappings to table columns format
  const getTableColumns = () => {
    const columns = Object.entries(fieldMappings.TABLE)
      .filter(([fieldId, field]) => !field.isAction && fieldId !== 'comments') // Exclude comments from main columns
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([fieldId, field]) => ({
        field: field.dbField,
        label: field.label,
        width: field.width,
        minWidth: field.minWidth,
        render: (value, rowData) => {
          // Special rendering for event_type (status)
          if (fieldId === 'event_type') {
            return (
              <StatusIndicator 
                status={value}
                color={getStatusColor(value)}
              />
            );
          }
          
          // Special rendering for risk score
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
          
          // Special rendering for date fields
          if (field.type === 'date') {
            return formatDateTime(value, false); // Format as date only
          }
          
          // Special rendering for date-time fields
          if (
            fieldId === 'eta' || 
            fieldId === 'etb' || 
            fieldId === 'etd' || 
            fieldId === 'atd' ||
            fieldId === 'psc_last_inspection_date'
          ) {
            return formatDateTime(value, true); // Format as date and time
          }
          
          // Special rendering for days to go
          if (fieldId === 'daysToGo' && typeof value === 'number') {
            return value.toFixed(1);
          }
          
          // Special rendering for checklist_received
          if (fieldId === 'checklist_received') {
            return (
              <CheckboxField 
                value={value}
                vessel={rowData}
                onUpdate={onUpdateVessel}
              />
            );
          }
          
          // Default rendering
          return value === null || value === undefined ? '-' : value;
        }
      }));
      
    // Add Alerts column
    columns.push({
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
    });
    
    return columns;
  };

  // Create expanded content renderer
  const renderExpandedContent = (vessel) => {
    const expandedColumns = Object.entries(fieldMappings.EXPANDED)
      .sort((a, b) => a[1].priority - b[1].priority);
      
    return (
      <div className="expanded-grid">
        {expandedColumns.map(([fieldId, field]) => {
          let value = vessel[field.dbField];
          
          // Format date values in expanded panel
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

            {/* Tooltip moved inside the indicator */}
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
        data={vesselsWithAlerts}
        columns={getTableColumns()}
        expandedContent={renderExpandedContent}
        actions={commentsColumn}
        uniqueIdField="imo_no"
        defaultSortKey="eta"
        defaultSortDirection="desc"
      />
      
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        alerts={selectedVesselAlerts || { redAlerts: 0, yellowAlerts: 0 }}
        vesselName={selectedVesselAlerts?.vesselName || 'Vessel'}
      />
    </>
  );
};

export default VesselTable;