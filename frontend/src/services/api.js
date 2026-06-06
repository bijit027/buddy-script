import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 if the request was NOT for the login endpoint
    if (error.response?.status === 401 && !error.config.url.includes('/login')) {
      localStorage.removeItem('bs_token');
      localStorage.removeItem('bs_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  register: (firstName, lastName, email, password, passwordConfirmation) =>
    api.post('/register', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),

  login: (email, password) => api.post('/login', { email, password }),

  logout: () => api.post('/logout'),

  getMe: () => api.get('/me'),
};

// ─── Post Service ─────────────────────────────────────────────────────────────
export const postService = {
  getFeed: (page = 1) => api.get(`/posts?page=${page}`),

  createPost: (formData) =>
    api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  likePost: (id) => api.post(`/posts/${id}/like`),

  getPostLikes: (id) => api.get(`/posts/${id}/likes`),

  updatePost: (id, data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return api.post(`/posts/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/posts/${id}`, data);
  },

  deletePost: (id) => api.delete(`/posts/${id}`),

  getComments: (id) => api.get(`/posts/${id}/comments`),

  addComment: (id, content) => api.post(`/posts/${id}/comments`, { content }),

  likeComment: (id) => api.post(`/comments/${id}/like`),

  replyToComment: (id, content) => api.post(`/comments/${id}/reply`, { content }),

  getCommentLikes: (id) => api.get(`/comments/${id}/likes`),
};

// ─── Profile Service ──────────────────────────────────────────────────────────
export const profileService = {
  update: (formData) =>
    api.put('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
