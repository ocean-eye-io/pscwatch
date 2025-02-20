// src/components/vessel/Navigation.jsx
import React from 'react';
import { Ship, FileText, CheckSquare } from 'lucide-react';

const Navigation = ({ currentStep, setCurrentStep }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Ship },
    { id: 'notification', label: '5-Day Notice', icon: FileText },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <div className="flex gap-2 p-1 bg-[#132337] rounded-lg">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setCurrentStep(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 flex-1
            ${currentStep === id 
              ? 'bg-[#3BADE5] text-white shadow-lg' 
              : 'text-white/70 hover:bg-white/5'}`}
        >
          <Icon size={18} className={currentStep === id ? 'animate-pulse' : ''} />
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;