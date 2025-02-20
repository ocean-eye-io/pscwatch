// src/components/vessel/PSCDashboard/components/TaskCard.jsx
export const TaskCard = ({ title, status, dueDate }) => (
  <div className="bg-[#132337] rounded-lg p-4 mb-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-white text-base">{title}</h3>
      <span
        className={`px-3 py-1 rounded-full text-xs
        ${
          status === 'completed'
            ? 'bg-green-500/10 text-green-500'
            : 'bg-red-500/10 text-red-500'
        }`}
      >
        {status}
      </span>
    </div>
    <p className="text-white/60 text-sm">Due: {dueDate}</p>
  </div>
);
