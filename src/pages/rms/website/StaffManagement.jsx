import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { websiteApi } from "../../../services/api";
import { Plus, Edit, Trash2, Mail, Phone, User, Users } from "lucide-react";
import { toast } from "react-toastify";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    email: "",
    phone: "",
    publication: "",
    link: "",
    photo: null
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await websiteApi.staff.getAll();
      setStaff(response.data);
    } catch (error) {
      console.error("Failed to load staff:", error);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      if (editingStaff) {
        await websiteApi.staff.update(editingStaff.id, submitData);
        toast.success("Staff member updated successfully");
      } else {
        await websiteApi.staff.create(submitData);
        toast.success("Staff member created successfully");
      }
      
      setShowForm(false);
      setEditingStaff(null);
      setFormData({
        name: "", position: "", bio: "", email: "", phone: "", 
        publication: "", link: "", photo: null
      });
      fetchStaff();
    } catch (error) {
      console.error("Failed to save staff member:", error);
      toast.error("Failed to save staff member");
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      position: staffMember.position,
      bio: staffMember.bio || "",
      email: staffMember.email || "",
      phone: staffMember.phone || "",
      publication: staffMember.publication || "",
      link: staffMember.link || "",
      photo: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await websiteApi.staff.delete(id);
        toast.success("Staff member deleted successfully");
        fetchStaff();
      } catch (error) {
        console.error("Failed to delete staff member:", error);
        toast.error("Failed to delete staff member");
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading staff...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-secondary">Staff Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
          >
            <Plus size={16} /> Add Staff
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publications
                </label>
                <textarea
                  rows="2"
                  value={formData.publication}
                  onChange={(e) => setFormData({...formData, publication: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="List publications separated by commas"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Link
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
                >
                  {editingStaff ? "Update" : "Create"} Staff Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStaff(null);
                    setFormData({
                      name: "", position: "", bio: "", email: "", phone: "", 
                      publication: "", link: "", photo: null
                    });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((staffMember) => (
            <div key={staffMember.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  {staffMember.photo ? (
                    <img
                      src={staffMember.photo}
                      alt={staffMember.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-secondary">{staffMember.name}</h3>
                    <p className="text-gray-600">{staffMember.position}</p>
                  </div>
                </div>

                {staffMember.bio && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{staffMember.bio}</p>
                )}

                <div className="space-y-1 text-sm text-gray-500 mb-4">
                  {staffMember.email && (
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      {staffMember.email}
                    </div>
                  )}
                  {staffMember.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      {staffMember.phone}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(staffMember)}
                    className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staffMember.id)}
                    className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {staff.length === 0 && !showForm && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No staff members found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Add Staff" to add your first staff member.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffManagement;