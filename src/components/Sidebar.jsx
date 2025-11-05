// components/Sidebar.jsx - Fixed with logout navigation
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Home, Users, Activity, Database, Shield, 
  Settings, LogOut, FileText, Bell, MessageSquare,
  Newspaper, BookOpen, Globe
} from "lucide-react";

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const menu = {
    staff: [
      { path: "/rms/staff", label: "Dashboard", icon: <Home size={18} /> },
      { path: "/rms/proposal-form", label: "Submit Proposal", icon: <FileText size={18} /> },
      { path: "/rms/staff/proposals", label: "My Proposals", icon: <FileText size={18} /> },
      { path: "/rms/project-management", label: "My Projects", icon: <Activity size={18} /> },
      { path: "/rms/notifications", label: "Notifications", icon: <Bell size={18} /> },
    ],
    head: [
      { path: "/rms/head", label: "Dashboard", icon: <Home size={18} /> },
      { path: "/rms/project-management", label: "All Projects", icon: <Activity size={18} /> },
      
      // Website Management Section - Only for Head
      { 
        path: "/rms/website/messages", 
        label: "User Messages", 
        icon: <MessageSquare size={18} />, 
        badge: "new" 
      },
      { 
        path: "/rms/website/news", 
        label: "Manage News", 
        icon: <Newspaper size={18} /> 
      },
      { 
        path: "/rms/website/staff", 
        label: "Manage Staff", 
        icon: <Users size={18} /> 
      },
      { 
        path: "/rms/website/publications", 
        label: "Publications", 
        icon: <BookOpen size={18} /> 
      },
      { 
        path: "/rms/website/content", 
        label: "Website Content", 
        icon: <Globe size={18} /> 
      },
      
      { path: "/rms/notifications", label: "Notifications", icon: <Bell size={18} /> },
    ],
   admin: [
    // Simple System Administration - Only essential features
    { path: "/rms/admin", label: "Admin Dashboard", icon: <Home size={18} /> },
    { path: "/rms/admin/users", label: "Manage Users", icon: <Users size={18} /> },
    { path: "/rms/admin/system-logs", label: "Activity Logs", icon: <Shield size={18} /> },
  ],
};

  const roleMenu = menu[user?.role] || [];

  const handleLogout = () => {
    logoutUser();
    navigate("/rms/login"); // ✅ Add navigation after logout
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-secondary to-primary text-white flex flex-col shadow-xl">
      
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
            <img 
              src="/image/ssgi-logo.png" 
              alt="SSGI Logo" 
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center w-full h-full">
              <span className="text-secondary font-bold text-sm">SSGI</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">Remote Sensing RMS</h1>
            <p className="text-white/70 text-xs capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {roleMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-white text-secondary shadow-lg" 
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={
                  `transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-secondary" : "text-white/80"
                  }`
                }>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    !
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 mb-4 p-3 bg-white/10 rounded-lg">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.username?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user?.username
              }
            </p>
            <p className="text-xs text-white/70 truncate capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout} // ✅ Use the new handleLogout function
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" /> 
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;