// src/components/manager/VesselTable/VesselTable.jsx
import React, { useState } from 'react';
import VesselTableRow from './VesselTableRow';
import { ChevronDown } from 'lucide-react';

const VesselTable = ({ vessels, onOpenInstructions, fieldMappings }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'eta', direction: 'asc' });

  const toggleRowExpansion = (vesselId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(vesselId)) {
      newExpandedRows.delete(vesselId);
    } else {
      newExpandedRows.add(vesselId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Get visible columns from the field mapping configuration
  const getVisibleColumns = () => {
    return Object.entries(fieldMappings.TABLE)
      .filter(([_, field]) => !field.isAction)
      .sort((a, b) => a[1].priority - b[1].priority);
  };

  // Sort the vessels based on sort configuration
  const getSortedVessels = () => {
    const sortableVessels = [...vessels];
    
    if (sortConfig.key) {
      sortableVessels.sort((a, b) => {
        // Handle null/undefined values
        if (a[sortConfig.key] === null || a[sortConfig.key] === undefined) return 1;
        if (b[sortConfig.key] === null || b[sortConfig.key] === undefined) return -1;
        
        // Compare based on data type
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        let result;
        
        // Date comparison
        if (aValue instanceof Date && bValue instanceof Date) {
          result = aValue.getTime() - bValue.getTime();
        }
        // String comparison
        else if (typeof aValue === 'string' && typeof bValue === 'string') {
          result = aValue.localeCompare(bValue);
        }
        // Number comparison
        else {
          result = aValue - bValue;
        }
        
        return sortConfig.direction === 'asc' ? result : -result;
      });
    }
    
    return sortableVessels;
  };

  const sortedVessels = getSortedVessels();
  const visibleColumns = getVisibleColumns();

  return (
    <div style={{ background: '#132337', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f4f4f4', fontSize: '14px' }}>
          <thead style={{ background: '#0B1623' }}>
            <tr>
              <th style={{ padding: '12px', width: '40px' }}></th>
              {visibleColumns.map(([fieldId, field]) => (
                <th 
                  key={fieldId}
                  style={{ 
                    padding: '12px', 
                    textAlign: 'left',
                    width: field.width,
                    minWidth: field.minWidth,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort(field.dbField)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {field.label}
                    {sortConfig.key === field.dbField && (
                      <ChevronDown 
                        size={16} 
                        style={{ 
                          transform: sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    )}
                  </div>
                </th>
              ))}
              <th style={{ padding: '12px', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedVessels.map((vessel) => (
              <VesselTableRow
                key={vessel.imo_no}
                vessel={vessel}
                isExpanded={expandedRows.has(vessel.imo_no)}
                onToggleExpand={() => toggleRowExpansion(vessel.imo_no)}
                onOpenInstructions={onOpenInstructions}
                fieldMappings={fieldMappings}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VesselTable;