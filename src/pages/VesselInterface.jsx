import React, { useState } from 'react';
import Navigation from '../components/vessel/Navigation';
import NotificationForm from '../components/vessel/NotificationForm';
import PSCDashboard from '../components/vessel/PSCDashboard';

const VesselInterface = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const vesselData = {
    tasks: [
      {
        id: 1,
        title: 'Safety Drill',
        status: 'Pending',
        dueDate: '2025-02-25',
      },
    ],
    managerInstructions: 'Ensure all safety equipment is checked.',
  };

  return (
    <div className="min-h-screen bg-[#0B1623]">
      <header className="bg-[#132337] border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Maritime Operations</h1>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <button className="hover:text-white">Manager Dashboard</button>
            <button className="hover:text-white">Vessel Interface</button>
          </div>
        </div>
      </header>

      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-white mb-2">SDTR ERICA</h2>
            <div className="text-white/70 space-y-1">
              <p>Bulk Carrier</p>
              <p>Next Port: GLADSTONE</p>
            </div>
          </div>
          <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {currentTab === 'dashboard' && <PSCDashboard vesselData={vesselData} />}
        {currentTab === 'notification' && (
          <NotificationForm onSubmit={() => {}} vessel={{ eta: '' }} />
        )}
        {currentTab === 'checklist' && <div>Pre-arrival Checklist</div>}
      </main>
    </div>
  );
};

export default VesselInterface;
