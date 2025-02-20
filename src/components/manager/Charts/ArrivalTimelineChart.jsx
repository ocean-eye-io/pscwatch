// src/components/manager/Charts/ArrivalTimelineChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';

const ArrivalTimelineChart = ({ data }) => {
  return (
    <div style={{ 
      background: '#132337',
      padding: '20px',
      borderRadius: '8px'
    }}>
      <h3 style={{ 
        color: '#f4f4f4', 
        marginBottom: '16px',
        fontSize: '16px'
      }}>
        Arrival in (Days)
      </h3>
      <BarChart 
        width={500} 
        height={300} 
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 244, 244, 0.1)" horizontal={false} />
        <XAxis type="number" stroke="#f4f4f4" />
        <YAxis dataKey="range" type="category" stroke="#f4f4f4" width={100} />
        <Tooltip
          contentStyle={{ 
            background: '#0B1623',
            border: '1px solid rgba(244, 244, 244, 0.1)',
            color: '#f4f4f4'
          }}
          formatter={(value, name) => [`${value} vessels`, 'Count']}
        />
        <Bar dataKey="vessels" barSize={40}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList dataKey="vessels" position="right" fill="#f4f4f4" />
        </Bar>
      </BarChart>
    </div>
  );
};

export default ArrivalTimelineChart;