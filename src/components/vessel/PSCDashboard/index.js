// src/components/vessel/PSCDashboard/index.jsx
import React from 'react';
import { ArrivingStatus } from './components/ArrivingStatus';
import { TaskCard } from './components/TaskCard';

const PSCDashboard = ({ vesselData, onUpdateData }) => {
  const { daysToArrival, tasks, managerInstructions } = vesselData;

  return (
    <div>
      <ArrivingStatus daysToArrival={daysToArrival} />
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-white mb-4">Pending Tasks</h3>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              status={task.status}
              dueDate={task.dueDate}
            />
          ))}
        </div>

        <div>
          <h3 className="text-white mb-4">Manager's Instructions</h3>
          <div className="bg-[#132337] rounded-lg p-4 text-white">
            <p>{managerInstructions}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white mb-4">Defects Dashboard</h3>
        <div className="bg-[#132337] rounded-lg p-4">
          <p className="text-white/60">Defects management features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default PSCDashboard;