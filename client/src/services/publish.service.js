import api from './api.js';

/**
 * Publish media to selected platforms.
 *
 * @param {FormData} formData - Must contain: media (file), caption (string), platforms (JSON string array)
 * @returns {Promise}
 */
export const publishPost = (formData) => {
  return api.post('/publish', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getPublishHistory = () => {
  return api.get('/publish/history');
};
