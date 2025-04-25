'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import roleRequests from '@/data/data';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeRole, setActiveRole] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
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
      
      const mergedRequests = data.data.map(request => {
        const detailedRequest = roleRequests.find(r => r.request_id === request.request_id);
        return {...request, ...detailedRequest};
      });
      
      setRequests(mergedRequests);
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

      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleReview = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRequest(null);
  };

  const renderReviewModal = () => {
    if (!selectedRequest) return null;

    const renderDocuments = () => {
      if (!selectedRequest.documents) return null;
      return (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-[#000080] mb-3">Supporting Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(selectedRequest.documents).map(([key, value]) => (
              <div key={key} className="flex items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2 bg-[#000080] rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#000080] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                <a 
                  href={value} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-[#000080] hover:bg-[#0000B3] transition-colors"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderRoleSpecificDetails = () => {
      switch (selectedRequest.requested_role) {
        case 'organisation':
          return (
            <div className="mt-6 bg-[#000080] p-4 rounded-lg border border-[#000080]">
              <h3 className="text-lg font-semibold text-[#FFD700] mb-3">Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Organization Name</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.organizationName}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Organization Type</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.organizationType}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Establishment Year</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.establishmentYear}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Contact Person</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.primaryContactName}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Contact Position</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.primaryContactPosition}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Contact Number</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.primaryContactNumber}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Tournament Types</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.typesOfTournaments}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Age Groups</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.ageGroups}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Formats</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.formats}</p>
                </div>
              </div>
            </div>
          );
        case 'player':
          return (
            <div className="mt-6 bg-[#000080] p-4 rounded-lg border border-[#000080]">
              <h3 className="text-lg font-semibold text-white mb-3">Player Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Player Role</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.playerRole}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Batting Style</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.battingStyle}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Bowling Style</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.bowlingStyle}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Experience</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.playingExperience}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Highest Level</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.highestLevelPlayed}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Jersey Number</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.jerseyNumber}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Preferred Format</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.preferredFormat}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Previous Teams</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.previousTeams}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Achievements</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.notableAchievements}</p>
                </div>
              </div>
            </div>
          );
        case 'trainer':
          return (
            <div className="mt-6 bg-[#000080] p-4 rounded-lg border border-[#000080]">
              <h3 className="text-lg font-semibold text-white mb-3">Trainer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Specialization</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.specializationAreas?.join(', ')}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Coaching Experience</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.coachingExperience}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Qualifications</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.coachingQualifications}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Highest Level Coached</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.highestLevelCoached}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Player Experience</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.playerExperience}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Hourly Rate</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.hourlyRates}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Availability</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.availability}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Notable Students</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.notableStudents}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <span className="text-xs font-medium text-[#000080] block">Age Groups</span>
                  <p className="text-sm font-medium text-[#000080] mt-1">{selectedRequest.ageGroupsSpecialized}</p>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-opacity-75  backdrop-blur-sm bg-transparent" onClick={closeReviewModal}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#000080] px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2 rounded-full bg-[#FFD700] p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#000080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  Review {selectedRequest.requested_role.charAt(0).toUpperCase() + selectedRequest.requested_role.slice(1)} Request
                </h2>
                <button
                  onClick={closeReviewModal}
                  className="bg-[#000080] hover:bg-[#0000B3] rounded-full p-1 transition-colors"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-white px-6 py-5 max-h-[70vh] overflow-y-auto">
              <div className="bg-[#000080] p-4 rounded-lg border border-[#000080] mb-6">
                <div className="flex items-center mb-4">
                  <h3 className="h-16 px-2 w-fit rounded-full bg-[#000080] flex items-center justify-center text-[#FFD700] text-2xl font-bold">
                    {selectedRequest?.name}
                  </h3>
                  <div className="ml-4">
                    
                    <p className="text-[#FFD700] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedRequest.email}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`inline-flex items-center px-3 py-2 text-center rounded-full text-sm font-medium ${
                        selectedRequest.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : selectedRequest.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#000080] mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs text-[#FFD700]">Role Requested</span>
                      <p className="text-sm font-medium text-[#FFD700] capitalize">{selectedRequest.requested_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#000080] mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs text-[#FFD700]">Requested At</span>
                      <p className="text-sm font-medium text-[#FFD700]">{formatDate(selectedRequest.requested_at)}</p>
                    </div>
                  </div>
                  {selectedRequest.reviewed_at && (
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-[#000080] mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs text-[#FFD700]">Reviewed At</span>
                        <p className="text-sm font-medium text-[#FFD700]">{formatDate(selectedRequest.reviewed_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {renderRoleSpecificDetails()}
              {renderDocuments()}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between border-t border-gray-200">
              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.request_id, 'approved');
                      closeReviewModal();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000080]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.request_id, 'rejected');
                      closeReviewModal();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000080]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Request
                  </button>
                </div>
              )}
              <button
                onClick={closeReviewModal}
                className="inline-flex items-center px-4 py-2 border border-[#000080] rounded-md shadow-sm text-sm font-medium text-[#000080] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000080]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#000080] to-[#000080] shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Role Upgrade Requests
            </h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#000080] bg-[#FFD700] hover:bg-[#FFE44D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-[#000080] p-3">
                    <svg className="h-6 w-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[#000080] truncate">Total Requests</dt>
                      <dd className="text-lg font-semibold text-[#000080]">{requests.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-[#FFD700] p-3">
                    <svg className="h-6 w-6 text-[#000080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[#000080] truncate">Pending</dt>
                      <dd className="text-lg font-semibold text-[#000080]">
                        {requests.filter(r => r.status === 'pending').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[#000080] truncate">Approved</dt>
                      <dd className="text-lg font-semibold text-[#000080]">
                        {requests.filter(r => r.status === 'approved').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[#000080] truncate">Rejected</dt>
                      <dd className="text-lg font-semibold text-[#000080]">
                        {requests.filter(r => r.status === 'rejected').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#000080] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="text-lg font-semibold text-[#000080]">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-[#000080] mb-3">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeTab === 'all'
                          ? 'bg-[#000080] text-white'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeTab === 'pending'
                          ? 'bg-[#FFD700] text-[#000080]'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending
                    </button>
                    <button
                      onClick={() => setActiveTab('approved')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeTab === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approved
                    </button>
                    <button
                      onClick={() => setActiveTab('rejected')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeTab === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rejected
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[#000080] mb-3">Role</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveRole('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeRole === 'all'
                          ? 'bg-[#000080] text-white'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      All Roles
                    </button>
                    <button
                      onClick={() => setActiveRole('organisation')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeRole === 'organisation'
                          ? 'bg-[#000080] text-white'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Organisation
                    </button>
                    <button
                      onClick={() => setActiveRole('player')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeRole === 'player'
                          ? 'bg-[#000080] text-white'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Player
                    </button>
                    <button
                      onClick={() => setActiveRole('trainer')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        activeRole === 'trainer'
                          ? 'bg-[#000080] text-white'
                          : 'bg-gray-100 text-[#000080] hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Trainer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-6 text-center">
                <svg
                  className="animate-spin h-8 w-8 text-[#000080] mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-2 text-[#000080]">Loading requests...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[#000080]">No requests found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#000080]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Applicant
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Requested At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request.request_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#000080] flex items-center justify-center text-white text-lg font-bold">
                              {request.name?.charAt(0) || '?'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#000080]">{request.name}</div>
                              <div className="text-sm text-[#000080]">{request.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#000080] capitalize">{request.requested_role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-[#FFD700] text-[#000080]'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000080]">
                          {formatDate(request.requested_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleReview(request)}
                            className="inline-flex items-center px-4 py-2 border border-[#000080] rounded-md shadow-sm text-sm font-medium text-white bg-[#000080] hover:bg-[#0000B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000080] transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReviewModal && renderReviewModal()}
    </div>
  );
}