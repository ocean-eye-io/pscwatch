// src/components/manager/Charts/ArrivalTimelineChart.jsx

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts';
import { Download, Maximize2, Minimize2 } from 'lucide-react';
import './styles/chartStyles.css';

const ArrivalTimelineChart = ({ data }) => {
  const [isActive, setIsActive] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  
  // Default empty data array to prevent mapping errors
  const safeData = Array.isArray(data) ? data : [];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.range}</p>
          <p className="tooltip-value">
            {payload[0].value} vessels
          </p>
          <div className="tooltip-arrow"></div>
        </div>
      );
    }
    return null;
  };

  // Determine if we have data to show
  const hasData = safeData.length > 0;

  return (
    <div 
      className={`chart-card ${isActive ? 'active' : ''}`}
      onClick={() => setIsActive(!isActive)}
    >
      <div className="chart-header">
        <h3 className="chart-title">
          Arrival in (Days)
          <span className="chart-title-highlight"></span>
        </h3>
        <div className="chart-actions">
          <button 
            className="chart-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              // Add export functionality
            }}
          >
            <Download size={14} />
          </button>
          <button 
            className="chart-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsActive(!isActive);
            }}
          >
            {isActive ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div className="chart-wrapper timeline-chart">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={safeData}
              layout="vertical"
              margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
              onMouseMove={(e) => {
                if (e && e.activeTooltipIndex !== undefined) {
                  setHoveredBar(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredBar(null)}
              className="chart-transition"
            >
              <defs>
                {/* Create a default gradient for all bars */}
                <linearGradient id="defaultBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3BADE5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3BADE5" stopOpacity={1} />
                </linearGradient>
                
                {/* Only create individual gradients if we have data */}
                {safeData.map((entry, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`barGradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor={entry.color || '#3BADE5'}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor={entry.color || '#3BADE5'}
                      stopOpacity={1}
                    />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(244, 244, 244, 0.05)" 
                horizontal={false} 
              />
              <XAxis 
                type="number" 
                stroke="#f4f4f4"
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                dataKey="range" 
                type="category" 
                stroke="#f4f4f4" 
                width={100}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                cursor={false}
                content={<CustomTooltip />}
              />
              <Bar 
                dataKey="vessels" 
                barSize={40}
                className="timeline-bar"
                fill="url(#defaultBarGradient)" // Fallback fill
              >
                {safeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#barGradient-${index})`}
                    className={`timeline-cell ${hoveredBar === index ? 'hovered' : ''}`}
                  />
                ))}
                <LabelList 
                  dataKey="vessels" 
                  position="right" 
                  fill="#f4f4f4"
                  className="timeline-label"
                  formatter={(value) => `${value}`}
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-no-data">No arrival timeline data available</div>
        )}
      </div>
    </div>
  );
};

export default ArrivalTimelineChart;