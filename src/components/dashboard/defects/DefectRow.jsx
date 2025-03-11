import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const STATUS_COLORS = {
  OPEN: {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    glow: 'shadow-[0_0_10px_rgba(255,77,79,0.3)]',
  },
  CLOSED: {
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    glow: 'shadow-[0_0_10px_rgba(82,196,26,0.3)]',
  },
  'IN PROGRESS': {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    glow: 'shadow-[0_0_10px_rgba(250,173,20,0.3)]',
  },
};

const DEFAULT_STATUS_COLORS = {
  bg: 'bg-gray-500/20',
  text: 'text-gray-300',
  glow: 'shadow-[0_0_10px_rgba(128,128,128,0.3)]',
};

export const DefectRow = ({ defect, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalize the status value
  const normalizedStatus = defect?.status?.toUpperCase().trim() || 'UNKNOWN';

  // Get the status colors or fallback to default
  const statusColors = STATUS_COLORS[normalizedStatus] || DEFAULT_STATUS_COLORS;

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <tr className="border-b border-white/10 hover:bg-white/5 transition-all duration-200">
        <td className="px-3 py-1.5">
          <button
            onClick={toggleExpand}
            className="p-0.5 hover:bg-white/10 rounded"
          >
            <span
              className={`inline-block transition-transform duration-300 text-[#3BADE5] ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`}
            >
              ▼
            </span>
          </button>
        </td>
        <td className="px-3 py-1.5">{defect.vesselName || '-'}</td>
        <td className="px-3 py-1.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs 
              ${statusColors.bg} 
              ${statusColors.text} 
              ${statusColors.glow}`}
          >
            <span className="w-1 h-1 rounded-full bg-current mr-1"></span>
            {normalizedStatus}
          </span>
        </td>
        <td className="px-3 py-1.5">{defect.criticality || '-'}</td>
        <td className="px-3 py-1.5">{defect.equipment || '-'}</td>
        <td className="px-3 py-1.5">{defect.description || '-'}</td>
      </tr>

      {isExpanded && (
        <tr className="bg-[#132337]/50">
          <td colSpan="6" className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0B1623] rounded-md p-3 shadow-lg">
                <h4 className="text-xs font-medium text-[#3BADE5] mb-2">
                  Description
                </h4>
                <div className="text-xs text-white/90">
                  {defect.description || '-'}
                </div>
              </div>
              <div className="bg-[#0B1623] rounded-md p-3 shadow-lg">
                <h4 className="text-xs font-medium text-[#3BADE5] mb-2">
                  Action Planned
                </h4>
                <div className="text-xs text-white/90">
                  {defect.actionPlanned || '-'}
                </div>
              </div>
              <div className="bg-[#0B1623] rounded-md p-3 shadow-lg">
                <h4 className="text-xs font-medium text-[#3BADE5] mb-2">
                  Comments
                </h4>
                <div className="text-xs text-white/90">
                  {defect.comments || '-'}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default DefectRow;