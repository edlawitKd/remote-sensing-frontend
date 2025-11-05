import React from "react";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div
      className={`flex items-center justify-between bg-white rounded-lg shadow p-4 border-l-4 ${color}`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  );
};

export default StatsCard;