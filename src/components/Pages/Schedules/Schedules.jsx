
// // components/Pages/Schedules/Schedules.js
// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance';
// import { Plus, Edit, Trash2, Loader, Search, Calendar, Clock, Building } from 'lucide-react';

// const Schedules = () => {
//   const [schedules, setSchedules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingSchedule, setEditingSchedule] = useState(null);
//   const [businesses, setBusinesses] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [slotSets, setSlotSets] = useState([]);
//   const [businessLoading, setBusinessLoading] = useState(false);
//   const [slotSetsLoading, setSlotSetsLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     date: '',
//     businessId: '',
//     branchId: '',
//     tableId: '',
//     slotSetId: ''
//   });

//   useEffect(() => {
//     fetchSchedules();
//     fetchBusinesses();
//   }, []);

//   const fetchSchedules = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Schedule'
//       });
//       if (response.data.success) {
//         setSchedules(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching schedules:', error);
//       alert('Failed to fetch schedules');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch businesses from the new API
//   const fetchBusinesses = async () => {
//     try {
//       setBusinessLoading(true);
//       const response = await axiosInstance.post('/details/list', {
//         page: 1,
//         limit: 100
//       });
//       if (response.data.success) {
//         setBusinesses(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching businesses:', error);
//       alert('Failed to fetch businesses');
//     } finally {
//       setBusinessLoading(false);
//     }
//   };

//   // Extract branches from selected business
//   const fetchBranches = (businessId) => {
//     const selectedBusiness = businesses.find(business => business._id === businessId);
//     if (selectedBusiness && selectedBusiness.branches) {
//       setBranches(selectedBusiness.branches);
//     } else {
//       setBranches([]);
//     }
//   };

//   const fetchTables = async (businessId, branchId) => {
//     try {
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Table',
//         businessId,
//         ...(branchId && { branchId })
//       });
//       if (response.data.success) {
//         setTables(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching tables:', error);
//     }
//   };

//   // Fetch slot sets for the selected business
//   const fetchSlotSets = async (businessId) => {
//     try {
//       setSlotSetsLoading(true);
//       console.log('Fetching slot sets for business:', businessId);
      
//       // Try different API endpoints
//       let response;
      
//       // First try the slots API
//       try {
//         response = await axiosInstance.get(`/slots/business/${businessId}`);
//         console.log('Slot sets response:', response.data);
//       } catch (slotError) {
//         console.log('Slots API failed, trying business API:', slotError);
//         // If slots API fails, try getting from business data
//         response = await axiosInstance.post('/business/get-all', {
//           model: 'Slot',
//           businessId
//         });
//       }

//       if (response.data) {
//         // Handle different response formats
//         if (Array.isArray(response.data)) {
//           setSlotSets(response.data);
//         } else if (response.data.success && Array.isArray(response.data.data)) {
//           setSlotSets(response.data.data);
//         } else {
//           console.log('Unexpected slot sets response format:', response.data);
//           setSlotSets([]);
//         }
//       } else {
//         setSlotSets([]);
//       }
//     } catch (error) {
//       console.error('Error fetching slot sets:', error);
//       setSlotSets([]);
//     } finally {
//       setSlotSetsLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         model: 'Schedule',
//         ...formData,
//         date: new Date(formData.date).toISOString()
//       };

//       if (editingSchedule) {
//         payload.id = editingSchedule._id;
//         await axiosInstance.put('/business/update', payload);
//         alert('Schedule updated successfully');
//       } else {
//         await axiosInstance.post('/business/create', payload);
//         alert('Schedule created successfully');
//       }

//       setShowModal(false);
//       resetForm();
//       fetchSchedules();
//     } catch (error) {
//       console.error('Error saving schedule:', error);
//       alert('Failed to save schedule');
//     }
//   };

//   const handleEdit = (schedule) => {
//     setEditingSchedule(schedule);
//     const scheduleDate = new Date(schedule.date);
//     const formattedDate = scheduleDate.toISOString().split('T')[0];
    
//     setFormData({
//       date: formattedDate,
//       businessId: schedule.businessId?._id || schedule.businessId,
//       branchId: schedule.branchId?._id || schedule.branchId || '',
//       tableId: schedule.tableId?._id || schedule.tableId,
//       slotSetId: schedule.slotSetId?._id || schedule.slotSetId || ''
//     });

//     if (schedule.businessId?._id || schedule.businessId) {
//       const businessId = schedule.businessId?._id || schedule.businessId;
//       fetchBranches(businessId);
//       fetchTables(businessId, schedule.branchId?._id || schedule.branchId);
//       fetchSlotSets(businessId);
//     }
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this schedule?')) return;

//     try {
//       await axiosInstance.delete('/business/delete', {
//         data: { model: 'Schedule', id }
//       });
//       alert('Schedule deleted successfully');
//       fetchSchedules();
//     } catch (error) {
//       console.error('Error deleting schedule:', error);
//       alert('Failed to delete schedule');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       date: '',
//       businessId: '',
//       branchId: '',
//       tableId: '',
//       slotSetId: ''
//     });
//     setEditingSchedule(null);
//     setBranches([]);
//     setTables([]);
//     setSlotSets([]);
//   };

//   // Get business name - handle both populated and non-populated data
//   const getBusinessName = (businessData) => {
//     if (!businessData) return 'N/A';
//     if (typeof businessData === 'object' && businessData.name) {
//       return businessData.name;
//     }
//     // If it's just an ID, try to find in businesses list
//     const business = businesses.find(b => b._id === businessData);
//     return business ? business.name : 'Unknown Business';
//   };

//   // Get branch name - handle both populated and non-populated data
//   const getBranchName = (branchData) => {
//     if (!branchData) return 'All Branches';
//     if (typeof branchData === 'object' && branchData.name) {
//       return branchData.name;
//     }
//     // If it's just an ID, try to find in branches list
//     for (let business of businesses) {
//       if (business.branches) {
//         const branch = business.branches.find(b => b._id === branchData);
//         if (branch) return branch.name;
//       }
//     }
//     return 'Unknown Branch';
//   };

//   // Get table number - handle both populated and non-populated data
//   const getTableNumber = (tableData) => {
//     if (!tableData) return 'N/A';
//     if (typeof tableData === 'object' && tableData.tableNumber) {
//       return tableData.tableNumber;
//     }
//     // If it's just an ID, try to find in tables list
//     const table = tables.find(t => t._id === tableData);
//     return table ? table.tableNumber : 'Unknown Table';
//   };

//   // Get slot set name - handle both populated and non-populated data
//   const getSlotSetName = (slotSetData) => {
//     if (!slotSetData) return 'N/A';
//     if (typeof slotSetData === 'object' && slotSetData.slotSetName) {
//       return slotSetData.slotSetName;
//     }
//     // If it's just an ID, try to find in slotSets list
//     const slotSet = slotSets.find(s => s._id === slotSetData);
//     return slotSet ? slotSet.slotSetName : 'Unknown Slot Set';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading schedules...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
//             <p className="text-gray-600 mt-2">
//               Manage table booking schedules
//             </p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Plus className="h-5 w-5" />
//             <span>Add Schedule</span>
//           </button>
//         </div>

//         {/* Schedules List */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Business
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Branch
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Table
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Slot Set
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {schedules.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                       <div className="flex flex-col items-center">
//                         <Calendar className="h-12 w-12 text-gray-400 mb-4" />
//                         <p>No schedules found</p>
//                         <p className="text-sm text-gray-400 mt-1">Create your first schedule to get started</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   schedules.map((schedule) => (
//                     <tr key={schedule._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 text-gray-400 mr-2" />
//                           <span className="text-sm font-medium text-gray-900">
//                             {formatDate(schedule.date)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {getBusinessName(schedule.businessId)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {getBranchName(schedule.branchId)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         Table {getTableNumber(schedule.tableId)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {getSlotSetName(schedule.slotSetId)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleEdit(schedule)}
//                             className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//                           >
//                             <Edit className="h-4 w-4" />
//                             <span>Edit</span>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(schedule._id)}
//                             className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                             <span>Delete</span>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Create/Edit Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
//                   </h2>
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       resetForm();
//                     }}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Date *
//                     </label>
//                     <input
//                       type="date"
//                       required
//                       value={formData.date}
//                       onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Business *
//                     </label>
//                     <select
//                       required
//                       value={formData.businessId}
//                       onChange={(e) => {
//                         const selectedBusinessId = e.target.value;
//                         setFormData({ 
//                           ...formData, 
//                           businessId: selectedBusinessId, 
//                           branchId: '',
//                           tableId: '',
//                           slotSetId: ''
//                         });
//                         fetchBranches(selectedBusinessId);
//                         fetchSlotSets(selectedBusinessId);
//                         setTables([]);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="">Select Business</option>
//                       {businessLoading ? (
//                         <option value="" disabled>Loading businesses...</option>
//                       ) : (
//                         businesses.map(business => (
//                           <option key={business._id} value={business._id}>
//                             {business.name}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Branch (Optional)
//                     </label>
//                     <select
//                       value={formData.branchId}
//                       onChange={(e) => {
//                         setFormData({ 
//                           ...formData, 
//                           branchId: e.target.value,
//                           tableId: '',
//                           slotSetId: ''
//                         });
//                         fetchTables(formData.businessId, e.target.value);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="">All Branches</option>
//                       {branches.map(branch => (
//                         <option key={branch._id} value={branch._id}>
//                           {branch.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Table *
//                     </label>
//                     <select
//                       required
//                       value={formData.tableId}
//                       onChange={(e) => {
//                         setFormData({ 
//                           ...formData, 
//                           tableId: e.target.value
//                         });
//                       }}
//                       disabled={!formData.businessId}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
//                     >
//                       <option value="">Select Table</option>
//                       {tables.map(table => (
//                         <option key={table._id} value={table._id}>
//                           Table {table.tableNumber} ({table.seatingCapacity} seats)
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Slot Set *
//                     </label>
//                     <select
//                       required
//                       value={formData.slotSetId}
//                       onChange={(e) => setFormData({ ...formData, slotSetId: e.target.value })}
//                       disabled={!formData.businessId || slotSetsLoading}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
//                     >
//                       <option value="">Select Slot Set</option>
//                       {slotSetsLoading ? (
//                         <option value="" disabled>Loading slot sets...</option>
//                       ) : (
//                         slotSets.map(slotSet => (
//                           <option key={slotSet._id} value={slotSet._id}>
//                             {slotSet.slotSetName}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                     {slotSets.length === 0 && formData.businessId && !slotSetsLoading && (
//                       <p className="text-sm text-red-600 mt-1">
//                         No slot sets found for this business. Please create slot sets first.
//                       </p>
//                     )}
//                   </div>

//                   <div className="flex space-x-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowModal(false);
//                         resetForm();
//                       }}
//                       className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={!formData.slotSetId}
//                       className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     >
//                       {editingSchedule ? 'Update' : 'Create'} Schedule
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Schedules;



import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Plus, Edit, Trash2, Loader, Search, Calendar, Clock, Building, X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  const [slotSets, setSlotSets] = useState([]);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [slotSetsLoading, setSlotSetsLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [expandedSchedule, setExpandedSchedule] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    businessId: '',
    branchId: '',
    tableId: '',
    slotSetId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSchedules();
    fetchBusinesses();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/business/get-all', {
        model: 'Schedule'
      });
      if (response.data.success) {
        setSchedules(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      alert('Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      setBusinessLoading(true);
      const response = await axiosInstance.post('/details/list', {
        page: 1,
        limit: 100
      });
      if (response.data.success) {
        setBusinesses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      alert('Failed to fetch businesses');
    } finally {
      setBusinessLoading(false);
    }
  };

  const fetchBranches = (businessId) => {
    const selectedBusiness = businesses.find(business => business._id === businessId);
    if (selectedBusiness && selectedBusiness.branches) {
      setBranches(selectedBusiness.branches);
    } else {
      setBranches([]);
    }
  };

  const fetchSlotSets = async (businessId, branchId = '') => {
    try {
      setSlotSetsLoading(true);
      let response;
      
      // First try with both businessId and branchId
      if (businessId && branchId) {
        try {
          // Try the branch-specific endpoint
          response = await axiosInstance.get(`/slots/business/${businessId}/${branchId}`);
        } catch (error) {
          // Fallback to business-only endpoint
          response = await axiosInstance.get(`/slots/business/${businessId}`);
        }
      } else if (businessId) {
        response = await axiosInstance.get(`/slots/business/${businessId}`);
      }

      if (response && response.data) {
        // Filter slot sets based on branchId if provided
        let filteredSlotSets = response.data;
        if (branchId) {
          filteredSlotSets = response.data.filter(slotSet => 
            slotSet.branchId === branchId
          );
        }
        setSlotSets(filteredSlotSets);
      } else {
        setSlotSets([]);
      }
    } catch (error) {
      console.error('Error fetching slot sets:', error);
      setSlotSets([]);
    } finally {
      setSlotSetsLoading(false);
    }
  };

  const fetchTables = async (businessId, branchId) => {
    try {
      setTablesLoading(true);
      const response = await axiosInstance.post('/business/get-all', {
        model: 'Table',
        businessId,
        ...(branchId && { branchId })
      });
      if (response.data.success) {
        setTables(response.data.data);
      } else {
        setTables([]);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      setTables([]);
    } finally {
      setTablesLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.businessId) {
      newErrors.businessId = 'Business is required';
    }
    
    if (!formData.branchId) {
      newErrors.branchId = 'Branch is required';
    }
    
    if (!formData.tableId) {
      newErrors.tableId = 'Table is required';
    }
    
    if (!formData.slotSetId) {
      newErrors.slotSetId = 'Slot Set is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        model: 'Schedule',
        businessId: formData.businessId,
        branchId: formData.branchId,
        tableId: formData.tableId,
        date: new Date(formData.date).toISOString(),
        ...(formData.slotSetId && { slotSetId: formData.slotSetId })
      };

      if (editingSchedule) {
        payload.id = editingSchedule._id;
        await axiosInstance.put('/business/update', payload);
        alert('Schedule updated successfully');
      } else {
        await axiosInstance.post('/business/create', payload);
        alert('Schedule created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert(`Failed to save schedule: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    
    // Parse the schedule date
    const scheduleDate = new Date(schedule.date);
    const formattedDate = scheduleDate.toISOString().split('T')[0];
    
    // Extract IDs from populated or non-populated data
    const businessId = schedule.businessId?._id || schedule.businessId;
    const branchId = schedule.branchId?._id || schedule.branchId || '';
    const tableId = schedule.tableId?._id || schedule.tableId || '';
    const slotSetId = schedule.slotSetId?._id || schedule.slotSetId || '';
    
    setFormData({
      date: formattedDate,
      businessId,
      branchId,
      tableId,
      slotSetId
    });

    // Fetch related data
    fetchBranches(businessId);
    if (businessId && branchId) {
      fetchSlotSets(businessId, branchId);
      fetchTables(businessId, branchId);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await axiosInstance.delete('/business/delete', {
        data: { model: 'Schedule', id }
      });
      alert('Schedule deleted successfully');
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete schedule');
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      businessId: '',
      branchId: '',
      tableId: '',
      slotSetId: ''
    });
    setEditingSchedule(null);
    setBranches([]);
    setTables([]);
    setSlotSets([]);
    setErrors({});
  };

  const handleBusinessChange = (businessId) => {
    setFormData({ 
      ...formData, 
      businessId,
      branchId: '',
      tableId: '',
      slotSetId: ''
    });
    setBranches([]);
    setTables([]);
    setSlotSets([]);
    setErrors({});
    
    if (businessId) {
      fetchBranches(businessId);
    }
  };

  const handleBranchChange = (branchId) => {
    setFormData({ 
      ...formData, 
      branchId,
      tableId: '',
      slotSetId: ''
    });
    setTables([]);
    setSlotSets([]);
    setErrors({});
    
    if (formData.businessId && branchId) {
      fetchSlotSets(formData.businessId, branchId);
      fetchTables(formData.businessId, branchId);
    }
  };

  // Helper functions to get display names
  const getBusinessName = (businessData) => {
    if (!businessData) return 'N/A';
    if (typeof businessData === 'object' && businessData.name) {
      return businessData.name;
    }
    const business = businesses.find(b => b._id === businessData);
    return business ? business.name : 'Unknown Business';
  };

  const getBranchName = (branchData) => {
    if (!branchData) return 'N/A';
    if (typeof branchData === 'object' && branchData.name) {
      return branchData.name;
    }
    for (let business of businesses) {
      if (business.branches) {
        const branch = business.branches.find(b => b._id === branchData);
        if (branch) return branch.name;
      }
    }
    return 'Unknown Branch';
  };

  const getTableNumber = (tableData) => {
    if (!tableData) return 'N/A';
    if (typeof tableData === 'object' && tableData.tableNumber) {
      return tableData.tableNumber;
    }
    return 'Unknown Table';
  };

  const getSlotSetName = (slotSetData) => {
    if (!slotSetData) return 'N/A';
    if (typeof slotSetData === 'object' && slotSetData.slotSetName) {
      return slotSetData.slotSetName;
    }
    const slotSet = slotSets.find(s => s._id === slotSetData);
    return slotSet ? slotSet.slotSetName : 'Unknown Slot Set';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDayTimeSlots = (slotSet) => {
    if (!slotSet) return [];
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days
      .filter(day => slotSet[day]?.isOpen && slotSet[day]?.times?.length > 0)
      .map(day => {
        const dayData = slotSet[day];
        const times = dayData.times.map(t => t.time).join(', ');
        return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${times}`;
      });
  };

  const toggleExpandSchedule = (scheduleId) => {
    setExpandedSchedule(expandedSchedule === scheduleId ? null : scheduleId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading schedules...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
            <p className="text-gray-600 mt-2">
              Manage table booking schedules for specific dates
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Schedule</span>
          </button>
        </div>

        {/* Schedules List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slot Set
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">No schedules found</p>
                        <p className="text-gray-400">Create your first schedule to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => {
                    const slotSetDetails = schedule.slotSetId;
                    const isExpanded = expandedSchedule === schedule._id;
                    
                    return (
                      <React.Fragment key={schedule._id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(schedule.date)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getBusinessName(schedule.businessId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getBranchName(schedule.branchId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {schedule.tableId ? `Table ${getTableNumber(schedule.tableId)}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getSlotSetName(schedule.slotSetId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(schedule)}
                                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(schedule._id)}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                              {slotSetDetails && (
                                <button
                                  onClick={() => toggleExpandSchedule(schedule._id)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Slot Set Details */}
                        {isExpanded && slotSetDetails && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-2">Slot Set Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Name:</p>
                                    <p className="text-sm text-gray-900">{slotSetDetails.slotSetName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Schedule Time Slots:</p>
                                    <div className="space-y-1">
                                      {getDayTimeSlots(slotSetDetails).map((daySlot, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                          <Clock className="h-3 w-3 mr-2 text-gray-400" />
                                          {daySlot}
                                        </div>
                                      ))}
                                      {getDayTimeSlots(slotSetDetails).length === 0 && (
                                        <p className="text-sm text-gray-500 italic">No time slots configured</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        setErrors({ ...errors, date: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.date ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                  </div>

                  {/* Business Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business *
                    </label>
                    <select
                      required
                      value={formData.businessId}
                      onChange={(e) => handleBusinessChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.businessId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Business</option>
                      {businessLoading ? (
                        <option value="" disabled>Loading businesses...</option>
                      ) : (
                        businesses.map(business => (
                          <option key={business._id} value={business._id}>
                            {business.name}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.businessId && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessId}</p>
                    )}
                  </div>

                  {/* Branch Selection (only shows after business is selected) */}
                  {formData.businessId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch *
                      </label>
                      <select
                        required
                        value={formData.branchId}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.branchId ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      {errors.branchId && (
                        <p className="mt-1 text-sm text-red-600">{errors.branchId}</p>
                      )}
                      {branches.length === 0 && (
                        <p className="mt-1 text-sm text-yellow-600">
                          No branches found for this business
                        </p>
                      )}
                    </div>
                  )}

                  {/* Slot Set Selection (only shows after branch is selected) */}
                  {formData.businessId && formData.branchId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slot Set *
                      </label>
                      <select
                        required
                        value={formData.slotSetId}
                        onChange={(e) => {
                          setFormData({ ...formData, slotSetId: e.target.value });
                          setErrors({ ...errors, slotSetId: '' });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.slotSetId ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={slotSetsLoading}
                      >
                        <option value="">Select Slot Set</option>
                        {slotSetsLoading ? (
                          <option value="" disabled>Loading slot sets...</option>
                        ) : slotSets.length === 0 ? (
                          <option value="" disabled>No slot sets available</option>
                        ) : (
                          slotSets.map(slotSet => (
                            <option key={slotSet._id} value={slotSet._id}>
                              {slotSet.slotSetName}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.slotSetId && (
                        <p className="mt-1 text-sm text-red-600">{errors.slotSetId}</p>
                      )}
                      {!slotSetsLoading && slotSets.length === 0 && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-yellow-800">
                                No slot sets found for this branch. Please create slot sets first.
                              </p>
                              <p className="text-xs text-yellow-600 mt-1">
                                Go to Slot Sets section to create slot sets for this business and branch.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Table Selection (only shows after slot set is selected) */}
                  {formData.businessId && formData.branchId && formData.slotSetId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Table *
                      </label>
                      <select
                        required
                        value={formData.tableId}
                        onChange={(e) => {
                          setFormData({ ...formData, tableId: e.target.value });
                          setErrors({ ...errors, tableId: '' });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.tableId ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={tablesLoading}
                      >
                        <option value="">Select Table</option>
                        {tablesLoading ? (
                          <option value="" disabled>Loading tables...</option>
                        ) : tables.length === 0 ? (
                          <option value="" disabled>No tables available</option>
                        ) : (
                          tables.map(table => (
                            <option key={table._id} value={table._id}>
                              Table {table.tableNumber} ({table.seatingCapacity} seats)
                            </option>
                          ))
                        )}
                      </select>
                      {errors.tableId && (
                        <p className="mt-1 text-sm text-red-600">{errors.tableId}</p>
                      )}
                      {!tablesLoading && tables.length === 0 && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-yellow-800">
                                No tables found for this branch. Please create tables first.
                              </p>
                              <p className="text-xs text-yellow-600 mt-1">
                                Go to Tables section to create tables for this business and branch.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !formData.date || 
                        !formData.businessId || 
                        !formData.branchId || 
                        !formData.tableId || 
                        !formData.slotSetId ||
                        slotSetsLoading ||
                        tablesLoading
                      }
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingSchedule ? 'Update' : 'Create'} Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedules;