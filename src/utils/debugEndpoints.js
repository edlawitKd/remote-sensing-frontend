// utils/debugEndpoints.js
import API from "../services/api";

export const debugEndpoints = async () => {
  console.log('🔍 Debugging API Endpoints...');
  
  const endpoints = [
    '/rms/proposals/',
    '/rms/projects/',
    '/rms/progress/',
    '/rms/notifications/',
    '/rms/users/',
    '/auth/change-password/',
    '/rms/auth/change-password/',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await API.get(endpoint);
      console.log(`✅ ${endpoint} - Status: ${response.status}, Data:`, response.data);
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint} - Status: ${error.response.status}, Message: ${error.response.data?.detail || error.response.statusText}`);
      } else {
        console.log(`❌ ${endpoint} - Error: ${error.message}`);
      }
    }
  }
};

// Run this in your browser console to see which endpoints work
// debugEndpoints();