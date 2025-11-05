import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { websiteApi } from "../../../services/api";
import { Plus, Edit, Trash2, Calendar, Newspaper } from "lucide-react";
import { toast } from "react-toastify";

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Event",
    description: "",
    date: new Date().toISOString().split('T')[0],
    image: null
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await websiteApi.news.getAll();
      setNews(response.data);
    } catch (error) {
      console.error("Failed to load news:", error);
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingNews) {
        await websiteApi.news.update(editingNews.id, submitData);
        toast.success("News updated successfully");
      } else {
        await websiteApi.news.create(submitData);
        toast.success("News created successfully");
      }
      
      setShowForm(false);
      setEditingNews(null);
      setFormData({
        title: "",
        category: "Event",
        description: "",
        date: new Date().toISOString().split('T')[0],
        image: null
      });
      fetchNews();
    } catch (error) {
      console.error("Failed to save news:", error);
      toast.error("Failed to save news");
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      category: newsItem.category,
      description: newsItem.description,
      date: newsItem.date,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await websiteApi.news.delete(id);
        toast.success("News deleted successfully");
        fetchNews();
      } catch (error) {
        console.error("Failed to delete news:", error);
        toast.error("Failed to delete news");
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading news...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-secondary">News & Events Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
          >
            <Plus size={16} /> Add News
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingNews ? "Edit News" : "Add New News"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Event">Event</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
                >
                  {editingNews ? "Update" : "Create"} News
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNews(null);
                    setFormData({
                      title: "",
                      category: "Event",
                      description: "",
                      date: new Date().toISOString().split('T')[0],
                      image: null
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
          {news.map((newsItem) => (
            <div key={newsItem.id} className="bg-white rounded-lg shadow overflow-hidden">
              {newsItem.image && (
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-secondary">{newsItem.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    newsItem.category === 'Event' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {newsItem.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <Calendar size={14} />
                  {new Date(newsItem.date).toLocaleDateString()}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {newsItem.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(newsItem)}
                    className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(newsItem.id)}
                    className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && !showForm && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <Newspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No news items found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Add News" to create your first news item.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewsManagement;