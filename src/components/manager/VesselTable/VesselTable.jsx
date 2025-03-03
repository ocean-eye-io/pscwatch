// src/components/manager/VesselTable/VesselTable.jsx
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { 
  Table, 
  StatusIndicator, 
  TableBadge, 
  ExpandedItem, 
  ActionButton 
} from '../../common/Table';

const VesselTable = ({ vessels, onOpenInstructions, fieldMappings }) => {
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
      .filter(([_, field]) => !field.isAction)
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

  // Create actions content
  const actions = {
    label: 'Actions',
    width: '120px',
    content: (vessel) => (
      <ActionButton
        onClick={() => onOpenInstructions(vessel)}
        icon={<MessageSquare />}
      >
        Instructions
      </ActionButton>
    )
  };

  return (
    <Table
      data={vessels}
      columns={getTableColumns()}
      expandedContent={renderExpandedContent}
      actions={actions}
      uniqueIdField="imo_no"
      defaultSortKey="eta"
      defaultSortDirection="desc"
    />
  );
};

export default VesselTable;