
// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance';
// import {
//     Eye,
//     Edit,
//     Trash2,
//     Loader,
//     Plus,
//     Building,
//     MapPin,
//     Star,
//     Calendar,
//     Filter,
//     Search,
//     MoreVertical,
//     CheckCircle,
//     XCircle,
//     Clock,
//     AlertCircle,
//     RefreshCw
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const BusinessList = () => {
//     const [businesses, setBusinesses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [deleteLoading, setDeleteLoading] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);

//     const [openMenu, setOpenMenu] = useState(null);


//     useEffect(() => {
//         fetchBusinesses();
//     }, [currentPage]);

//     const fetchBusinesses = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Using POST as per your backend route
//             const response = await axiosInstance.post('/details/list', {
//                 page: currentPage,
//                 limit: itemsPerPage
//             });

//             if (response.data.success) {
//                 setBusinesses(response.data.data || []);
//             } else {
//                 throw new Error(response.data.message || 'Failed to fetch businesses');
//             }
//         } catch (error) {
//             console.error('Error fetching businesses:', error);
//             const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch businesses';
//             setError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // In your BusinessList component, the delete function is already implemented correctly:
//     const deleteBusiness = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this business?')) {
//             return;
//         }

//         try {
//             setDeleteLoading(id);
//             await axiosInstance.delete(`/details/${id}`);
//             setBusinesses(prev => prev.filter(business => business._id !== id));
//             alert('Business deleted successfully');
//         } catch (error) {
//             console.error('Error deleting business:', error);
//             alert(error.response?.data?.message || 'Failed to delete business');
//         } finally {
//             setDeleteLoading(null);
//         }
//     };

//     const toggleBusinessStatus = async (id, currentStatus) => {
//         try {
//             const response = await axiosInstance.put(`/details/toggle/business/${id}`);
//             if (response.data.success) {
//                 setBusinesses(prev => prev.map(business =>
//                     business._id === id
//                         ? { ...business, isActive: response.data.status }
//                         : business
//                 ));
//                 alert(`Business is now ${response.data.status ? 'Active' : 'Inactive'}`);
//             }
//         } catch (error) {
//             console.error('Error toggling business status:', error);
//             alert('Failed to update business status');
//         }
//     };

//     const updateCommission = async (businessId, commissionPercentage) => {
//         const newCommission = prompt('Enter new commission percentage:', commissionPercentage);
//         if (newCommission && !isNaN(newCommission)) {
//             try {
//                 const response = await axiosInstance.put('/details/commission/update', {
//                     businessId,
//                     commissionPercentage: parseInt(newCommission)
//                 });
//                 if (response.data.success) {
//                     setBusinesses(prev => prev.map(business =>
//                         business._id === businessId
//                             ? { ...business, defaultCommissionPercentage: response.data.data.commissionPercentage }
//                             : business
//                     ));
//                     alert('Commission updated successfully');
//                 }
//             } catch (error) {
//                 console.error('Error updating commission:', error);
//                 alert('Failed to update commission');
//             }
//         }
//     };

//     const updateStatus = async (businessId, status) => {
//         try {
//             const response = await axiosInstance.put(`/details/status/${businessId}`, {
//                 status
//             });
//             if (response.data.success) {
//                 setBusinesses(prev => prev.map(business =>
//                     business._id === businessId
//                         ? { ...business, requestStatus: status }
//                         : business
//                 ));
//                 alert('Business status updated successfully');
//             }
//         } catch (error) {
//             console.error('Error updating status:', error);
//             alert('Failed to update status');
//         }
//     };

//     const filteredBusinesses = businesses.filter(business => {
//         const matchesSearch = business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             business.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             business.address?.state?.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = statusFilter === 'all' || business.requestStatus === statusFilter;
//         return matchesSearch && matchesStatus;
//     });

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
//             approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
//             rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
//         };
//         const config = statusConfig[status] || statusConfig.pending;
//         const Icon = config.icon;

//         return (
//             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
//                 <Icon className="w-3 h-3 mr-1" />
//                 {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
//             </span>
//         );
//     };

//     const getActiveBadge = (isActive) => (
//         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//             {isActive ? 'Active' : 'Inactive'}
//         </span>
//     );

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="flex items-center space-x-2">
//                     <Loader className="h-6 w-6 animate-spin text-green-600" />
//                     <span className="text-gray-600">Loading businesses...</span>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 p-6">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                         <div className="flex items-center space-x-3">
//                             <AlertCircle className="h-8 w-8 text-red-400" />
//                             <div>
//                                 <h3 className="text-lg font-medium text-red-800">Error Loading Businesses</h3>
//                                 <p className="text-red-700 mt-1">{error}</p>
//                                 <p className="text-red-600 text-sm mt-2">
//                                     Please check your backend configuration and ensure the route is properly set up.
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="mt-4 flex space-x-3">
//                             <button
//                                 onClick={fetchBusinesses}
//                                 className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                             >
//                                 <RefreshCw className="h-4 w-4" />
//                                 <span>Try Again</span>
//                             </button>
//                             <Link
//                                 to="/businesses/create"
//                                 className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                             >
//                                 <Plus className="h-4 w-4" />
//                                 <span>Create Business</span>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-6">
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
//                             <p className="text-gray-600 mt-2">
//                                 {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
//                             </p>
//                         </div>
//                         <div className="flex space-x-3">
//                             <button
//                                 onClick={fetchBusinesses}
//                                 className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
//                             >
//                                 <RefreshCw className="h-4 w-4" />
//                                 <span>Refresh</span>
//                             </button>
//                             <Link
//                                 to="/businesses/create"
//                                 className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                             >
//                                 <Plus className="h-5 w-5" />
//                                 <span>Add Business</span>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Filters */}
//                 <div className="bg-white rounded-lg shadow p-4 mb-6">
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="flex-1">
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search businesses by name, city, or state..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                 />
//                             </div>
//                         </div>
//                         <select
//                             value={statusFilter}
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         >
//                             <option value="all">All Status</option>
//                             <option value="pending">Pending</option>
//                             <option value="approved">Approved</option>
//                             <option value="rejected">Rejected</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* Business Grid */}
//                 {filteredBusinesses.length === 0 ? (
//                     <div className="bg-white rounded-lg shadow p-12 text-center">
//                         <Building className="mx-auto h-16 w-16 text-gray-400" />
//                         <h3 className="mt-4 text-lg font-medium text-gray-900">No businesses found</h3>
//                         <p className="mt-2 text-gray-500">
//                             {searchTerm || statusFilter !== 'all'
//                                 ? 'Try adjusting your search or filter criteria.'
//                                 : 'Get started by creating your first business.'
//                             }
//                         </p>
//                         {!searchTerm && statusFilter === 'all' && (
//                             <Link
//                                 to="/businesses/create"
//                                 className="mt-4 inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                             >
//                                 <Plus className="h-4 w-4" />
//                                 <span>Create Business</span>
//                             </Link>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {filteredBusinesses.map((business) => (
//                             <div key={business._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                                 {/* Business Images */}
//                                 <div className="h-48 bg-gray-200 relative">
//                                     {business.images && business.images.length > 0 ? (
//                                         <img
//                                             src={`http://localhost:5000/${business.images[0]}`}
//                                             alt={business.name}
//                                             className="w-full h-full object-cover"
//                                             onError={(e) => {
//                                                 e.target.style.display = 'none';
//                                                 e.target.nextSibling.style.display = 'flex';
//                                             }}
//                                         />
//                                     ) : null}
//                                     <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${business.images && business.images.length > 0 ? 'hidden' : ''}`}>
//                                         <Building className="h-12 w-12 text-gray-400" />
//                                     </div>
//                                     <div className="absolute top-3 right-3 flex space-x-2">
//                                         {getStatusBadge(business.requestStatus)}
//                                         {getActiveBadge(business.isActive)}
//                                     </div>
//                                 </div>

//                                 {/* Business Info */}
//                                 <div className="p-4">
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h3 className="text-lg font-semibold text-gray-900 truncate">
//                                             {business.name || 'Unnamed Business'}
//                                         </h3>
//                                         <div className="flex items-center space-x-1 text-yellow-500">
//                                             <Star className="h-4 w-4 fill-current" />
//                                             <span className="text-sm font-medium">
//                                                 {business.averageRating || 0}
//                                             </span>
//                                             <span className="text-gray-400 text-sm">
//                                                 ({business.totalRatings || 0})
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                                         {business.description || 'No description available'}
//                                     </p>

//                                     <div className="flex items-center text-gray-500 text-sm mb-3">
//                                         <MapPin className="h-4 w-4 mr-1" />
//                                         <span>
//                                             {business.address?.city || 'Unknown city'}, {business.address?.state || 'Unknown state'}
//                                         </span>
//                                     </div>

//                                     <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
//                                         <span>Commission: {business.defaultCommissionPercentage || 0}%</span>
//                                         <span>Branches: {business.branches?.length || 0}</span>
//                                     </div>

//                                     <div className="flex items-center justify-between text-xs text-gray-500">
//                                         <div className="flex items-center">
//                                             <Calendar className="h-3 w-3 mr-1" />
//                                             {business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'Unknown date'}
//                                         </div>
//                                         <span className="capitalize">{business.categoryType || 'both'}</span>
//                                     </div>
//                                 </div>

//                                 {/* Actions */}
//                                 <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
//                                     <div className="flex justify-between items-center">
//                                         <div className="flex space-x-2">
//                                             <Link
//                                                 to={`/businesses/${business._id}`}
//                                                 className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
//                                             >
//                                                 <Eye className="h-4 w-4" />
//                                                 <span>View</span>
//                                             </Link>
//                                             <Link
//                                                 to={`/businesses/edit/${business._id}`}
//                                                 className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
//                                             >
//                                                 <Edit className="h-4 w-4" />
//                                                 <span>Edit</span>
//                                             </Link>
//                                         </div>

//                                         <div className="relative group">

//                                             <button
//                                                 onClick={() => setOpenMenu(openMenu === business._id ? null : business._id)}
//                                                 className="p-1 text-gray-400 hover:text-gray-600"
//                                             >
//                                                 <MoreVertical className="h-4 w-4" />
//                                             </button>




//                                             <div
//                                                 className={`absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10
//   ${openMenu === business._id ? "opacity-100 visible" : "opacity-0 invisible"}
//   transition-all`}
//                                             >
//                                                 <div className="py-1">
//                                                     <button
//                                                         onClick={() => toggleBusinessStatus(business._id, business.isActive)}
//                                                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                                     >
//                                                         {business.isActive ? 'Deactivate' : 'Activate'}
//                                                     </button>

//                                                     <button
//                                                         onClick={() => updateCommission(business._id, business.defaultCommissionPercentage)}
//                                                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                                     >
//                                                         Update Commission
//                                                     </button>

//                                                     {business.requestStatus === 'pending' && (
//                                                         <>
//                                                             <button
//                                                                 onClick={() => updateStatus(business._id, 'approved')}
//                                                                 className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
//                                                             >
//                                                                 Approve
//                                                             </button>

//                                                             <button
//                                                                 onClick={() => updateStatus(business._id, 'rejected')}
//                                                                 className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
//                                                             >
//                                                                 Reject
//                                                             </button>
//                                                         </>
//                                                     )}

//                                                     <button
//                                                         onClick={() => deleteBusiness(business._id)}
//                                                         disabled={deleteLoading === business._id}
//                                                         className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
//                                                     >
//                                                         {deleteLoading === business._id ? 'Deleting...' : 'Delete'}
//                                                     </button>
//                                                 </div>
//                                             </div>


//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BusinessList;




import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import {
    Eye,
    Edit,
    Trash2,
    Loader,
    Plus,
    Building,
    MapPin,
    Star,
    Calendar,
    Filter,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessList = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        fetchBusinesses();
    }, [currentPage]);

    const fetchBusinesses = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post('/details/list', {
                page: currentPage,
                limit: itemsPerPage
            });

            if (response.data.success) {
                setBusinesses(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch businesses');
            }
        } catch (error) {
            console.error('Error fetching businesses:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch businesses';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteBusiness = async (id) => {
        if (!window.confirm('Are you sure you want to delete this business?')) {
            return;
        }

        try {
            setDeleteLoading(id);
            await axiosInstance.delete(`/details/${id}`);
            setBusinesses(prev => prev.filter(business => business._id !== id));
            alert('Business deleted successfully');
        } catch (error) {
            console.error('Error deleting business:', error);
            alert(error.response?.data?.message || 'Failed to delete business');
        } finally {
            setDeleteLoading(null);
        }
    };

    const toggleBusinessStatus = async (id, currentStatus) => {
        try {
            const response = await axiosInstance.put(`/details/toggle/business/${id}`);
            if (response.data.success) {
                setBusinesses(prev => prev.map(business =>
                    business._id === id
                        ? { ...business, isActive: response.data.status }
                        : business
                ));
                alert(`Business is now ${response.data.status ? 'Active' : 'Inactive'}`);
            }
        } catch (error) {
            console.error('Error toggling business status:', error);
            alert('Failed to update business status');
        }
    };

    const updateCommission = async (businessId, commissionPercentage) => {
        const newCommission = prompt('Enter new commission percentage:', commissionPercentage);
        if (newCommission && !isNaN(newCommission)) {
            try {
                const response = await axiosInstance.put('/details/commission/update', {
                    businessId,
                    commissionPercentage: parseInt(newCommission)
                });
                if (response.data.success) {
                    setBusinesses(prev => prev.map(business =>
                        business._id === businessId
                            ? { ...business, defaultCommissionPercentage: response.data.data.commissionPercentage }
                            : business
                    ));
                    alert('Commission updated successfully');
                }
            } catch (error) {
                console.error('Error updating commission:', error);
                alert('Failed to update commission');
            }
        }
    };

    const updateStatus = async (businessId, status) => {
        try {
            const response = await axiosInstance.put(`/details/status/${businessId}`, {
                status
            });
            if (response.data.success) {
                setBusinesses(prev => prev.map(business =>
                    business._id === businessId
                        ? { ...business, requestStatus: status }
                        : business
                ));
                alert('Business status updated successfully');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredBusinesses = businesses.filter(business => {
        const matchesSearch = business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            business.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            business.address?.state?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || business.requestStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
        );
    };

    const getActiveBadge = (isActive) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader className="h-6 w-6 animate-spin text-green-600" />
                    <span className="text-gray-600">Loading businesses...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="h-8 w-8 text-red-400" />
                            <div>
                                <h3 className="text-lg font-medium text-red-800">Error Loading Businesses</h3>
                                <p className="text-red-700 mt-1">{error}</p>
                                <p className="text-red-600 text-sm mt-2">
                                    Please check your backend configuration and ensure the route is properly set up.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={fetchBusinesses}
                                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Try Again</span>
                            </button>
                            <Link
                                to="/businesses/create"
                                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create Business</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
                            <p className="text-gray-600 mt-2">
                                {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={fetchBusinesses}
                                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Refresh</span>
                            </button>
                            <Link
                                to="/businesses/create"
                                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Add Business</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search businesses by name, city, or state..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Business Grid */}
                {filteredBusinesses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Building className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No businesses found</h3>
                        <p className="mt-2 text-gray-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by creating your first business.'
                            }
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <Link
                                to="/businesses/create"
                                className="mt-4 inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create Business</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBusinesses.map((business) => (
                            <div key={business._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                {/* Business Images */}
                                <div className="h-48 bg-gray-200 relative">
                                    {business.images && business.images.length > 0 ? (
                                        <img
                                            src={`http://localhost:5000/${business.images[0]}`}
                                            alt={business.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${business.images && business.images.length > 0 ? 'hidden' : ''}`}>
                                        <Building className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        {getStatusBadge(business.requestStatus)}
                                        {getActiveBadge(business.isActive)}
                                    </div>
                                </div>

                                {/* Business Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {business.name || 'Unnamed Business'}
                                        </h3>
                                        <div className="flex items-center space-x-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-sm font-medium">
                                                {business.averageRating || 0}
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                ({business.totalRatings || 0})
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {business.description || 'No description available'}
                                    </p>

                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>
                                            {business.address?.city || 'Unknown city'}, {business.address?.state || 'Unknown state'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                                        <span>Commission: {business.defaultCommissionPercentage || 0}%</span>
                                        <span>Branches: {business.branches?.length || 0}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'Unknown date'}
                                        </div>
                                        <span className="capitalize">{business.categoryType || 'both'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/businesses/${business._id}`}
                                                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>View</span>
                                            </Link>
                                            <Link
                                                to={`/businesses/edit/${business._id}`}
                                                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span>Edit</span>
                                            </Link>
                                            <Link
                                                to={`/businesses/${business._id}/branches`}
                                                className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm"
                                            >
                                                <Building className="h-4 w-4" />
                                                <span>Branches</span>
                                            </Link>
                                        </div>

                                        <div className="relative group">
                                            <button
                                                onClick={() => setOpenMenu(openMenu === business._id ? null : business._id)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </button>

                                            <div
                                                className={`absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10
  ${openMenu === business._id ? "opacity-100 visible" : "opacity-0 invisible"}
  transition-all`}
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => toggleBusinessStatus(business._id, business.isActive)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {business.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>

                                                    <button
                                                        onClick={() => updateCommission(business._id, business.defaultCommissionPercentage)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Update Commission
                                                    </button>

                                                    {business.requestStatus === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(business._id, 'approved')}
                                                                className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                                            >
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={() => updateStatus(business._id, 'rejected')}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() => deleteBusiness(business._id)}
                                                        disabled={deleteLoading === business._id}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        {deleteLoading === business._id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessList;