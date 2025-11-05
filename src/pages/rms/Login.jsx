// Login.jsx - Fixed with proper navigation
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, User, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    const result = await loginUser(username, password);
    
    if (result.success) {
      // ✅ NAVIGATE BASED ON USER ROLE
      const userRole = result.user?.role || 'staff';
      console.log("🎯 Login successful, redirecting user with role:", userRole);
      
      switch(userRole) {
        case 'head':
          navigate("/rms/head");
          break;
        case 'admin':
          navigate("/rms/admin");
          break;
        case 'staff':
        default:
          navigate("/rms/staff");
          break;
      }
      
      toast.success(`Welcome back, ${result.user?.first_name || result.user?.username || 'User'}!`);
    } else {
      setError(result.error || "Login failed. Please check your credentials.");
      toast.error(result.error || "Login failed!");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-[#234e68] to-primary animate-fadeIn">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] md:w-[400px] animate-zoomIn">
        {/* SSGI Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-lg p-3">
            <img 
              src="/ssgi-logo.png" 
              alt="SSGI Logo" 
              className="h-12 w-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden text-white font-bold text-lg">SSGI</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-secondary mb-2">
          RMS Login
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Research Management System
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-500" size={18} />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-600">Username</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-5">
          &copy; {new Date().getFullYear()} SSGI Remote Sensing Department — RMS
        </p>
      </div>
    </div>
  );
};

export default Login;