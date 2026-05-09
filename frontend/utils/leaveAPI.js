import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/leave';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

const leaveAPI = {
  // Create a new leave request
  createLeaveRequest: async (leaveData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}`,
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get employee's own leave requests
  getMyLeaveRequests: async (status = null) => {
    try {
      let url = `${API_BASE_URL}/my-requests`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all leave requests (Admin only)
  getAllLeaveRequests: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get specific leave request by ID
  getLeaveRequestById: async (leaveId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${leaveId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve leave request (Admin only)
  approveLeaveRequest: async (leaveId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${leaveId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject leave request (Admin only)
  rejectLeaveRequest: async (leaveId, rejectionReason) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${leaveId}/reject`,
        { rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel leave request (Employee only)
  cancelLeaveRequest: async (leaveId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${leaveId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default leaveAPI;
