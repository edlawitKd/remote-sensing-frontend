// pages/rms/Profile.jsx - IMPROVED VERSION
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Updating profile with data:", formData);
      console.log("User ID:", user?.id);
      
      let response;
      let success = false;
      
      // Try multiple endpoints
      const endpoints = [
        `/rms/users/${user?.id}/`,
        `/auth/users/${user?.id}/`,
        `/api/users/${user?.id}/`,
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await API.patch(endpoint, formData);
          success = true;
          console.log("Profile update successful:", response.data);
          break;
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.response?.status);
          continue;
        }
      }
      
      if (!success) {
        throw new Error("All profile update endpoints failed");
      }
      
      toast.success("Profile updated successfully!");
      
      // Show success but note it might not persist without backend
      console.log("Profile updated in UI only - backend might not be saving");
      
    } catch (err) {
      console.error("Profile update error:", err);
      
      if (err.response) {
        // Server responded with error status
        const errorData = err.response.data;
        console.log("Error details:", errorData);
        
        if (err.response.status === 404) {
          toast.error("Profile endpoint not found. The update was not saved.");
        } else if (err.response.status === 400) {
          const errorMessage = Object.values(errorData).flat().join(', ') || "Invalid data";
          toast.error(`Update failed: ${errorMessage}`);
        } else {
          toast.error("Server error. Profile update failed.");
        }
      } else {
        // Network error or other issue
        toast.error("Network error. Profile update failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-secondary mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Profile updates might not persist if backend endpoints are not configured.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 font-medium"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;