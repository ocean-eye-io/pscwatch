

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ResponsiveChartContainer from '../../../common/charts/ResponsiveChartContainer';
import '../../../common/charts/styles/chartStyles.css';

const ArrivalsByPortChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [loading, setLoading] = useState(false);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {payload[0].value} vessels
          </p>
          <div className="tooltip-arrow"></div>
        </div>
      );
    }
    return null;
  };

  // Mock download function (retains your original intent for download)
  const handleDownload = () => {
    // Add export functionality here
    console.log('Download chart');
  };

  return (
    <ResponsiveChartContainer 
      title="Vessels by Port" 
      downloadChart={handleDownload}
      loading={loading}
    >
      <ResponsiveContainer>
        <BarChart 
          data={data}
          onMouseMove={(e) => {
            if (e && e.activeTooltipIndex !== undefined) {
              setHoveredBar(e.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredBar(null)}
          className="chart-transition"
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(244, 244, 244, 0.05)"
            vertical={false}
          />
          <XAxis 
            dataKey="port" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: 'rgba(244, 244, 244, 0.1)' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: 'rgba(244, 244, 244, 0.1)' }}
            tickLine={false}
          />
          <Tooltip 
            cursor={false}
            content={<CustomTooltip />}
          />
          <Bar 
            dataKey="vessels" 
            className="chart-bar"
            radius={[6, 6, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </ResponsiveChartContainer>
  );
};

export default ArrivalsByPortChart;