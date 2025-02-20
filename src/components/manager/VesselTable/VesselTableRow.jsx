// src/components/manager/VesselTable/VesselTableRow.jsx
import React from 'react';
import { ChevronRight, ChevronDown, MessageSquare } from 'lucide-react';

const VesselTableRow = ({
  vessel,
  isExpanded,
  onToggleExpand,
  onOpenInstructions,
  mainColumns,
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
      case 'sent':
        return '#4CAF50';
      case 'incomplete':
      case 'pending':
        return '#FF5252';
      default:
        return '#f4f4f4';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score < 50) return '#4CAF50';
    if (score < 75) return '#FFC107';
    return '#FF5252';
  };

  const renderCellContent = (key, value) => {
    switch (key) {
      case 'checklistStatus':
      case 'notificationStatus':
        return (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: getStatusColor(value),
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getStatusColor(value),
              }}
            ></span>
            {value}
          </span>
        );

      case 'riskScore':
        return (
          <span
            style={{
              color: getRiskScoreColor(value),
              fontWeight: '600',
            }}
          >
            {value}
          </span>
        );

      case 'openDefects':
        return (
          <span
            style={{
              color: value > 0 ? '#FF5252' : '#4CAF50',
              fontWeight: '500',
            }}
          >
            {value}
          </span>
        );

      default:
        return value || '-';
    }
  };

  return (
    <>
      <tr
        style={{
          borderBottom: '1px solid rgba(244, 244, 244, 0.1)',
          backgroundColor: isExpanded
            ? 'rgba(59, 173, 229, 0.1)'
            : 'transparent',
          transition: 'background-color 0.2s',
        }}
      >
        <td style={{ padding: '12px', textAlign: 'center' }}>
          <button
            onClick={onToggleExpand}
            style={{
              background: 'none',
              border: 'none',
              color: '#f4f4f4',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </td>

        {mainColumns.map((column) => (
          <td
            key={column.key}
            style={{
              padding: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            {renderCellContent(column.key, vessel[column.key])}
          </td>
        ))}

        <td style={{ padding: '12px' }}>
          <button
            onClick={() => onOpenInstructions(vessel)}
            style={{
              background: 'none',
              border: 'none',
              color: '#3BADE5',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <MessageSquare size={16} />
            <span>Instructions</span>
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr style={{ backgroundColor: 'rgba(59, 173, 229, 0.1)' }}>
          <td colSpan={mainColumns.length + 2} style={{ padding: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}
            >
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Last PSC Date
                </p>
                <p>{vessel.lastPSC || '-'}</p>
              </div>
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Days to Go
                </p>
                <p>{vessel.daysToGo || '-'}</p>
              </div>
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  From Port
                </p>
                <p>{vessel.fromPort || '-'}</p>
              </div>
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Arrival Country
                </p>
                <p>{vessel.arrivalCountry || '-'}</p>
              </div>
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Event Type
                </p>
                <p>{vessel.eventType || '-'}</p>
              </div>
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Owner
                </p>
                <p>{vessel.owner || '-'}</p>
              </div>
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  IMO No
                </p>
                <p>{vessel.imoNo || '-'}</p>
              </div>
              <div>
                <p
                  style={{
                    color: 'rgba(244, 244, 244, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Departure Date
                </p>
                <p>{vessel.departureDate || '-'}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default VesselTableRow;
