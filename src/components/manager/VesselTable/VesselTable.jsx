// src/components/manager/VesselTable/VesselTable.jsx
import React, { useState } from 'react';
import VesselTableRow from './VesselTableRow';
import { ChevronDown } from 'lucide-react';

const VesselTable = ({ vessels, onOpenInstructions }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // Columns configuration
  const mainColumns = [
    { key: 'name', label: 'Vessel' },
    { key: 'vesselType', label: 'Vessel Type' },
    { key: 'doc', label: 'DOC' },
    { key: 'arrivingPort', label: 'Arriving Port' },
    { key: 'eta', label: 'ETA' },
    { key: 'etb', label: 'ETB' },
    { key: 'etd', label: 'ETD' },
    { key: 'lastAMSA', label: 'Last AMSA' },
    { key: 'checklistStatus', label: 'Checklist Status' },
    { key: 'notificationStatus', label: '5-Day Notice' },
    { key: 'riskScore', label: 'Risk Score' },
    { key: 'openDefects', label: 'Defects' },
  ];

  return (
    <div
      style={{
        background: '#132337',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#f4f4f4',
            fontSize: '14px',
          }}
        >
          <thead style={{ background: '#0B1623' }}>
            <tr>
              <th style={{ padding: '12px', width: '40px' }}></th>
              {mainColumns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => handleSort(column.key)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {column.label}
                    {sortConfig.key === column.key && (
                      <ChevronDown
                        size={14}
                        style={{
                          transform:
                            sortConfig.direction === 'desc'
                              ? 'rotate(180deg)'
                              : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vessels
              .sort((a, b) => {
                if (!sortConfig.key) return 0;

                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue)
                  return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue)
                  return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
              })
              .map((vessel) => (
                <VesselTableRow
                  key={vessel.id}
                  vessel={vessel}
                  isExpanded={expandedRows.has(vessel.id)}
                  onToggleExpand={() => toggleRowExpansion(vessel.id)}
                  onOpenInstructions={onOpenInstructions}
                  mainColumns={mainColumns}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VesselTable;
