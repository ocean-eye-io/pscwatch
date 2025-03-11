import React from 'react';
import { MessageSquare } from 'lucide-react';
import {
  Table,
  StatusIndicator,
  TableBadge,
  ExpandedItem
} from '../../common/Table';

const VesselTable = ({ 
  vessels, 
  onOpenRemarks, 
  fieldMappings 
}) => {
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
    return Object.entries(fieldMappings.TABLE)
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
          
          // Special rendering for days to go
          if (fieldId === 'daysToGo' && typeof value === 'number') {
            return value.toFixed(1);
          }
          
          // Default rendering
          return value === null || value === undefined ? '-' : value;
        }
      }));
  };

  // Create expanded content renderer
  const renderExpandedContent = (vessel) => {
    const expandedColumns = Object.entries(fieldMappings.EXPANDED)
      .sort((a, b) => a[1].priority - b[1].priority);
      
    return (
      <div className="expanded-grid">
        {expandedColumns.map(([fieldId, field]) => (
          <ExpandedItem
            key={fieldId}
            label={field.label}
            value={vessel[field.dbField]}
          />
        ))}
      </div>
    );
  };

  

// In your VesselTable component
// In your VesselTable component
// In your VesselTable component
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
        </div>

        {/* Enhanced Tooltip */}
        {hasComments && (
          <div className="comment-tooltip-wrapper">
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
    );
  }
};

  return (
    <Table
      data={vessels}
      columns={getTableColumns()}
      expandedContent={renderExpandedContent}
      actions={commentsColumn}
      uniqueIdField="imo_no"
      defaultSortKey="eta"
      defaultSortDirection="desc"
    />
  );
};

export default VesselTable;