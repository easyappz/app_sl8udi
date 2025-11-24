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
 * Get all messages from chat
 * @returns {Promise} Response with array of messages
 */
export const getMessages = async () => {
  try {
    const response = await instance.get('/api/messages/', {
      headers: getAuthHeaders(),
    });
    
    return response.data;
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};

/**
 * Send a new message to chat
 * @param {string} text - Message text (1-1000 characters)
 * @returns {Promise} Response with created message data
 */
export const createMessage = async (text) => {
  try {
    const response = await instance.post(
      '/api/messages/',
      { text },
      {
        headers: getAuthHeaders(),
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Create message error:', error);
    throw error;
  }
};
