// src/components/vessel/Navigation.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck, 
  ClipboardList 
} from 'lucide-react';

const Navigation = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={() => setCurrentTab('dashboard')}
        className={`
          flex items-center gap-2 py-2 border-b-2 
          ${currentTab === 'dashboard' 
            ? 'text-[#3BADE5] border-[#3BADE5]' 
            : 'text-white/70 border-transparent hover:text-white hover:border-white/20'
          }
          transition-colors duration-200
        `}
      >
        <LayoutDashboard size={16} />
        <span>Dashboard</span>
      </button>

      <button
        onClick={() => setCurrentTab('notification')}
        className={`
          flex items-center gap-2 py-2 border-b-2
          ${currentTab === 'notification' 
            ? 'text-[#3BADE5] border-[#3BADE5]' 
            : 'text-white/70 border-transparent hover:text-white hover:border-white/20'
          }
          transition-colors duration-200
        `}
      >
        <FileCheck size={16} />
        <span>5-Day Notice</span>
      </button>

      <button
        onClick={() => setCurrentTab('checklist')}
        className={`
          flex items-center gap-2 py-2 border-b-2
          ${currentTab === 'checklist' 
            ? 'text-[#3BADE5] border-[#3BADE5]' 
            : 'text-white/70 border-transparent hover:text-white hover:border-white/20'
          }
          transition-colors duration-200
        `}
      >
        <ClipboardList size={16} />
        <span>Checklist</span>
      </button>
    </div>
  );
};

export default Navigation;

