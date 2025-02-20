// src/components/manager/QuickActions/InstructionsPanel.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const InstructionsPanel = ({ vessel, onClose, onSave }) => {
  const [instructions, setInstructions] = useState(vessel.instructions || '');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '100vh',
        background: '#132337',
        padding: '24px',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ color: '#f4f4f4' }}>Instructions for {vessel.name}</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#f4f4f4',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>
      </div>

      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Enter instructions or comments..."
        style={{
          width: '100%',
          height: '200px',
          background: '#0B1623',
          border: '1px solid rgba(244, 244, 244, 0.1)',
          borderRadius: '4px',
          padding: '12px',
          color: '#f4f4f4',
          fontFamily: 'Nunito',
          resize: 'vertical',
          marginBottom: '16px',
        }}
      />

      <button
        onClick={() => onSave(vessel.id, instructions)}
        style={{
          width: '100%',
          padding: '12px',
          background: '#3BADE5',
          border: 'none',
          borderRadius: '4px',
          color: '#f4f4f4',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Save Instructions
      </button>
    </div>
  );
};

export default InstructionsPanel;
