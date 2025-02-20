// src/components/manager/VesselTable/VesselActions.jsx
import React from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

const VesselActions = ({ vessel, onOpenInstructions }) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
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
    </div>
  );
};

export default VesselActions;
