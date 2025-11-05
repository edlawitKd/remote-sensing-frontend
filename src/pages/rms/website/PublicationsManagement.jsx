import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { websiteApi } from "../../../services/api";
import { Plus, Edit, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";

const PublicationsManagement = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPub, setEditingPub] = useState(null);
  const [formData, setFormData] = useState({
    type: "Paper",
    title: "",
    authors: "",
    year: new Date().getFullYear(),
    link: "",
    description: ""
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await websiteApi.publications.getAll();
      setPublications(response.data);
    } catch (error) {
      console.error("Failed to load publications:", error);
      toast.error("Failed to load publications");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPub) {
        await websiteApi.publications.update(editingPub.id, formData);
        toast.success("Publication updated successfully");
      } else {
        await websiteApi.publications.create(formData);
        toast.success("Publication created successfully");
      }
      
      setShowForm(false);
      setEditingPub(null);
      setFormData({
        type: "Paper",
        title: "",
        authors: "",
        year: new Date().getFullYear(),
        link: "",
        description: ""
      });
      fetchPublications();
    } catch (error) {
      console.error("Failed to save publication:", error);
      toast.error("Failed to save publication");
    }
  };

  const handleEdit = (publication) => {
    setEditingPub(publication);
    setFormData({
      type: publication.type,
      title: publication.title,
      authors: publication.authors,
      year: publication.year,
      link: publication.link || "",
      description: publication.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this publication?")) {
      try {
        await websiteApi.publications.delete(id);
        toast.success("Publication deleted successfully");
        fetchPublications();
      } catch (error) {
        console.error("Failed to delete publication:", error);
        toast.error("Failed to delete publication");
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading publications...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-secondary">Publications Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
          >
            <Plus size={16} /> Add Publication
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingPub ? "Edit Publication" : "Add New Publication"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Paper">Paper</option>
                    <option value="Book">Book</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authors *
                </label>
                <input
                  type="text"
                  required
                  value={formData.authors}
                  onChange={(e) => setFormData({...formData, authors: e.target.value})}
                  placeholder="Separate authors with commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
                >
                  {editingPub ? "Update" : "Create"} Publication
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPub(null);
                    setFormData({
                      type: "Paper",
                      title: "",
                      authors: "",
                      year: new Date().getFullYear(),
                      link: "",
                      description: ""
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

        <div className="space-y-4">
          {publications.map((pub) => (
            <div key={pub.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      pub.type === 'Book' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pub.type}
                    </span>
                    <span className="text-sm text-gray-500">{pub.year}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-secondary">{pub.title}</h3>
                  <p className="text-gray-600 text-sm">{pub.authors}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pub)}
                    className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              {pub.description && (
                <p className="text-gray-600 text-sm mb-3">{pub.description}</p>
              )}

              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:text-secondary transition"
                >
                  <ExternalLink size={14} /> View Publication
                </a>
              )}
            </div>
          ))}
        </div>

        {publications.length === 0 && !showForm && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No publications found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Add Publication" to add your first publication.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublicationsManagement;