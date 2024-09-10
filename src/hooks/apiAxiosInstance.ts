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

apiAxiosInstance.interceptors.response.use(
  response => {
    if (typeof window !== 'undefined') {
      console.log('응답:', response);
      const accessToken = response.headers['accessToken'];
      if (accessToken) {
        localStorage.setItem('custom-auth-token', accessToken);
      }
    }
    return response;
  },
  error => Promise.reject(error)
);

export default apiAxiosInstance;