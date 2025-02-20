// src/components/manager/Charts/ArrivalsByPortChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ArrivalsByPortChart = ({ data }) => {
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
        Vessels by Port
      </h3>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 244, 244, 0.1)" />
        <XAxis dataKey="port" stroke="#f4f4f4" />
        <YAxis stroke="#f4f4f4" />
        <Tooltip 
          contentStyle={{ 
            background: '#0B1623',
            border: '1px solid rgba(244, 244, 244, 0.1)',
            color: '#f4f4f4'
          }}
        />
        <Bar dataKey="vessels" fill="#3BADE5" />
      </BarChart>
    </div>
  );
};

export default ArrivalsByPortChart;

