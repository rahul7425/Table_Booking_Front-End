import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Eye, Trash2, Loader, Mail, User, Calendar, Tag, MessageSquare, Users } from 'lucide-react';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/contact/all');
      if (response.data.success) {
        setContacts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const viewContact = async (id) => {
    try {
      const response = await axiosInstance.get(`/contact/${id}`);
      if (response.data.success) {
        setSelectedContact(response.data.data);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
      alert('Failed to fetch contact details');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axiosInstance.delete(`/contact/${id}`);
      // Remove the deleted contact from state
      setContacts(prev => prev.filter(contact => contact._id !== id));
      alert('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to delete contact');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'recent' && isRecent(contact.createdAt)) ||
      (filterStatus === 'old' && !isRecent(contact.createdAt));
    
    return matchesSearch && matchesStatus;
  });

  const isRecent = (dateString) => {
    const contactDate = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - contactDate) / (1000 * 60 * 60);
    return diffInHours <= 24; // Messages from last 24 hours
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader className="h-12 w-12 animate-spin text-green-600" />
            <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading Contacts</h3>
            <p className="text-gray-600 mt-1">Fetching contact messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Contact Messages
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Total {contacts.length} contact message{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
                <div className="text-xs text-gray-500">Total Messages</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">
                  {contacts.filter(contact => isRecent(contact.createdAt)).length}
                </div>
                <div className="text-xs text-gray-500">Recent (24h)</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(contacts.map(contact => contact.email)).size}
                </div>
                <div className="text-xs text-gray-500">Unique Emails</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search  */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">All Messages</option>
                <option value="recent">Recent (Last 24h)</option>
                <option value="old">Older Messages</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Message</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-6xl">📭</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">No messages found</h3>
                          <p className="text-gray-600 mt-1">
                            {searchTerm || filterStatus !== 'all' 
                              ? 'Try adjusting your search or filter criteria' 
                              : 'No contact messages have been received yet'
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr 
                      key={contact._id} 
                      className="hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                      onClick={() => viewContact(contact._id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-semibold">
                              {contact.firstName?.[0]}{contact.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {isRecent(contact.createdAt) ? (
                                <span className="flex items-center gap-1 text-green-600">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                  Recent
                                </span>
                              ) : 'Contact'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div className="text-sm text-gray-900 break-all">
                            {contact.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => viewContact(contact._id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">View</span>
                          </button>
                          <button
                            onClick={() => deleteContact(contact._id)}
                            disabled={deleteLoading === contact._id}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteLoading === contact._id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        {filteredContacts.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            Showing {filteredContacts.length} of {contacts.length} messages
            {(searchTerm || filterStatus !== 'all') && (
              <span className="ml-2">
                • <button 
                    onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} 
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
              </span>
            )}
          </div>
        )}

        {/* View Modal */}
        {viewModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                    <p className="text-gray-600 mt-1">
                      Message from {selectedContact.firstName} {selectedContact.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-green-700 font-semibold">
                          {selectedContact.firstName?.[0]}{selectedContact.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedContact.firstName} {selectedContact.lastName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{selectedContact.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Message</span>
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created At</span>
                      </label>
                      <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Updated
                      </label>
                      <p className="text-gray-900">{formatDate(selectedContact.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => deleteContact(selectedContact._id)}
                    disabled={deleteLoading === selectedContact._id}
                    className="px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors duration-200 font-semibold flex items-center space-x-2"
                  >
                    {deleteLoading === selectedContact._id ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span>Delete Message</span>
                  </button>
                  <button
                    onClick={() => setViewModal(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;