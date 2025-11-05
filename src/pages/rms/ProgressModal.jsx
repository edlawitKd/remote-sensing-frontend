// ProgressModal.jsx - Enhanced version
import React, { useState } from "react";
import API from "../../services/api";
import { Calendar, FileText, AlertCircle } from "lucide-react";

const ProgressModal = ({ project, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    phase: "other",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await API.post("/rms/progress/", {
        project: project.id,
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        phase: formData.phase,
        notes: formData.notes
      });
      onSaved();
    } catch (err) {
      console.error("Failed to add progress", err);
      alert("Failed to add progress milestone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const phaseOptions = [
    { value: 'literature_review', label: 'Literature Review' },
    { value: 'methodology', label: 'Methodology Development' },
    { value: 'data_collection', label: 'Data Collection' },
    { value: 'analysis', label: 'Data Analysis' },
    { value: 'writing', label: 'Report Writing' },
    { value: 'submission', label: 'Final Submission' },
    { value: 'other', label: 'Other' },
  ];

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <Calendar className="text-primary" size={24} />
          Add Progress Milestone - {project.proposal_title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
                placeholder="e.g. Literature Review Completion"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Phase</label>
              <select
                name="phase"
                value={formData.phase}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                {phaseOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Describe what needs to be accomplished in this milestone..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                min={today}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Additional notes (optional)"
              />
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <FileText size={16} />
              Project Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div><strong>Code:</strong> {project.project_code}</div>
              <div><strong>Budget:</strong> ${project.budget_allocated ? parseFloat(project.budget_allocated).toLocaleString() : 'N/A'}</div>
              <div><strong>Start:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</div>
              <div><strong>End:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>

          {/* Warning for overdue projects */}
          {project.end_date && new Date(project.end_date) < new Date() && (
            <div className="bg-orange-50 border border-orange-200 rounded p-3">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">Project end date has passed</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded bg-primary hover:bg-secondary text-white disabled:opacity-50 transition"
            >
              {loading ? "Adding..." : "Add Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressModal;