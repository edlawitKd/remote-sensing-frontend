import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../services/api";
import { Plus, Calendar, CheckCircle, Clock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressModal from "./ProgressModal";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/rms/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="animate-fadeInUp">
        <h1 className="text-2xl font-semibold text-secondary mb-6">
          Project Management
        </h1>

        {projects.length === 0 ? (
          <p className="text-gray-500">No active projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white shadow rounded-lg p-4 border-l-4 border-primary animate-zoomIn"
              >
                <h2 className="text-lg font-semibold mb-2 text-secondary">
                  {project.proposal_title}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  <b>Category:</b> {project.proposal?.category}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <b>Start Date:</b>{" "}
                  {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                </p>

                {/* Progress list */}
                <ProjectProgress projectId={project.id} />

                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setShowModal(true);
                  }}
                  className="mt-4 flex items-center gap-2 bg-primary text-white px-3 py-2 rounded hover:bg-secondary transition"
                >
                  <Plus size={18} /> Add Progress
                </button>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <ProgressModal
            project={selectedProject}
            onClose={() => setShowModal(false)}
            onSaved={() => {
              toast.success("Progress milestone added!");
              setShowModal(false);
              fetchProjects();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Inline component to show project progress
const ProjectProgress = ({ projectId }) => {
  const [progressList, setProgressList] = useState([]);

  const fetchProgress = async () => {
    try {
      const res = await API.get(`/rms/progress/`);
      // Filter progress by project ID on client side since backend might not support query params
      const projectProgress = res.data.filter(p => p.project === projectId);
      setProgressList(projectProgress);
    } catch (err) {
      console.error("Failed to load progress", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [projectId]);

  return (
    <div className="border-t pt-3 mt-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Progress Milestones
      </h3>
      {progressList.length === 0 ? (
        <p className="text-xs text-gray-500">No milestones yet.</p>
      ) : (
        <ul className="space-y-2">
          {progressList.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-gray-500">
                  Due: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'No deadline'}
                </p>
              </div>
              <div>
                {p.completed ? (
                  <CheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <Clock className="text-yellow-500 w-5 h-5" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectManagement;