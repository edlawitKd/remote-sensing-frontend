// ProposalForm.jsx - Fixed version with budget and duration
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProposalForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "research",
    abstract: "",
    file: null,
    budget: "",
    duration_months: "12",
    is_client_request: false,
    organization: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("📤 Submitting proposal...");
      
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("abstract", formData.abstract);
      data.append("budget", formData.budget || "50000.00");
      data.append("duration_months", formData.duration_months || "12");
      data.append("file", formData.file);
      data.append("is_client_request", formData.is_client_request);

      // Add client info if needed
      if (formData.is_client_request) {
        data.append("client_organization", formData.organization);
        data.append("client_email", formData.email);
        data.append("client_phone", formData.phone);
      }

      console.log("🚀 Sending proposal data...");
      const response = await API.post("/rms/proposals/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Proposal submitted:", response.data);
      toast.success("Proposal submitted successfully!");

      // Reset form
      setFormData({
        title: "",
        category: "research",
        abstract: "",
        file: null,
        budget: "",
        duration_months: "12",
        is_client_request: false,
        organization: "",
        email: "",
        phone: "",
      });

      // Clear file input
      if (document.getElementById("file-input")) {
        document.getElementById("file-input").value = "";
      }

    } catch (err) {
      console.error("❌ Failed to submit proposal:", err);
      const errorMessage = err.response?.data?.message || "Failed to submit proposal. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="animate-fadeInUp">
        <h1 className="text-2xl font-semibold text-secondary mb-6">
          Submit Proposal
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              placeholder="Enter proposal title"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="research">Research</option>
              <option value="project">Project</option>
            </select>
          </div>

          {/* Abstract */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Abstract *</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border rounded p-2"
              placeholder="Provide a brief abstract of your proposal"
            ></textarea>
          </div>

          {/* Budget */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Budget ($)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="50000.00"
              step="0.01"
              min="0"
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Duration (months)</label>
            <input
              type="number"
              name="duration_months"
              value={formData.duration_months}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="12"
              min="1"
              max="60"
            />
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Upload Proposal File *
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              required
              className="w-full border rounded p-2"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>

          {/* Client Request Toggle */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_client_request"
              checked={formData.is_client_request}
              onChange={handleChange}
            />
            <label className="text-sm">Is this from a client?</label>
          </div>

          {/* Client Info (conditional) */}
          {formData.is_client_request && (
            <div className="bg-gray-50 border p-4 rounded-md mb-4">
              <h3 className="font-semibold text-sm mb-2">Client Information</h3>
              <input
                type="text"
                name="organization"
                placeholder="Organization *"
                value={formData.organization}
                onChange={handleChange}
                required={formData.is_client_request}
                className="border rounded p-2 w-full mb-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required={formData.is_client_request}
                className="border rounded p-2 w-full mb-2"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Proposal"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProposalForm;