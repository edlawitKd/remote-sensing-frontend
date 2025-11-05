// App.jsx - Updated with Admin Routes
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ServiceAndPublication from "./pages/ServiceAndPublication";
import Staff from "./pages/Staff";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/rms/Login";
import StaffDashboard from "./pages/rms/StaffDashboard";
import HeadDashboard from "./pages/rms/HeadDashboard";
import SystemDashboard from "./pages/rms/admin/SystemDashboard";
import NotificationsPage from "./pages/rms/Notifications";
import UserManagement from "./pages/rms/UserManagement";
import ProposalForm from "./pages/rms/ProposalForm";
import ProjectManagement from "./pages/rms/ProjectManagement";
import Profile from "./pages/rms/Profile";
import ChangePassword from "./pages/rms/ChangePassword";

// Admin Pages
import SystemLogs from "./pages/rms/admin/SystemLogs";
import DatabaseManagement from "./pages/rms/admin/DatabaseManagement";
import BackupRecovery from "./pages/rms/admin/BackupRecovery";

// Website Management Pages
import MessagesManagement from "./pages/rms/website/MessagesManagement";
import NewsManagement from "./pages/rms/website/NewsManagement";
import StaffManagement from "./pages/rms/website/StaffManagement";
import PublicationsManagement from "./pages/rms/website/PublicationsManagement";
import WebsiteContentManagement from "./pages/rms/website/WebsiteContentManagement";

export default function App() {
  const location = useLocation();
  const isRMSRoute = location.pathname.startsWith("/rms");

  return (
    <>
      {!isRMSRoute && <Navbar />}

      <Routes>
        {/* Public Site */}
        <Route path="/" element={<Home />} />
        <Route path="/ServiceAndPublication" element={<ServiceAndPublication />} />
        <Route path="/Staff" element={<Staff />} />
        <Route path="/ContactUs" element={<ContactUs />} />

        {/* RMS Section */}
        <Route path="/rms/login" element={<Login />} />
        
        {/* Dashboard Routes */}
        <Route path="/rms/staff" element={<StaffDashboard />} />
        <Route path="/rms/head" element={<HeadDashboard />} />
        <Route path="/rms/admin" element={<SystemDashboard />} />
        
        {/* Admin System Routes */}
        <Route path="/rms/admin/users" element={<UserManagement />} />
        <Route path="/rms/admin/system-logs" element={<SystemLogs />} />
        <Route path="/rms/admin/database" element={<DatabaseManagement />} />
        <Route path="/rms/admin/backups" element={<BackupRecovery />} />
        
        {/* Feature Routes */}
        <Route path="/rms/notifications" element={<NotificationsPage />} />
        <Route path="/rms/proposal-form" element={<ProposalForm />} />
        <Route path="/rms/project-management" element={<ProjectManagement />} />
        
        {/* Profile Routes */}
        <Route path="/rms/profile" element={<Profile />} />
        <Route path="/rms/change-password" element={<ChangePassword />} />
        
        {/* Website Management Routes */}
        <Route path="/rms/website/messages" element={<MessagesManagement />} />
        <Route path="/rms/website/news" element={<NewsManagement />} />
        <Route path="/rms/website/staff" element={<StaffManagement />} />
        <Route path="/rms/website/publications" element={<PublicationsManagement />} />
        <Route path="/rms/website/content" element={<WebsiteContentManagement />} />
      
        {/* Catch-all route for RMS - Keep this last */}
        <Route path="/rms/*" element={<StaffDashboard />} />
      </Routes>

      {!isRMSRoute && <Footer />}
    </>
  );
}