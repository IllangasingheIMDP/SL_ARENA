'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeRole, setActiveRole] = useState('all');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchRequests();
  }, [activeTab, activeRole]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/role-upgrade-requests`;
      
      if (activeTab !== 'all' && activeRole !== 'all') {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/role-upgrade-requests/status/${activeTab}/role/${activeRole}`;
      } else if (activeTab !== 'all') {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/role-upgrade-requests/status/${activeTab}`;
      } else if (activeRole !== 'all') {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/role-upgrade-requests/role/${activeRole}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setRequests(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/role-upgrade-requests/${requestId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Refresh requests after update
      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Role Upgrade Requests</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          
          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Status Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Role Filter */}
            <div className="flex items-center space-x-4">
              <label htmlFor="role-filter" className="text-sm font-medium text-gray-700">
                Filter by Role:
              </label>
              <select
                id="role-filter"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="player">Player</option>
                <option value="organisation">Organisation</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <li key={request.request_id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {request.name} ({request.email})
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Requested Role: {request.requested_role}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Requested At: {formatDate(request.requested_at)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(request.request_id, 'approved')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request.request_id, 'rejected')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
                {requests.length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                    No requests found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 