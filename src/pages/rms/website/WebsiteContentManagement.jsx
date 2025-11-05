import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { websiteApi } from "../../../services/api";
import { Save, Home, Info, Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const WebsiteContentManagement = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // About Content
  const [aboutContent, setAboutContent] = useState({
    vision: "",
    mission: "",
    resources: []
  });

  // Home Content
  const [homeContent, setHomeContent] = useState({
    statistics: [],
    images: [],
    newImage: null,
    newAltText: ""
  });

  const [newStatistic, setNewStatistic] = useState({ number: "", label: "", is_plus: false });
  const [newResource, setNewResource] = useState({ title: "", items: [""] });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching website content...");

      const [aboutRes, homeRes] = await Promise.all([
        websiteApi.content.getAbout().catch(() => ({ data: { vision: "", mission: "", resources: [] } })),
        websiteApi.content.getHomeContent().catch(() => ({ data: { statistics: [], images: [] } }))
      ]);

      setAboutContent(aboutRes.data);
      setHomeContent(prev => ({
        ...prev,
        statistics: homeRes.data.statistics || [],
        images: homeRes.data.images || []
      }));
    } catch (error) {
      console.error("❌ Failed to load website content:", error);
      setError("Failed to load website content. Please check if the backend API is running.");
      toast.error("Failed to load website content");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async () => {
    setSaving(true);
    try {
      console.log("💾 Saving about content:", aboutContent);
      await websiteApi.content.updateAbout(aboutContent);
      toast.success("About content saved successfully");
    } catch (error) {
      console.error("❌ Failed to save about content:", error);
      toast.error("Failed to save about content. API endpoint may not exist.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHome = async () => {
    setSaving(true);
    try {
      console.log("💾 Saving home content:", homeContent);
      await websiteApi.content.updateHomeContent({
        statistics: homeContent.statistics
      });
      toast.success("Home content saved successfully");
    } catch (error) {
      console.error("❌ Failed to save home content:", error);
      toast.error("Failed to save home content. API endpoint may not exist.");
    } finally {
      setSaving(false);
    }
  };

  const addStatistic = () => {
    if (newStatistic.number && newStatistic.label) {
      setHomeContent(prev => ({
        ...prev,
        statistics: [...prev.statistics, { ...newStatistic, number: parseInt(newStatistic.number) }]
      }));
      setNewStatistic({ number: "", label: "", is_plus: false });
    }
  };

  const removeStatistic = (index) => {
    setHomeContent(prev => ({
      ...prev,
      statistics: prev.statistics.filter((_, i) => i !== index)
    }));
  };

  const addResource = () => {
    if (newResource.title && newResource.items[0]) {
      setAboutContent(prev => ({
        ...prev,
        resources: [...prev.resources, { ...newResource }]
      }));
      setNewResource({ title: "", items: [""] });
    }
  };

  const removeResource = (index) => {
    setAboutContent(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const uploadImage = async () => {
    if (!homeContent.newImage) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", homeContent.newImage);
    formData.append("alt_text", homeContent.newAltText);

    try {
      await websiteApi.content.uploadHomeImage(formData);
      toast.success("Image uploaded successfully");
      fetchContent();
      setHomeContent(prev => ({ ...prev, newImage: null, newAltText: "" }));
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      toast.error("Failed to upload image");
    }
  };

  const deleteImage = async (id) => {
    try {
      await websiteApi.content.deleteHomeImage(id);
      toast.success("Image deleted");
      fetchContent();
    } catch (err) {
      toast.error("Failed to delete image");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading website content...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Content</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchContent}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-secondary">Website Content Management</h1>
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
              activeTab === "about"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Info size={16} />
            About Page
          </button>
          <button
            onClick={() => setActiveTab("home")}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-sm ${
              activeTab === "home"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Home size={16} />
            Home Page
          </button>
        </div>

        {/* About Page Content */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-secondary mb-4">Vision & Mission</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Statement
                  </label>
                  <textarea
                    rows="3"
                    value={aboutContent.vision}
                    onChange={(e) => setAboutContent({...aboutContent, vision: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter the vision statement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Statement
                  </label>
                  <textarea
                    rows="3"
                    value={aboutContent.mission}
                    onChange={(e) => setAboutContent({...aboutContent, mission: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter the mission statement..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-secondary mb-4">Resources & Facilities</h3>

              {/* Add New Resource */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-700 mb-3">Add New Resource</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="Resource title (e.g., Software, Equipment)"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items (one per line)
                    </label>
                    <textarea
                      rows="3"
                      value={newResource.items.join('\n')}
                      onChange={(e) => setNewResource({...newResource, items: e.target.value.split('\n')})}
                      placeholder="List items separated by new lines"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={addResource}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
                  >
                    Add Resource
                  </button>
                </div>
              </div>

              {/* Existing Resources */}
              <div className="space-y-3">
                {aboutContent.resources?.map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{resource.title}</h4>
                      <button
                        onClick={() => removeResource(index)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {resource.items?.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveAbout}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save About Content"}
            </button>
          </div>
        )}

        {/* Home Page Content */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* Statistics Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-secondary mb-4">Statistics Section</h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-700 mb-3">Add New Statistic</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={newStatistic.number}
                    onChange={(e) => setNewStatistic({...newStatistic, number: e.target.value})}
                    placeholder="Number"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={newStatistic.label}
                    onChange={(e) => setNewStatistic({...newStatistic, label: e.target.value})}
                    placeholder="Label (e.g., Projects Completed)"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newStatistic.is_plus}
                      onChange={(e) => setNewStatistic({...newStatistic, is_plus: e.target.checked})}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-700">Show plus sign</label>
                  </div>
                </div>
                <button
                  onClick={addStatistic}
                  className="mt-3 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
                >
                  Add Statistic
                </button>
              </div>

              {/* Existing Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {homeContent.statistics?.map((stat, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                    <button
                      onClick={() => removeStatistic(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {stat.number}{stat.is_plus ? '+' : ''}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-secondary mb-4">Home Page Images</h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-700 mb-3">Upload New Image</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHomeContent(prev => ({ ...prev, newImage: e.target.files[0] }))}
                  className="mb-3 block w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Alt text / Description"
                  value={homeContent.newAltText}
                  onChange={(e) => setHomeContent(prev => ({ ...prev, newAltText: e.target.value }))}
                  className="block w-full mb-3 border border-gray-300 rounded px-3 py-2"
                />
                <button
                  onClick={uploadImage}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
                >
                  Upload Image
                </button>
              </div>

              {/* Existing Images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {homeContent.images?.map((img) => (
                  <div key={img.id} className="relative border rounded-lg overflow-hidden">
                    <img src={img.image} alt={img.alt_text} className="w-full h-40 object-cover" />
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveHome}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Home Content"}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WebsiteContentManagement;
