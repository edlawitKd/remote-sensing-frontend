import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../services/api";
import { Bell, CheckCircle, Trash2, RefreshCw } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/rms/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      // Try PATCH first
      await API.patch(`/rms/notifications/${id}/`, { is_read: true });
      
      // Update local state
      setNotifications(prev => 
        prev.map(item => item.id === id ? { ...item, is_read: true } : item)
      );
    } catch (err) {
      console.error("PATCH failed, trying POST:", err);
      
      // Try POST as fallback
      try {
        await API.post(`/rms/notifications/${id}/mark_read/`);
        
        // Update local state
        setNotifications(prev => 
          prev.map(item => item.id === id ? { ...item, is_read: true } : item)
        );
      } catch (postErr) {
        console.error("POST also failed:", postErr);
        alert("Failed to mark notification as read");
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      // Get all unread notifications
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      // Mark each as read
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/rms/notifications/${id}/`);
      setNotifications(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-secondary">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up!'
              }
            </p>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Mark All as Read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition ${
                    !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`text-sm mb-2 ${
                        !notification.is_read ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-green-600 hover:text-green-800 transition-colors p-1 rounded"
                          title="Mark as read"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                        title="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-gray-500 text-sm">
          Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;