// src/components/manager/VesselTable/VesselTableRow.jsx
import React from 'react';
import { ChevronRight, ChevronDown, MessageSquare } from 'lucide-react';

const VesselTableRow = ({ 
  vessel, 
  isExpanded, 
  onToggleExpand, 
  onOpenInstructions,
  fieldMappings
}) => {
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

  const getRiskScoreColor = (score) => {
    if (!score && score !== 0) return '#f4f4f4';
    if (score < 50) return '#2ECC71'; // Low risk - Green
    if (score < 75) return '#F1C40F'; // Medium risk - Yellow
    return '#E74C3C'; // High risk - Red
  };

  const formatValue = (value, fieldId) => {
    if (value === null || value === undefined) return '-';
    
    switch (fieldId) {
      case 'daysToGo':
        return value.toFixed(1);
      case 'riskScore':
        return Math.round(value);
      default:
        return value;
    }
  };

  const renderCellContent = (fieldId, value) => {
    if (value === null || value === undefined) return '-';

    switch (fieldId) {
      case 'event_type':
        return (
          <span style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: getStatusColor(value)
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: getStatusColor(value)
            }}></span>
            {value}
          </span>
        );
      
      case 'riskScore':
        return (
          <span style={{ 
            color: getRiskScoreColor(value),
            fontWeight: '600'
          }}>
            {formatValue(value, fieldId)}
          </span>
        );
      
      default:
        return formatValue(value, fieldId);
    }
  };

  // Get visible columns for standard table view
  const visibleColumns = Object.entries(fieldMappings.TABLE)
    .filter(([_, field]) => !field.isAction)
    .sort((a, b) => a[1].priority - b[1].priority);

  // Get columns for expanded view
  const expandedColumns = Object.entries(fieldMappings.EXPANDED)
    .sort((a, b) => a[1].priority - b[1].priority);

  return (
    <>
      <tr className={`vessel-row ${isExpanded ? 'expanded' : ''}`}>
        <td>
          <button
            className="expand-button"
            onClick={onToggleExpand}
            aria-label={isExpanded ? "Collapse row" : "Expand row"}
          >
            {isExpanded ? 
              <ChevronDown size={16} /> : 
              <ChevronRight size={16} />
            }
          </button>
        </td>
        
        {visibleColumns.map(([fieldId, field]) => (
          <td key={fieldId}>
            {fieldId === 'event_type' ? (
              <div className="status-indicator">
                <span 
                  className="status-dot"
                  style={{ background: getStatusColor(vessel[field.dbField]) }}
                ></span>
                {vessel[field.dbField]}
              </div>
            ) : fieldId === 'riskScore' ? (
              <span 
                className="risk-score"
                style={{ color: getRiskScoreColor(vessel[field.dbField]) }}
              >
                {formatValue(vessel[field.dbField], fieldId)}
              </span>
            ) : (
              renderCellContent(fieldId, vessel[field.dbField])
            )}
          </td>
        ))}

        <td>
          <button
            className="instructions-button"
            onClick={() => onOpenInstructions(vessel)}
            aria-label="Open instructions"
          >
            <MessageSquare size={16} />
            <span>Instructions</span>
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="expanded-row">
          <td colSpan={visibleColumns.length + 2}>
            <div className="expanded-content">
              <div className="expanded-grid">
                {expandedColumns.map(([fieldId, field]) => (
                  <div key={fieldId} className="expanded-item">
                    <p className="expanded-label">{field.label}</p>
                    <p className="expanded-value">
                      {vessel[field.dbField] || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default VesselTableRow;