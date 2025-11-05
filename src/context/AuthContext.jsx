import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

// Create Context
const AuthContext = createContext();

// Auth Provider Component - Fixed for Fast Refresh
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedTokens = localStorage.getItem("authTokens");
      
      if (storedTokens) {
        try {
          const tokens = JSON.parse(storedTokens);
          setAuthTokens(tokens);
          
          // Decode token to get user info
          const decodedUser = jwtDecode(tokens.access);
          console.log("🔐 Decoded token:", decodedUser);
          
          // Fetch complete user data from backend including role
          const userData = await fetchUserData(decodedUser.user_id || decodedUser.userId, tokens.access);
          setUser(userData);
        } catch (error) {
          console.error("Error initializing auth:", error);
          localStorage.removeItem("authTokens");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Fetch complete user data including role from backend
  const fetchUserData = async (userId, accessToken) => {
    try {
      console.log("📡 Fetching user data for ID:", userId);
      
      // Try to get user data from the users endpoint
      const response = await API.get(`/rms/users/${userId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log("✅ User data from backend:", response.data);
      return response.data;
      
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      
      // If that fails, try the profile endpoint
      try {
        const profileResponse = await API.get('/rms/auth/profile/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        console.log("✅ User profile data:", profileResponse.data);
        return profileResponse.data;
        
      } catch (profileError) {
        console.error("❌ Error fetching profile:", profileError);
        
        // Last resort: use token data with default role
        const decoded = jwtDecode(accessToken);
        return {
          id: decoded.user_id || decoded.userId,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role || 'staff', // Use role from token if available
          first_name: decoded.first_name || '',
          last_name: decoded.last_name || ''
        };
      }
    }
  };

  // 🔑 Login function
  const loginUser = async (username, password) => {
    try {
      console.log("🔐 Attempting login for user:", username);
      
      // Clear any existing tokens
      localStorage.removeItem("authTokens");
      
      const response = await API.post("/api/token/", { username, password });
      console.log("✅ Token response:", response.data);

      if (response.status === 200) {
        const tokens = response.data;
        
        // Store tokens
        localStorage.setItem("authTokens", JSON.stringify(tokens));
        setAuthTokens(tokens);
        
        // Decode the token to get basic user info
        const decodedToken = jwtDecode(tokens.access);
        console.log("🔐 Decoded token data:", decodedToken);
        
        // Fetch complete user data including role from backend
        const userData = await fetchUserData(decodedToken.user_id || decodedToken.userId, tokens.access);
        console.log("👤 Complete user data:", userData);
        
        setUser(userData);

        return { success: true, user: userData };
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (err.response) {
        console.error("Response error:", err.response);
        
        if (err.response.status === 401) {
          errorMessage = "Invalid username or password.";
        } else if (err.response.status === 400) {
          errorMessage = "Invalid request. Please check your input.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        // Log detailed error info
        console.error("Error details:", err.response.data);
      } else if (err.request) {
        console.error("Network error:", err.request);
        errorMessage = "Network error. Please check your connection.";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // 🚪 Logout
  const logoutUser = () => {
    console.log("🚪 Logging out user");
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook - Fixed for Fast Refresh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Default export for better HMR compatibility
export default AuthProvider;