import instance from './axios';
import { getAuthToken } from './auth';

/**
 * Get authorization headers with token
 * @returns {Object} Headers object with Authorization
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get current member profile
 * @returns {Promise} Response with member profile data
 */
export const getProfile = async () => {
  try {
    const response = await instance.get('/api/profile/', {
      headers: getAuthHeaders(),
    });
    
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};
