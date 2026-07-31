import api from './api.js';

export const getAccounts = () => {
  return api.get('/accounts');
};

export const connectAccount = (platform) => {
  return api.post(`/accounts/${platform}/connect`);
};

export const disconnectAccount = (platform) => {
  return api.post(`/accounts/${platform}/disconnect`);
};
