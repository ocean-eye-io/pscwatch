// src/components/vessel/PSCDashboard.jsx
import React from 'react';

const PSCDashboard = ({ vesselData }) => {
  const { tasks, managerInstructions } = vesselData;

  const KPIBox = ({ label, value, info }) => (
    <div className="mb-6">
      <div className="flex items-center gap-1 mb-1">
        <h3 className="text-white text-sm">{label}</h3>
        {info && <span className="text-white/60">ⓘ</span>}
      </div>
      <p className="text-white text-2xl">{value}</p>
    </div>
  );

  const TaskItem = ({ title, status, dueDate }) => (
    <div className="mb-4">
      <h4 className="text-white mb-1">{title}</h4>
      <div className="flex items-center justify-between">
        <span className="text-white/60 text-sm">{status}</span>
        <span className="text-white/60 text-sm">Due: {dueDate}</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Main Arrival Info */}
      <div className="mb-8">
        <h2 className="text-2xl text-white mb-2">5 Days to Arrival</h2>
        <p className="text-white/60">Preparing for arrival at GLADSTONE</p>
      </div>

      {/* KPIs */}
      <div className="mb-8">
        <KPIBox label="PSC Score" value="85" info={true} />
        <KPIBox label="Open Defects" value="3" info={true} />
        <KPIBox label="Days Since Last PSC" value="45" info={true} />
      </div>

      {/* Critical Tasks */}
      <div className="mb-8">
        <h3 className="text-white mb-4">⚠️ Critical Tasks</h3>
        {tasks.map((task) => (
          <TaskItem key={task.id} {...task} />
        ))}
      </div>

      {/* Manager's Instructions */}
      <div className="mb-8">
        <h3 className="text-white mb-4">Manager's Instructions</h3>
        <p className="text-white/80 leading-relaxed">{managerInstructions}</p>
      </div>

      {/* Defects Dashboard */}
      <div>
        <h3 className="text-white mb-4">Defects Dashboard</h3>
        <p className="text-white/60">
          Enhanced defects management features coming soon...
        </p>
      </div>
    </div>
  );
};

export default PSCDashboard;
