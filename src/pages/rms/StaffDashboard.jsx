import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { 
  PlusCircle, FileText, CheckCircle, XCircle, Clock, 
  RefreshCw, AlertCircle, Calendar, TrendingUp, Users,
  Search, Eye, Download
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import ProgressModal from "./ProgressModal";

const StaffDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [proposalsRes, projectsRes, progressRes, statsRes] = await Promise.all([
        API.get("/rms/proposals/"),
        API.get("/rms/projects/"),
        API.get("/rms/progress/"),
        API.get("/rms/dashboard-stats/")
      ]);
      
      setProposals(proposalsRes.data);
      setProjects(projectsRes.data);
      setProgress(progressRes.data);
      setStats(statsRes.data);
      
    } catch (err) {
      console.error("❌ Error loading dashboard data:", err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Get proposals by status for the overview cards - FIXED VERSION
  const myProposals = proposals.filter(p => {
    // Use the actual field names from your backend
    return (
      p.submitted_by_id === user?.id ||
      p.submitted_by_username === user?.username ||
      p.submitted_by === user?.id
    );
  });

  const pendingProposals = myProposals.filter(p => 
    p.status === "pending" || 
    p.status === "under_review" || 
    p.status === "revision_requested"
  );

  const approvedProposals = myProposals.filter(p => p.status === "approved");
  const rejectedProposals = myProposals.filter(p => p.status === "rejected");

  // Filter proposals based on search and status
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter projects to show only user's projects
  const myProjects = projects.filter(project => 
    project.assigned_staff_names?.includes(user?.username) ||
    project.assigned_staff_names?.includes(user?.first_name) ||
    project.assigned_staff?.includes(user?.id)
  );

  const handleAddProgress = (project) => {
    setSelectedProject(project);
    setShowProgressModal(true);
  };

  const handleProgressSaved = () => {
    toast.success("Progress milestone added!");
    setShowProgressModal(false);
    fetchData();
  };

  const markProgressComplete = async (progressId) => {
    try {
      await API.post(`/rms/progress/${progressId}/mark_complete/`);
      toast.success("Progress marked as completed!");
      fetchData();
    } catch (err) {
      toast.error("Failed to mark progress as complete");
      console.error(err);
    }
  };

  const downloadProposalFile = async (fileUrl, fileName) => {
    try {
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API.defaults.baseURL}${fileUrl}`;
      
      const link = document.createElement('a');
      link.href = fullUrl;
      link.setAttribute('download', fileName || 'proposal.pdf');
      link.setAttribute('target', '_blank');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("File download started");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download file. Please try again.");
    }
  };

  const viewProposalFile = (fileUrl) => {
    try {
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API.defaults.baseURL}${fileUrl}`;
      window.open(fullUrl, '_blank');
    } catch (err) {
      console.error("View file error:", err);
      toast.error("Failed to open file.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-600" size={18} />;
      case "rejected":
        return <XCircle className="text-red-500" size={18} />;
      case "pending":
      case "under_review":
        return <Clock className="text-yellow-500" size={18} />;
      default:
        return <FileText className="text-gray-500" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "revision_requested":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="animate-fadeInUp">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* My Proposals Card */}
          <div 
            onClick={() => setStatusFilter("all")}
            className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Proposals</p>
                <p className="text-2xl font-bold text-gray-800">{stats.my_proposals || myProposals.length}</p>
              </div>
              <FileText className="text-blue-500" size={24} />
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {stats.approved_my_proposals || approvedProposals.length} approved
              </span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {stats.pending_my_proposals || pendingProposals.length} pending
              </span>
            </div>
          </div>

          {/* Approved Proposals Card */}
          <div 
            onClick={() => setStatusFilter("approved")}
            className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-800">{stats.approved_my_proposals || approvedProposals.length}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">My approved proposals</p>
          </div>

          {/* Pending Review Card */}
          <div 
            onClick={() => setStatusFilter("pending")}
            className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending_my_proposals || pendingProposals.length}</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting review decision</p>
          </div>

          {/* My Projects Card */}
          <div 
            onClick={() => navigate('/rms/project-management')}
            className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Projects</p>
                <p className="text-2xl font-bold text-gray-800">{stats.my_projects || myProjects.length}</p>
              </div>
              <TrendingUp className="text-purple-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.active_my_projects || myProjects.filter(p => p.status === 'active').length} active
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/rms/proposal-form"
            className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-secondary transition"
          >
            <PlusCircle size={18} /> New Proposal
          </Link>
          <Link
            to="/rms/project-management"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <TrendingUp size={18} /> Manage Projects
          </Link>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition"
          >
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search proposals by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="revision_requested">Revision Requested</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recent Progress - Urgent Items */}
        {progress.filter(p => !p.completed && (p.is_overdue || p.days_until_deadline <= 3)).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              Urgent Progress Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progress
                .filter(p => !p.completed && (p.is_overdue || p.days_until_deadline <= 3))
                .slice(0, 4)
                .map((item) => (
                  <div key={item.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-red-800">{item.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.is_overdue ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.is_overdue ? 'Overdue' : 'Due Soon'}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">{item.project_title}</p>
                    <p className="text-xs text-red-600">
                      Due: {new Date(item.deadline).toLocaleDateString()}
                      {item.days_until_deadline && (
                        <span> ({Math.abs(item.days_until_deadline)} days {item.days_until_deadline < 0 ? 'ago' : 'left'})</span>
                      )}
                    </p>
                    <button
                      onClick={() => markProgressComplete(item.id)}
                      className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Mark Complete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Proposals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-secondary">
              My Proposals {statusFilter !== "all" && `(${statusFilter})`}
            </h2>
            <span className="text-sm text-gray-500">
              Showing {filteredProposals.filter(p => 
                p.submitted_by_id === user?.id ||
                p.submitted_by_username === user?.username
              ).length} of {myProposals.length} proposals
            </span>
          </div>

          {filteredProposals.filter(p => 
            p.submitted_by_id === user?.id ||
            p.submitted_by_username === user?.username
          ).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || statusFilter !== "all" 
                  ? "No proposals match your search criteria." 
                  : "No proposals submitted yet."
                }
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter." 
                  : "Create your first proposal to get started."
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  to="/rms/proposal-form"
                  className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
                >
                  Create First Proposal
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals
                .filter(p => 
                  p.submitted_by_id === user?.id ||
                  p.submitted_by_username === user?.username
                )
                .map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-white rounded-xl shadow p-5 border-l-4 border-primary hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    // You can navigate to a detailed proposal view
                    // navigate(`/rms/proposals/${proposal.id}`);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-secondary line-clamp-2">
                      {proposal.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                      {proposal.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="capitalize font-medium">{proposal.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span>{new Date(proposal.date_submitted).toLocaleDateString()}</span>
                    </div>
                    {proposal.budget && (
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">${parseFloat(proposal.budget).toLocaleString()}</span>
                      </div>
                    )}
                    {proposal.duration_months && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{proposal.duration_months} months</span>
                      </div>
                    )}
                    {/* Show submitter info */}
                    <div className="flex justify-between">
                      <span>Submitted by:</span>
                      <span className="font-medium">{proposal.submitted_by_name || proposal.submitted_by_username}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {proposal.abstract}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(proposal.status)}
                      <span className="text-sm text-gray-500 capitalize">
                        {proposal.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {proposal.file && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewProposalFile(proposal.file);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition"
                            title="View proposal file"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadProposalFile(proposal.file, `${proposal.title}.pdf`);
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 transition"
                            title="Download proposal file"
                          >
                            <Download size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-secondary">
              My Projects
            </h2>
            <span className="text-sm text-gray-500">
              {myProjects.length} total projects
            </span>
          </div>

          {myProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No assigned projects yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Projects will appear here once your proposals are approved.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProjects.map((project) => {
                const projectProgress = progress.filter(p => p.project === project.id);
                const completedProgress = projectProgress.filter(p => p.completed).length;
                const totalProgress = projectProgress.length;
                const progressPercent = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;
                
                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-secondary">
                          {project.proposal_title}
                        </h3>
                        <p className="text-sm text-gray-600">Code: {project.project_code}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Overall Progress</span>
                        <span>{Math.round(progressPercent)}% ({completedProgress}/{totalProgress})</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <div>
                        <strong>Start:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                      </div>
                      <div>
                        <strong>End:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
                      </div>
                      {project.budget_allocated && (
                        <div className="col-span-2">
                          <strong>Budget:</strong> ${parseFloat(project.budget_allocated).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Recent Progress Items */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-gray-700">Recent Milestones</h4>
                        <button
                          onClick={() => handleAddProgress(project)}
                          className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition"
                        >
                          Add Progress
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {projectProgress.slice(0, 3).map((item) => (
                          <div key={item.id} className={`p-2 rounded text-xs ${
                            item.completed ? 'bg-green-50 border border-green-200' :
                            item.is_overdue ? 'bg-red-50 border border-red-200' :
                            'bg-gray-50 border border-gray-200'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.title}</span>
                              {!item.completed && (
                                <button
                                  onClick={() => markProgressComplete(item.id)}
                                  className="text-green-600 hover:text-green-800 text-xs"
                                >
                                  Mark Done
                                </button>
                              )}
                            </div>
                            <div className="flex justify-between text-gray-500 mt-1">
                              <span>Due: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline'}</span>
                              {item.completed ? (
                                <CheckCircle className="text-green-500" size={14} />
                              ) : (
                                <Clock className="text-yellow-500" size={14} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {projectProgress.length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          No progress milestones yet. Add your first milestone to track progress.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <ProgressModal
          project={selectedProject}
          onClose={() => setShowProgressModal(false)}
          onSaved={handleProgressSaved}
        />
      )}
    </DashboardLayout>
  );
};

export default StaffDashboard;