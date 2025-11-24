import instance from './axios';

/**
 * Register a new member
 * @param {string} username - Member username (3-50 characters)
 * @param {string} password - Member password (minimum 6 characters)
 * @returns {Promise} Response with token and member data
 */
export const register = async (username, password) => {
  try {
    const response = await instance.post('/api/register/', {
      username,
      password,
    });
    
    // Save token to localStorage if present
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login member
 * @param {string} username - Member username
 * @param {string} password - Member password
 * @returns {Promise} Response with token and member data
 */
export const login = async (username, password) => {
  try {
    const response = await instance.post('/api/login/', {
      username,
      password,
    });
    
    // Save token to localStorage if present
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout member (clear token from localStorage)
 */
export const logout = () => {
  localStorage.removeItem('authToken');
};

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
