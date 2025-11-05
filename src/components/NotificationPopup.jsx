import React from "react";
import { Bell, CheckCircle, X, Clock, AlertCircle } from "lucide-react";

const NotificationPopup = ({ notifications, onClose, onMarkAsRead }) => {
  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    try {
      await onMarkAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationIcon = (notificationType) => {
    switch (notificationType) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'warning':
        return <Clock className="text-yellow-500" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <Bell className="text-blue-500" size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition p-1 rounded"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="mx-auto h-10 w-10 mb-3 text-gray-300" />
            <p className="text-sm">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={(e) => {
                if (!notification.is_read) {
                  handleMarkAsRead(notification.id, e);
                }
              }}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.notification_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm mb-1 ${
                    !notification.is_read ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </p>
                    {!notification.is_read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => window.location.href = '/rms/notifications'}
            className="w-full text-center text-sm text-primary hover:text-primary-dark transition-colors font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;