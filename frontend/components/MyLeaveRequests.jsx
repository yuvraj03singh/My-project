import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        'http://localhost:5000/api/leave/my-requests',
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Approved':
        return '✅';
      case 'Rejected':
        return '❌';
      case 'Cancelled':
        return '🚫';
      default:
        return '📋';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCancel = async (leaveId, currentStatus) => {
    if (currentStatus !== 'Pending' && currentStatus !== 'Approved') {
      alert('Only pending or approved requests can be cancelled');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `http://localhost:5000/api/leave/${leaveId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        fetchMyRequests();
        alert('Leave request cancelled successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling request');
    }
  };

  const filteredRequests = filter === 'All' 
    ? requests 
    : requests.filter(req => req.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-600">Loading your leave requests...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Leave Requests</h2>
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
        {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(status => (
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

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No leave requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <div
              key={request._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Status Badge and Title */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getStatusIcon(request.status)}</span>
                    <h3 className="font-bold text-gray-800">{request.leaveType}</h3>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              {/* Date Range */}
              <div className="mb-3 text-sm text-gray-600">
                <p>
                  📅 <strong>{formatDate(request.startDate)}</strong> to{' '}
                  <strong>{formatDate(request.endDate)}</strong>
                </p>
                <p>⏱️ <strong>{request.numberOfDays}</strong> working day{request.numberOfDays !== 1 ? 's' : ''}</p>
              </div>

              {/* Reason */}
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  <strong>Reason:</strong> {request.reason}
                </p>
              </div>

              {/* Rejection Reason (if rejected) */}
              {request.status === 'Rejected' && request.rejectionReason && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    <strong>Rejection Reason:</strong> {request.rejectionReason}
                  </p>
                </div>
              )}

              {/* Approved/Rejected By */}
              {request.approvedBy && (
                <div className="mb-3 text-sm text-gray-600">
                  <p>
                    {request.status === 'Approved' ? '✅' : '❌'} Handled by:{' '}
                    <strong>{request.approvedBy.name || 'Admin'}</strong>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {(request.status === 'Pending' || request.status === 'Approved') && (
                  <button
                    onClick={() => handleCancel(request._id, request.status)}
                    className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Cancel Request
                  </button>
                )}
                {request.status === 'Rejected' && (
                  <button
                    onClick={() => window.location.href = '/new-request'}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Apply Again
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLeaveRequests;
