// src/components/vessel/PSCDashboard/components/ArrivingStatus.jsx
import React from 'react';

export const ArrivingStatus = ({ daysToArrival }) => (
  <div className="bg-[#132337] rounded-lg p-5 mb-6">
    <h2 className="text-white mb-3">{daysToArrival} Days to Arrival</h2>
    <div className="h-1 bg-[#0B1623] rounded">
      <div
        className="h-full bg-green-500 rounded transition-all duration-300"
        style={{ width: `${(5 - daysToArrival) * 20}%` }}
      />
    </div>
  </div>
);
