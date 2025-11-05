import React, { useState, useEffect, useRef } from "react";
import { Bell, User, Settings, LogOut, ChevronDown, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import NotificationPopup from "./NotificationPopup";

const Header = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Only fetch notifications for non-admin users
    if (user?.role !== 'admin') {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/rms/notifications/");
      const userNotifications = res.data;
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowProfileDropdown(false);
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || 'US';
  };

  const getRoleDisplay = () => {
    const roleMap = {
      staff: 'Staff Member',
      head: 'Department Head',
      admin: 'System Administrator'
    };
    return roleMap[user?.role] || user?.role;
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case "staff":
        return "Staff Dashboard";
      case "head":
        return "Head Dashboard";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Research RMS";
    }
  };

  const handleLogout = () => {
    logoutUser();
    setShowProfileDropdown(false);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Try PATCH endpoint first
      await API.patch(`/rms/notifications/${notificationId}/`, { 
        is_read: true 
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read with PATCH, trying POST", err);
      
      // Try POST endpoint as fallback
      try {
        await API.post(`/rms/notifications/${notificationId}/mark_read/`);
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (postErr) {
        console.error("Failed to mark notification as read with POST", postErr);
      }
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-gray-200">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {getDashboardTitle()}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.first_name || user?.username}!
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon - Only show for non-admin users */}
        {user?.role !== 'admin' && (
          <div className="relative">
            <button
              className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationPopup
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkAsRead={markNotificationAsRead}
              />
            )}
          </div>
        )}

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 min-w-0"
          >
            {/* User Avatar with Initials */}
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {getUserInitials()}
            </div>
            
            {/* User Info */}
            <div className="text-left min-w-0 flex-1 hidden md:block">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username
                }
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {getRoleDisplay()}
              </p>
            </div>
            
            <ChevronDown 
              size={16} 
              className={`text-gray-500 transition-transform flex-shrink-0 ${
                showProfileDropdown ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              {/* User Info Section */}
              <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-lg">
                      {user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.username
                      }
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={14} className="text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                        user?.role === 'head' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {getRoleDisplay()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;