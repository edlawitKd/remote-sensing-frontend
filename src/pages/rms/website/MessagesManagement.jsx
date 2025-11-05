import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { websiteApi } from "../../../services/api";
import { Mail, User, Calendar, Trash2, Eye, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await websiteApi.messages.getAll();
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await websiteApi.messages.delete(id);
        toast.success("Message deleted successfully");
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
          setShowMessageDetail(false);
        }
        fetchMessages();
      } catch (error) {
        console.error("Failed to delete message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading messages...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-secondary">Messages</h1>
            <div className="text-sm text-gray-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-secondary">User Messages Management</h1>
          <div className="text-sm text-gray-500">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Mobile Back Button */}
          {showMessageDetail && (
            <div className="lg:hidden border-b border-gray-200">
              <button
                onClick={() => setShowMessageDetail(false)}
                className="flex items-center gap-2 px-4 py-3 text-primary hover:text-secondary transition"
              >
                <ChevronLeft size={20} />
                <span>Back to Messages</span>
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
            {/* Messages List - Always visible on desktop, conditionally on mobile */}
            <div className={`lg:w-1/3 xl:w-1/4 border-r border-gray-200 ${
              showMessageDetail ? 'hidden lg:block' : 'block'
            }`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-secondary">Inbox</h3>
              </div>
              <div className="h-full overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>No messages found</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleSelectMessage(message)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                        selectedMessage?.id === message.id 
                          ? 'bg-primary/10 border-l-4 border-primary' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2">
                          {message.subject}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition flex-shrink-0 ml-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <User size={12} />
                        <span className="truncate">{message.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar size={12} />
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                      
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Message Detail */}
            <div className={`flex-1 ${
              showMessageDetail ? 'block' : 'hidden lg:block'
            }`}>
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  {/* Message Header */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 break-words">
                          {selectedMessage.subject}
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-400 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-700">From:</span>
                                <span className="ml-2 text-gray-900">{selectedMessage.name}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-gray-400 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-700">Email:</span>
                                <a 
                                  href={`mailto:${selectedMessage.email}`}
                                  className="ml-2 text-primary hover:text-secondary transition break-all"
                                >
                                  {selectedMessage.email}
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-700">Date:</span>
                                <span className="ml-2 text-gray-900">{formatDate(selectedMessage.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 sm:flex-col">
                        <button
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl">
                      <h3 className="font-semibold text-gray-700 mb-4 text-lg">Message Content</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <Mail className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      Select a Message
                    </h3>
                    <p className="text-gray-400 max-w-sm">
                      {messages.length > 0 
                        ? "Choose a message from the list to view its details" 
                        : "No messages available. User messages from the contact form will appear here."
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State - Only show when no messages at all */}
        {messages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow mt-6">
            <Mail className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Messages Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              User messages from the contact form will appear here once they start submitting inquiries.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MessagesManagement;