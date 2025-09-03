import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  me: () => api.get('/users/me'),
};

export const coursesApi = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  completeChapter: (courseId, chapterId) =>
    api.post(`/courses/${courseId}/chapters/${chapterId}/complete`),
};

export const mentorsApi = {
  getSessions: () => api.get('/mentors/sessions'),
  bookSession: (id) => api.post(`/mentors/sessions/${id}/book`),
};
