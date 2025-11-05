import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import API from "../../../services/api";
import { Users, FileText, FolderOpen, BarChart3, Clock, Settings } from "lucide-react";

const SystemDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_proposals: 0,
    total_projects: 0,
    system_status: "Active"
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [usersRes, proposalsRes, projectsRes] = await Promise.all([
        API.get('/rms/users/'),
        API.get('/rms/proposals/'),
        API.get('/rms/projects/')
      ]);

      setStats({
        total_users: usersRes.data.length,
        total_proposals: proposalsRes.data.length,
        total_projects: projectsRes.data.length,
        system_status: "Active"
      });

    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-secondary">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and user management</p>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-blue-500" />
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <h2 className="text-2xl font-bold">{stats.total_users}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <div className="flex items-center gap-4">
              <FileText size={24} className="text-green-500" />
              <div>
                <p className="text-gray-500 text-sm">Total Proposals</p>
                <h2 className="text-2xl font-bold">{stats.total_proposals}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
            <div className="flex items-center gap-4">
              <FolderOpen size={24} className="text-purple-500" />
              <div>
                <p className="text-gray-500 text-sm">Active Projects</p>
                <h2 className="text-2xl font-bold">{stats.total_projects}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/rms/admin/users'}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <Users size={18} className="text-blue-500" />
                Manage User Accounts
              </button>
              <button 
                onClick={() => window.location.href = '/rms/admin/system-logs'}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <BarChart3 size={18} className="text-green-500" />
                View Activity Logs
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">Research RMS</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">Database</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Connected</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-700">User Authentication</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Working</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info */}
       {/* <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Internship Project</h3>
          <p className="text-yellow-700 text-sm">
            This Research Management System was developed as a 2-month internship project. 
            The system includes user management, proposal submission, project tracking, and notification features.
          </p>
        </div>*/}
      </div>
    </DashboardLayout>
  );
};

export default SystemDashboard;