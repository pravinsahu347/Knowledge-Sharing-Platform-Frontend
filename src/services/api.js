import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login:  (data) => API.post('/auth/login', data),
  getMe:  ()     => API.get('/auth/me'),
};

export const articleAPI = {
  getAll:       (params) => API.get('/articles', { params }),
  getById:      (id)     => API.get(`/articles/${id}`),
  create:       (data)   => API.post('/articles', data),
  update:       (id, data) => API.put(`/articles/${id}`, data),
  remove:       (id)     => API.delete(`/articles/${id}`),
  getMyArticles: ()      => API.get('/articles/user/my-articles'),
  aiAssist:     (data)   => API.post('/articles/ai/assist', data),
};

export default API;
