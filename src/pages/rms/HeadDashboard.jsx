// HeadDashboard.jsx - Clean RMS Only Version
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../services/api";
import { 
  CheckCircle, XCircle, Download, Users, TrendingUp, 
  FileText, Calendar, AlertCircle, RefreshCw, Clock, Eye
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeadDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchData = async () => {
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
      console.error("Failed to load data", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (proposalId) => {
    setActionLoading(proposalId);
    try {
      const response = await API.post(`/rms/proposals/${proposalId}/approve/`);
      toast.success("Proposal approved and project created!");
      await fetchData();
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error("Failed to approve proposal. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId) => {
    setActionLoading(proposalId);
    try {
      const notes = prompt("Please provide rejection notes:");
      if (notes === null) {
        setActionLoading(null);
        return;
      }
      
      await API.post(`/rms/proposals/${proposalId}/reject/`, { notes });
      toast.success("Proposal rejected!");
      await fetchData();
    } catch (err) {
      console.error("Rejection failed:", err);
      toast.error("Failed to reject proposal. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await API.get(fileUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'proposal.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download file");
      console.error("Download error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingProposals = proposals.filter(p => 
    p.status === "pending" || p.status === "under_review" || p.status === "revision_requested"
  );
  const activeProjects = projects.filter(p => p.status === 'active');
  const overdueProgress = progress.filter(p => !p.completed && p.is_overdue);

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="animate-fadeInUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-secondary">
            Head Dashboard
          </h1>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending_proposals || 0}</p>
              </div>
              <FileText className="text-yellow-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Proposals awaiting decision</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-800">{stats.active_projects || 0}</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.total_projects || 0} total projects</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Progress</p>
                <p className="text-2xl font-bold text-gray-800">{overdueProgress.length}</p>
              </div>
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Milestones needing attention</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-800">{stats.staff_count || 0}</p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Active staff members</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "pending"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Review ({pendingProposals.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "projects"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Projects ({activeProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "progress"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Progress Tracking ({overdueProgress.length} overdue)
          </button>
        </div>

        {/* Pending Proposals Tab */}
        {activeTab === "pending" && (
          <div>
            <h2 className="text-xl font-semibold text-secondary mb-4">
              Proposals Pending Review
            </h2>

            {pendingProposals.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No proposals pending review.</p>
                <p className="text-gray-400 text-sm mt-2">
                  All proposals have been reviewed or there are no new submissions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-secondary">
                        {proposal.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        proposal.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {proposal.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div><strong>Category:</strong> {proposal.category}</div>
                      <div><strong>Budget:</strong> ${proposal.budget || 'Not specified'}</div>
                      <div><strong>Duration:</strong> {proposal.duration_months || '12'} months</div>
                      <div><strong>Client:</strong> {proposal.is_client_request ? 'Yes' : 'No'}</div>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Submitted:</strong> {new Date(proposal.date_submitted).toLocaleDateString()} by {proposal.submitted_by_name || proposal.submitted_by_username}
                    </p>

                    <p className="text-sm mt-3 line-clamp-3 bg-gray-50 p-3 rounded">
                      {proposal.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {proposal.file && (
                        <button
                          onClick={() => downloadFile(proposal.file, `${proposal.title}.pdf`)}
                          className="flex items-center gap-1 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded transition"
                        >
                          <Download size={16} /> Download File
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (window.confirm(`Approve proposal "${proposal.title}"?`)) {
                            handleApprove(proposal.id);
                          }
                        }}
                        disabled={actionLoading === proposal.id}
                        className="flex items-center gap-1 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded disabled:opacity-50 transition"
                      >
                        {actionLoading === proposal.id ? (
                          <RefreshCw className="animate-spin" size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        {actionLoading === proposal.id ? "Approving..." : "Approve"}
                      </button>
                      
                      <button
                        onClick={() => handleReject(proposal.id)}
                        disabled={actionLoading === proposal.id}
                        className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded disabled:opacity-50 transition"
                      >
                        {actionLoading === proposal.id ? (
                          <RefreshCw className="animate-spin" size={16} />
                        ) : (
                          <XCircle size={16} />
                        )}
                        {actionLoading === proposal.id ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Projects Tab */}
        {activeTab === "projects" && (
          <div>
            <h2 className="text-xl font-semibold text-secondary mb-4">
              Active Projects
            </h2>

            {activeProjects.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No active projects.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Projects will appear here once proposals are approved.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeProjects.map((project) => {
                  const projectProgress = progress.filter(p => p.project === project.id);
                  const completedProgress = projectProgress.filter(p => p.completed).length;
                  const totalProgress = projectProgress.length;
                  const progressPercent = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;
                  
                  return (
                    <div
                      key={project.id}
                      className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-secondary">
                            {project.proposal_title}
                          </h3>
                          <p className="text-sm text-gray-600">Code: {project.project_code}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div><strong>Start:</strong> {new Date(project.start_date).toLocaleDateString()}</div>
                        <div><strong>End:</strong> {new Date(project.end_date).toLocaleDateString()}</div>
                        <div className="col-span-2">
                          <strong>Budget:</strong> ${parseFloat(project.budget_allocated).toLocaleString()}
                        </div>
                        <div className="col-span-2">
                          <strong>Assigned Staff:</strong> {project.assigned_staff_names?.join(', ') || 'Not assigned'}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Project Progress</span>
                          <span>{Math.round(progressPercent)}% ({completedProgress}/{totalProgress})</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Recent Progress Items */}
                      {projectProgress.length > 0 && (
                        <div className="border-t pt-3">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Milestones</h4>
                          <div className="space-y-2">
                            {projectProgress.slice(0, 3).map((item) => (
                              <div key={item.id} className={`p-2 rounded text-xs ${
                                item.completed ? 'bg-green-50 border border-green-200' :
                                item.is_overdue ? 'bg-red-50 border border-red-200' :
                                'bg-gray-50 border border-gray-200'
                              }`}>
                                <div className="flex justify-between">
                                  <span className="font-medium">{item.title}</span>
                                  {item.completed ? (
                                    <CheckCircle className="text-green-500" size={14} />
                                  ) : (
                                    <Clock className="text-yellow-500" size={14} />
                                  )}
                                </div>
                                <div className="text-gray-500 mt-1">
                                  Due: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline'}
                                  {item.is_overdue && !item.completed && (
                                    <span className="text-red-600 ml-2">(Overdue)</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Progress Tracking Tab */}
        {activeTab === "progress" && (
          <div>
            <h2 className="text-xl font-semibold text-secondary mb-4">
              Progress Tracking
            </h2>

            {overdueProgress.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No overdue progress items.</p>
                <p className="text-gray-400 text-sm mt-2">
                  All milestones are on track.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {overdueProgress.map((item) => (
                  <div key={item.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-red-800">{item.title}</h3>
                        <p className="text-sm text-red-700">{item.project_title} ({item.project_code})</p>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        Overdue
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-red-700 mb-3">
                      <div>
                        <strong>Assigned To:</strong> {item.project?.assigned_staff_names?.[0] || 'Not assigned'}
                      </div>
                      <div>
                        <strong>Due Date:</strong> {new Date(item.deadline).toLocaleDateString()}
                      </div>
                      <div className="col-span-2">
                        <strong>Days Overdue:</strong> {Math.abs(item.days_until_deadline)} days
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-red-600 mb-3">{item.description}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          toast.info(`Reminder sent for "${item.title}"`);
                        }}
                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Send Reminder
                      </button>
                      <button
                        onClick={() => {
                          window.location.href = `/rms/project-management`;
                        }}
                        className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Progress Items Table */}
            {progress.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-secondary mb-4">All Progress Items</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Milestone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {progress.slice(0, 10).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.project_title}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.completed ? 'bg-green-100 text-green-800' :
                              item.is_overdue ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.completed ? 'Completed' : item.is_overdue ? 'Overdue' : 'In Progress'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.project?.assigned_staff_names?.[0] || 'Not assigned'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HeadDashboard;