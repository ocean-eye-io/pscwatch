// src/components/vessel/NotificationForm.jsx
import React, { useState } from 'react';
import { Clock, Anchor, Users, SendHorizontal } from 'lucide-react';

const NotificationForm = ({ onSubmit, vessel }) => {
  const [formData, setFormData] = useState({
    eta: vessel.eta,
    lastPort: '',
    crewDetails: '',
    remarks: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const InputField = ({ icon: Icon, label, ...props }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-white/80 text-sm">
        <Icon size={16} className="text-[#3BADE5]" />
        {label}
      </label>
      {props.type === 'textarea' ? (
        <textarea
          {...props}
          className="w-full p-3 bg-[#0B1623] border border-white/10 rounded-lg text-white 
            focus:border-[#3BADE5] focus:ring-1 focus:ring-[#3BADE5] transition-all"
        />
      ) : (
        <input
          {...props}
          className="w-full p-3 bg-[#0B1623] border border-white/10 rounded-lg text-white 
            focus:border-[#3BADE5] focus:ring-1 focus:ring-[#3BADE5] transition-all"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#132337] rounded-lg p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-white mb-6">
          5-Day Notification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={Clock}
            label="Estimated Time of Arrival"
            type="datetime-local"
            value={formData.eta}
            onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
          />

          <InputField
            icon={Anchor}
            label="Last Port"
            type="text"
            placeholder="Enter last port of call"
            value={formData.lastPort}
            onChange={(e) =>
              setFormData({ ...formData, lastPort: e.target.value })
            }
          />

          <InputField
            icon={Users}
            label="Crew Details"
            type="textarea"
            rows="4"
            placeholder="Enter crew details"
            value={formData.crewDetails}
            onChange={(e) =>
              setFormData({ ...formData, crewDetails: e.target.value })
            }
          />

          <InputField
            icon={SendHorizontal}
            label="Additional Remarks"
            type="textarea"
            rows="3"
            placeholder="Any additional information"
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#3BADE5] rounded-lg text-white font-medium
                hover:bg-[#3BADE5]/90 transition-all duration-200 shadow-lg 
                hover:shadow-[#3BADE5]/20"
            >
              <SendHorizontal size={18} />
              <span>Submit Notification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;
