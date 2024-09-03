import axios from 'axios';

const apiAxiosInstance = axios.create({
  baseURL: '/api', // API 서버의 기본 URL
});

apiAxiosInstance.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiAxiosInstance;