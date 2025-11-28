
// components/Pages/Bookings/BookingsList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock,
  Search,
  RefreshCw,
  ShoppingCart,
  UserCheck,
  X,
  MapPin,
  CreditCard,
  Tag
} from 'lucide-react';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/bookings/all');
      console.log('API Response:', response.data); // Debug log
      
      // Fixed: Check for bookings array directly in response
      if (response.data && response.data.bookings) {
        setBookings(response.data.bookings);
        calculateStats(response.data.bookings);
      } else {
        console.error('Unexpected response structure:', response.data);
        alert('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to fetch bookings: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const statsData = {
      total: bookingsData.length,
      pending: bookingsData.filter(b => b.status === 'pending').length,
      confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
      cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
      completed: bookingsData.filter(b => b.status === 'completed').length
    };
    setStats(statsData);
  };

  const viewBooking = async (id) => {
    try {
      const response = await axiosInstance.get(`/bookings/${id}`);
      console.log('Single booking response:', response.data); // Debug log
      
      // Fixed: Check for booking object directly
      if (response.data.booking) {
        setSelectedBooking(response.data.booking);
        setViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      alert('Failed to fetch booking details: ' + (error.response?.data?.message || error.message));
    }
  };

  const acceptBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to accept this booking?')) return;

    try {
      setActionLoading(bookingId);
      const response = await axiosInstance.put(`/bookings/${bookingId}/accept`);
      console.log('Accept response:', response.data); // Debug log
      
      // Fixed: Check for success message directly
      if (response.data.message) {
        // Update the booking in state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'confirmed', requestStatus: 'accepted' }
            : booking
        ));
        alert('Booking accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert(error.response?.data?.message || 'Failed to accept booking');
    } finally {
      setActionLoading(null);
    }
  };

  const denyBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to deny this booking?')) return;

    try {
      setActionLoading(bookingId);
      const response = await axiosInstance.put(`/bookings/${bookingId}/deny`);
      console.log('Deny response:', response.data); // Debug log
      
      // Fixed: Check for success message directly
      if (response.data.message) {
        // Update the booking in state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled', requestStatus: 'denied' }
            : booking
        ));
        alert('Booking denied successfully!');
      }
    } catch (error) {
      console.error('Error denying booking:', error);
      alert(error.response?.data?.message || 'Failed to deny booking');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Filter bookings based on search and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.table_id?.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.table_id?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Debug: Check what's being rendered
  console.log('Bookings state:', bookings);
  console.log('Filtered bookings:', filteredBookings);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <RefreshCw className="h-12 w-12 animate-spin text-green-600" />
            <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading Bookings</h3>
            <p className="text-gray-600 mt-1">Fetching your reservation data...</p>
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
                Booking Management
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Manage all restaurant table reservations and orders
                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {bookings.length} total bookings
                </span>
              </p>
            </div>
            
            <button
              onClick={fetchBookings}
              className="flex items-center space-x-2 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by booking ID, email, table number, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer & Table
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount & Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-6xl">📅</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
                          <p className="text-gray-600 mt-1">
                            {searchTerm || statusFilter !== 'all'
                              ? 'Try adjusting your search or filter criteria'
                              : 'No bookings have been made yet'
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr 
                      key={booking._id} 
                      className="hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              #{booking._id.slice(-8)}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(booking.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <div className="text-sm text-gray-900">
                              {booking.user_id?.email || 'N/A'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>Table: {booking.table_id?.tableNumber || 'N/A'}</span>
                            <span>•</span>
                            <span>{booking.table_id?.category || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(booking.totalAmount)}
                            </div>
                          </div>
                          {booking.discountApplied > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <Tag className="h-3 w-3" />
                              <span>Discount: -{formatCurrency(booking.discountApplied)}</span>
                            </div>
                          )}
                          <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            <CreditCard className="h-3 w-3 mr-1" />
                            {booking.paymentStatus}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          {booking.requestStatus && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRequestStatusColor(booking.requestStatus)}`}>
                              {booking.requestStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewBooking(booking._id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">View</span>
                          </button>
                          
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => acceptBooking(booking._id)}
                                disabled={actionLoading === booking._id}
                                className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                              >
                                {actionLoading === booking._id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                <span className="text-sm font-medium">Accept</span>
                              </button>
                              
                              <button
                                onClick={() => denyBooking(booking._id)}
                                disabled={actionLoading === booking._id}
                                className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                              >
                                {actionLoading === booking._id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                <span className="text-sm font-medium">Deny</span>
                              </button>
                            </>
                          )}
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
        {filteredBookings.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            Showing {filteredBookings.length} of {bookings.length} bookings
            {(searchTerm || statusFilter !== 'all') && (
              <span className="ml-2">
                • <button 
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} 
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
              </span>
            )}
          </div>
        )}

        {/* View Booking Modal */}
        {viewModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-in">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                    <p className="text-gray-600 mt-1">
                      #{selectedBooking._id}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Status Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl border ${getStatusColor(selectedBooking.status)}`}>
                      <label className="block text-sm font-semibold mb-2">Status</label>
                      <p className="text-lg font-bold capitalize">{selectedBooking.status}</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${getRequestStatusColor(selectedBooking.requestStatus)}`}>
                      <label className="block text-sm font-semibold mb-2">Request Status</label>
                      <p className="text-lg font-bold capitalize">{selectedBooking.requestStatus}</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      <label className="block text-sm font-semibold mb-2">Payment</label>
                      <p className="text-lg font-bold capitalize">{selectedBooking.paymentStatus}</p>
                    </div>
                  </div>

                  {/* Customer & Table Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Customer Information
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm text-blue-700">Email</label>
                          <p className="font-medium text-blue-900">{selectedBooking.user_id?.email}</p>
                        </div>
                        <div>
                          <label className="text-sm text-blue-700">User ID</label>
                          <p className="font-medium text-blue-900 text-sm">{selectedBooking.user_id?._id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Table Information
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm text-green-700">Table Number</label>
                          <p className="font-medium text-green-900">{selectedBooking.table_id?.tableNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm text-green-700">Category</label>
                          <p className="font-medium text-green-900">{selectedBooking.table_id?.category}</p>
                        </div>
                        <div>
                          <label className="text-sm text-green-700">Capacity</label>
                          <p className="font-medium text-green-900">{selectedBooking.table_id?.seatingCapacity} people</p>
                        </div>
                        <div>
                          <label className="text-sm text-green-700">Price</label>
                          <p className="font-medium text-green-900">{formatCurrency(selectedBooking.table_id?.price || 0)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Ordered */}
                  {selectedBooking.items_ordered && selectedBooking.items_ordered.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Items Ordered</h3>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="space-y-3">
                          {selectedBooking.items_ordered.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <div>
                                <p className="font-medium text-gray-900">Item #{index + 1}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Variant ID: {item.selected_variant_id?.slice(-6)}</p>
                                <p className="text-sm text-gray-600">Item ID: {item.itemId?.slice(-6)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Information */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Financial Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-purple-700">Total Amount</label>
                        <p className="text-xl font-bold text-purple-900">
                          {formatCurrency(selectedBooking.totalAmount)}
                        </p>
                      </div>
                      {selectedBooking.discountApplied > 0 && (
                        <div>
                          <label className="text-sm text-purple-700">Discount Applied</label>
                          <p className="text-xl font-bold text-green-600">
                            -{formatCurrency(selectedBooking.discountApplied)}
                          </p>
                        </div>
                      )}
                      {selectedBooking.couponId && (
                        <div className="md:col-span-2">
                          <label className="text-sm text-purple-700">Coupon Used</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Tag className="h-4 w-4 text-purple-600" />
                            <p className="font-medium text-purple-900">
                              {selectedBooking.couponId.code} ({selectedBooking.couponId.discountValue}% off)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Booking Date
                      </label>
                      <p className="text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Updated
                      </label>
                      <p className="text-gray-900">{formatDate(selectedBooking.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          acceptBooking(selectedBooking._id);
                          setViewModal(false);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept Booking</span>
                      </button>
                      <button
                        onClick={() => {
                          denyBooking(selectedBooking._id);
                          setViewModal(false);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Deny Booking</span>
                      </button>
                    </>
                  )}
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

export default BookingsList;