import React from 'react';
import DashboardLayout from "../../../components/DashboardLayout"; // Fixed path

const SystemLogs = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-secondary">System Logs</h1>
            <p className="text-gray-600 mt-1">Monitor system activity and security events</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-500">System logs functionality coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemLogs;