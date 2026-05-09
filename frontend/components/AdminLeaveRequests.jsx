import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('Pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchAllRequests();
  }, [filter]);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:5000/api/leave?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setRequests(response.data.data);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `http://localhost:5000/api/leave/${leaveId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('Leave request approved successfully');
        setSelectedRequest(null);
        fetchAllRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving request');
    }
  };

  const handleReject = async (leaveId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `http://localhost:5000/api/leave/${leaveId}/reject`,
        { rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('Leave request rejected successfully');
        setSelectedRequest(null);
        setRejectionReason('');
        fetchAllRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting request');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-600">Loading leave requests...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leave Requests Management</h2>
        <p className="text-gray-600">Total requests: {requests.length}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['Pending', 'Approved', 'Rejected', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No {filter.toLowerCase()} leave requests</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Employee</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Leave Type</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Dates</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Days</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr
                    key={request._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">
                          {request.employee.fullName}
                        </p>
                        <p className="text-gray-600 text-xs">{request.employee.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{request.leaveType}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <p>{formatDate(request.startDate)}</p>
                      <p className="text-xs text-gray-600">to {formatDate(request.endDate)}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {request.numberOfDays}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                      {request.reason}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {request.status === 'Pending' ? (
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Review Leave Request</h3>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Request Details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2">
              <p className="text-sm">
                <strong>Employee:</strong> {selectedRequest.employee.fullName}
              </p>
              <p className="text-sm">
                <strong>Leave Type:</strong> {selectedRequest.leaveType}
              </p>
              <p className="text-sm">
                <strong>Dates:</strong> {formatDate(selectedRequest.startDate)} to{' '}
                {formatDate(selectedRequest.endDate)}
              </p>
              <p className="text-sm">
                <strong>Days:</strong> {selectedRequest.numberOfDays}
              </p>
              <p className="text-sm">
                <strong>Reason:</strong> {selectedRequest.reason}
              </p>
            </div>

            {/* Rejection Reason Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Explain why the request is being rejected"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => handleReject(selectedRequest._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest._id)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
