// src/components/vessel/PreArrivalChecklist.jsx
import React, { useState } from 'react';
import {
  CheckSquare,
  AlertCircle,
  FileText,
  Shield,
  Anchor,
  Settings,
  BookOpen,
  SendHorizontal,
} from 'lucide-react';

const PreArrivalChecklist = ({ onSubmit, vessel }) => {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: 'Documentation',
      icon: FileText,
      items: [
        { id: 'doc1', text: 'Vessel certificates up to date', checked: false },
        { id: 'doc2', text: 'Crew certificates valid', checked: false },
        { id: 'doc3', text: 'Port documentation prepared', checked: false },
      ],
    },
    {
      id: 2,
      title: 'Safety Equipment',
      icon: Shield,
      items: [
        {
          id: 'safety1',
          text: 'Life-saving equipment checked',
          checked: false,
        },
        { id: 'safety2', text: 'Firefighting equipment ready', checked: false },
        { id: 'safety3', text: 'Emergency systems tested', checked: false },
      ],
    },
    {
      id: 3,
      title: 'Navigation',
      icon: Anchor,
      items: [
        { id: 'nav1', text: 'Charts updated', checked: false },
        { id: 'nav2', text: 'Navigation equipment tested', checked: false },
        { id: 'nav3', text: 'Passage plan prepared', checked: false },
      ],
    },
    {
      id: 4,
      title: 'Technical',
      icon: Settings,
      items: [
        { id: 'tech1', text: 'Main engine checked', checked: false },
        { id: 'tech2', text: 'Auxiliary engines tested', checked: false },
        { id: 'tech3', text: 'Critical spares verified', checked: false },
      ],
    },
  ]);

  const [remarks, setRemarks] = useState('');

  const handleCheckItem = (sectionId, itemId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : section
      )
    );
  };

  const getTotalProgress = () => {
    const totalItems = sections.reduce(
      (sum, section) => sum + section.items.length,
      0
    );
    const checkedItems = sections.reduce(
      (sum, section) =>
        sum + section.items.filter((item) => item.checked).length,
      0
    );
    return Math.round((checkedItems / totalItems) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      sections,
      remarks,
      progress: getTotalProgress(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Progress Header */}
      <div className="bg-[#132337] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="text-[#3BADE5]" />
            Pre-arrival Checklist
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/60">Progress</span>
            <span className="text-lg font-bold text-white">
              {getTotalProgress()}%
            </span>
          </div>
        </div>
        <div className="h-2 bg-[#0B1623] rounded-full">
          <div
            className="h-full bg-[#3BADE5] rounded-full transition-all duration-300"
            style={{ width: `${getTotalProgress()}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Checklist Sections */}
        <div className="grid grid-cols-2 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-[#132337] rounded-lg p-6 hover:bg-[#132337]/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="text-[#3BADE5]" size={20} />
                <h3 className="text-white font-medium">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-[#0B1623] rounded-lg cursor-pointer
                      hover:bg-[#0B1623]/80 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckItem(section.id, item.id)}
                      className="rounded border-white/20 text-[#3BADE5] 
                        focus:ring-[#3BADE5] focus:ring-offset-0 focus:ring-offset-transparent"
                    />
                    <span className="text-white/90 text-sm">{item.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Remarks Section */}
        <div className="bg-[#132337] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-[#3BADE5]" size={20} />
            <h3 className="text-white font-medium">Additional Remarks</h3>
          </div>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows="4"
            className="w-full p-3 bg-[#0B1623] border border-white/10 rounded-lg text-white 
              focus:border-[#3BADE5] focus:ring-1 focus:ring-[#3BADE5] transition-all"
            placeholder="Add any additional notes or comments..."
          />
        </div>

        {/* Warning for Incomplete Items */}
        {getTotalProgress() < 100 && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-lg">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-500 text-sm">
              Please complete all checklist items before submission.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={getTotalProgress() < 100}
            className="flex items-center gap-2 px-6 py-3 bg-[#3BADE5] rounded-lg text-white font-medium
              hover:bg-[#3BADE5]/90 transition-all duration-200 shadow-lg 
              hover:shadow-[#3BADE5]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal size={18} />
            <span>Submit Checklist</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreArrivalChecklist;
