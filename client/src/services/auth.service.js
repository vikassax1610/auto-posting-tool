import api from './api.js';

export const loginUser = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = (name, email, password) => {
  return api.post('/auth/register', { name, email, password });
};

export const getMe = () => {
  return api.get('/auth/me');
};

export const logoutUser = () => {
  return api.post('/auth/logout');
};
