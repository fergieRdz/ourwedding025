import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      const method = err.config?.method?.toUpperCase();
      if (method === 'GET') return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Cannot connect to server. Make sure the backend is running.'));
    }
    return Promise.reject(err);
  }
);

export default api;
