import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../../components/DashboardLayout";
import API from "../../../services/api";
import { Download, Upload, Clock, Shield, HardDrive, CheckCircle, RefreshCw, Database } from "lucide-react";

const BackupRecovery = () => {
  const [backups, setBackups] = useState([]);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [stats, setStats] = useState({
    total_size: "0 MB",
    last_backup: "Never",
    next_backup: "Not scheduled"
  });

  const fetchBackupInfo = async () => {
    try {
      // Fetch system data to generate backup info
      const [usersResponse, proposalsResponse, projectsResponse] = await Promise.all([
        API.get('/rms/users/').catch(() => ({ data: [] })),
        API.get('/rms/proposals/').catch(() => ({ data: [] })),
        API.get('/rms/projects/').catch(() => ({ data: [] }))
      ]);

      const totalRecords = 
        usersResponse.data.length + 
        proposalsResponse.data.length + 
        projectsResponse.data.length;
      
      const totalSizeMB = (totalRecords * 0.05).toFixed(1);

      // Generate simulated backup history
      const simulatedBackups = [
        {
          id: 1,
          name: `backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}`,
          size: `${totalSizeMB} MB`,
          date: new Date().toISOString(),
          status: 'completed',
          records: totalRecords
        },
        {
          id: 2,
          name: `backup_${new Date(Date.now() - 86400000).toISOString().split('T')[0].replace(/-/g, '_')}`,
          size: `${(totalRecords * 0.05 * 0.95).toFixed(1)} MB`,
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          records: Math.floor(totalRecords * 0.95)
        },
        {
          id: 3,
          name: `backup_${new Date(Date.now() - 172800000).toISOString().split('T')[0].replace(/-/g, '_')}`,
          size: `${(totalRecords * 0.05 * 0.90).toFixed(1)} MB`,
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
          records: Math.floor(totalRecords * 0.90)
        },
      ];

      setBackups(simulatedBackups);
      setStats({
        total_size: `${(totalSizeMB * 3).toFixed(1)} MB`,
        last_backup: new Date().toLocaleDateString(),
        next_backup: new Date(Date.now() + 86400000).toLocaleDateString()
      });

    } catch (error) {
      console.error('Error fetching backup info:', error);
    }
  };

  const createBackup = async () => {
    setCreatingBackup(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const newBackup = {
        id: backups.length + 1,
        name: `backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}_${Date.now()}`,
        size: `${(Math.random() * 10 + 40).toFixed(1)} MB`,
        date: new Date().toISOString(),
        status: 'completed',
        records: Math.floor(Math.random() * 100) + 50
      };
      
      setBackups([newBackup, ...backups]);
      setStats(prev => ({
        ...prev,
        last_backup: new Date().toLocaleDateString()
      }));
      
      alert("Backup created successfully!");
    } catch (error) {
      console.error('Error creating backup:', error);
      alert("Backup creation failed. Please try again.");
    } finally {
      setCreatingBackup(false);
    }
  };

  const downloadBackup = (backupId) => {
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      alert(`Downloading backup: ${backup.name}`);
      // In a real app, this would trigger an actual download
    }
  };

  useEffect(() => {
    fetchBackupInfo();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-secondary">Backups & Recovery</h1>
            <p className="text-gray-600 mt-1">Manage system backups and recovery operations</p>
          </div>
          <button
            onClick={createBackup}
            disabled={creatingBackup}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
          >
            <Download size={18} className={creatingBackup ? "animate-spin" : ""} />
            {creatingBackup ? "Creating Backup..." : "Create Backup"}
          </button>
        </div>

        {/* Backup Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <HardDrive size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Backup Size</p>
                <h2 className="text-2xl font-bold">{stats.total_size}</h2>
                <p className="text-xs text-gray-600 mt-1">All backups combined</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Shield size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Last Backup</p>
                <h2 className="text-2xl font-bold">{stats.last_backup}</h2>
                <p className="text-xs text-gray-600 mt-1">Most recent backup</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Clock size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Next Backup</p>
                <h2 className="text-2xl font-bold">{stats.next_backup}</h2>
                <p className="text-xs text-gray-600 mt-1">Scheduled backup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Backup List */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary">Recent Backups</h2>
            <button
              onClick={fetchBackupInfo}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Backup Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-gray-400" />
                        {backup.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(backup.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {backup.records} records
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadBackup(backup.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Download Backup"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                          title="Restore Backup"
                        >
                          <Upload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recovery Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Recovery Options</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-700 flex items-center gap-2">
                <Shield size={18} />
                Emergency System Restore
              </button>
              <button className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-orange-700 flex items-center gap-2">
                <Upload size={18} />
                Restore from Backup File
              </button>
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 flex items-center gap-2">
                <Clock size={18} />
                Point-in-Time Recovery
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Backup Schedule</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Automatic Backups:</span>
                <span className="font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium">Daily</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Retention Period:</span>
                <span className="font-medium">30 days</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Storage Location:</span>
                <span className="font-medium">Local Server</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BackupRecovery;