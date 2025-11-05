import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem('authTokens');
    if (authTokens) {
      try {
        const tokens = JSON.parse(authTokens);
        if (tokens && tokens.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }
      } catch (error) {
        console.error('❌ Error parsing auth tokens:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authTokens');
      window.location.href = '/rms/login';
    }
    return Promise.reject(error);
  }
);

// Website Management API endpoints
export const websiteApi = {
  // 📰 News Management
  news: {
    getAll: () => API.get('/news/management/'),  // Management endpoint
    getById: (id) => API.get(`/news/management/${id}/`),
    create: (data) => API.post('/news/management/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => API.put(`/news/management/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => API.delete(`/news/management/${id}/`),
  },

 // 👥 Staff Management
staff: {
  getAll: () => API.get('/staff/'),  // Public endpoint
  getById: (id) => API.get(`/staff/management/${id}/`),  // Management endpoint
  create: (data) => API.post('/staff/management/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => API.put(`/staff/management/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/staff/management/${id}/`),
},

 // 📚 Publications Management
publications: {
  getAll: () => API.get('/publications/publication/'),  // Public endpoint
  getById: (id) => API.get(`/publications/management/${id}/`),  // Management endpoint
  create: (data) => API.post('/publications/management/', data),
  update: (id, data) => API.put(`/publications/management/${id}/`, data),
  delete: (id) => API.delete(`/publications/management/${id}/`),
},

  // 💌 Contact Messages Management
  messages: {
    getAll: () => API.get('/contact/messages/'),
    getById: (id) => API.get(`/contact/messages/${id}/`),
    delete: (id) => API.delete(`/contact/messages/${id}/`),
    markAsRead: (id) => API.post(`/contact/messages/${id}/mark_read/`),
  },

  // 🌐 Website Content Management
  content: {
    getAbout: () => API.get('/about/management/content/'),
    updateAbout: (data) => API.put('/about/management/content/', data),

    getHomeContent: () => API.get('/home/management/content/'),
    updateHomeContent: (data) => API.put('/home/management/content/', data),

    // 🖼️ Home Page Images
    getHomeImages: () => API.get('/home/management/images/'),
    uploadHomeImage: (formData) => API.post('/home/management/images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deleteHomeImage: (id) => API.delete(`/home/management/images/${id}/`),

    // 📊 Home Statistics
    getStats: () => API.get('/home/management/stats/'),
    createStat: (data) => API.post('/home/management/stats/', data),
    updateStat: (id, data) => API.put(`/home/management/stats/${id}/`, data),
    deleteStat: (id) => API.delete(`/home/management/stats/${id}/`),
  },
};

export default API;
