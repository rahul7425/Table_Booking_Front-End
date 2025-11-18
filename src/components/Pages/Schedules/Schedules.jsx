// // components/Pages/Schedules/Schedules.js
// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance';
// import { Plus, Edit, Trash2, Loader, Search, Calendar, Clock } from 'lucide-react';

// const Schedules = () => {
//   const [schedules, setSchedules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingSchedule, setEditingSchedule] = useState(null);
//   const [businesses, setBusinesses] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [slots, setSlots] = useState([]);

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

//   const fetchBusinesses = async () => {
//     try {
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Business'
//       });
//       if (response.data.success) {
//         setBusinesses(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching businesses:', error);
//     }
//   };

//   const fetchBranches = async (businessId) => {
//     try {
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Branch',
//         businessId
//       });
//       if (response.data.success) {
//         setBranches(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching branches:', error);
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

//   const fetchSlots = async (businessId, branchId, tableId) => {
//     try {
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Slot',
//         businessId,
//         ...(branchId && { branchId }),
//         ...(tableId && { tableId })
//       });
//       if (response.data.success) {
//         setSlots(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching slots:', error);
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
//       businessId: schedule.businessId,
//       branchId: schedule.branchId || '',
//       tableId: schedule.tableId,
//       slotSetId: schedule.slotSetId
//     });

//     fetchBranches(schedule.businessId);
//     fetchTables(schedule.businessId, schedule.branchId);
//     fetchSlots(schedule.businessId, schedule.branchId, schedule.tableId);
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
//     setSlots([]);
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
//                         {schedule.businessId?.businessName || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {schedule.branchId?.branchName || 'All Branches'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         Table {schedule.tableId?.tableNumber || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {schedule.slotSetId?.slotSetName || 'N/A'}
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
//                         setFormData({ 
//                           ...formData, 
//                           businessId: e.target.value, 
//                           branchId: '',
//                           tableId: '',
//                           slotSetId: ''
//                         });
//                         fetchBranches(e.target.value);
//                         setTables([]);
//                         setSlots([]);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="">Select Business</option>
//                       {businesses.map(business => (
//                         <option key={business._id} value={business._id}>
//                           {business.businessName}
//                         </option>
//                       ))}
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
//                         setSlots([]);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="">All Branches</option>
//                       {branches.map(branch => (
//                         <option key={branch._id} value={branch._id}>
//                           {branch.branchName}
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
//                           tableId: e.target.value,
//                           slotSetId: ''
//                         });
//                         fetchSlots(formData.businessId, formData.branchId, e.target.value);
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
//                       disabled={!formData.tableId}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
//                     >
//                       <option value="">Select Slot Set</option>
//                       {slots.map(slot => (
//                         <option key={slot._id} value={slot._id}>
//                           {slot.slotSetName}
//                         </option>
//                       ))}
//                     </select>
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
//                       className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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


// components/Pages/Schedules/Schedules.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Plus, Edit, Trash2, Loader, Search, Calendar, Clock, Building } from 'lucide-react';

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

  const [formData, setFormData] = useState({
    date: '',
    businessId: '',
    branchId: '',
    tableId: '',
    slotSetId: ''
  });

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

  // Fetch businesses from the new API
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

  // Extract branches from selected business
  const fetchBranches = (businessId) => {
    const selectedBusiness = businesses.find(business => business._id === businessId);
    if (selectedBusiness && selectedBusiness.branches) {
      setBranches(selectedBusiness.branches);
    } else {
      setBranches([]);
    }
  };

  const fetchTables = async (businessId, branchId) => {
    try {
      const response = await axiosInstance.post('/business/get-all', {
        model: 'Table',
        businessId,
        ...(branchId && { branchId })
      });
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  // Fetch slot sets for the selected business
  const fetchSlotSets = async (businessId) => {
    try {
      setSlotSetsLoading(true);
      console.log('Fetching slot sets for business:', businessId);
      
      // Try different API endpoints
      let response;
      
      // First try the slots API
      try {
        response = await axiosInstance.get(`/slots/business/${businessId}`);
        console.log('Slot sets response:', response.data);
      } catch (slotError) {
        console.log('Slots API failed, trying business API:', slotError);
        // If slots API fails, try getting from business data
        response = await axiosInstance.post('/business/get-all', {
          model: 'Slot',
          businessId
        });
      }

      if (response.data) {
        // Handle different response formats
        if (Array.isArray(response.data)) {
          setSlotSets(response.data);
        } else if (response.data.success && Array.isArray(response.data.data)) {
          setSlotSets(response.data.data);
        } else {
          console.log('Unexpected slot sets response format:', response.data);
          setSlotSets([]);
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        model: 'Schedule',
        ...formData,
        date: new Date(formData.date).toISOString()
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
      alert('Failed to save schedule');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    const scheduleDate = new Date(schedule.date);
    const formattedDate = scheduleDate.toISOString().split('T')[0];
    
    setFormData({
      date: formattedDate,
      businessId: schedule.businessId?._id || schedule.businessId,
      branchId: schedule.branchId?._id || schedule.branchId || '',
      tableId: schedule.tableId?._id || schedule.tableId,
      slotSetId: schedule.slotSetId?._id || schedule.slotSetId || ''
    });

    if (schedule.businessId?._id || schedule.businessId) {
      const businessId = schedule.businessId?._id || schedule.businessId;
      fetchBranches(businessId);
      fetchTables(businessId, schedule.branchId?._id || schedule.branchId);
      fetchSlotSets(businessId);
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
  };

  // Get business name - handle both populated and non-populated data
  const getBusinessName = (businessData) => {
    if (!businessData) return 'N/A';
    if (typeof businessData === 'object' && businessData.name) {
      return businessData.name;
    }
    // If it's just an ID, try to find in businesses list
    const business = businesses.find(b => b._id === businessData);
    return business ? business.name : 'Unknown Business';
  };

  // Get branch name - handle both populated and non-populated data
  const getBranchName = (branchData) => {
    if (!branchData) return 'All Branches';
    if (typeof branchData === 'object' && branchData.name) {
      return branchData.name;
    }
    // If it's just an ID, try to find in branches list
    for (let business of businesses) {
      if (business.branches) {
        const branch = business.branches.find(b => b._id === branchData);
        if (branch) return branch.name;
      }
    }
    return 'Unknown Branch';
  };

  // Get table number - handle both populated and non-populated data
  const getTableNumber = (tableData) => {
    if (!tableData) return 'N/A';
    if (typeof tableData === 'object' && tableData.tableNumber) {
      return tableData.tableNumber;
    }
    // If it's just an ID, try to find in tables list
    const table = tables.find(t => t._id === tableData);
    return table ? table.tableNumber : 'Unknown Table';
  };

  // Get slot set name - handle both populated and non-populated data
  const getSlotSetName = (slotSetData) => {
    if (!slotSetData) return 'N/A';
    if (typeof slotSetData === 'object' && slotSetData.slotSetName) {
      return slotSetData.slotSetName;
    }
    // If it's just an ID, try to find in slotSets list
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
              Manage table booking schedules
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
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                        <p>No schedules found</p>
                        <p className="text-sm text-gray-400 mt-1">Create your first schedule to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr key={schedule._id} className="hover:bg-gray-50 transition-colors">
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
                        Table {getTableNumber(schedule.tableId)}
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business *
                    </label>
                    <select
                      required
                      value={formData.businessId}
                      onChange={(e) => {
                        const selectedBusinessId = e.target.value;
                        setFormData({ 
                          ...formData, 
                          businessId: selectedBusinessId, 
                          branchId: '',
                          tableId: '',
                          slotSetId: ''
                        });
                        fetchBranches(selectedBusinessId);
                        fetchSlotSets(selectedBusinessId);
                        setTables([]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch (Optional)
                    </label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          branchId: e.target.value,
                          tableId: '',
                          slotSetId: ''
                        });
                        fetchTables(formData.businessId, e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Branches</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Table *
                    </label>
                    <select
                      required
                      value={formData.tableId}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          tableId: e.target.value
                        });
                      }}
                      disabled={!formData.businessId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select Table</option>
                      {tables.map(table => (
                        <option key={table._id} value={table._id}>
                          Table {table.tableNumber} ({table.seatingCapacity} seats)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slot Set *
                    </label>
                    <select
                      required
                      value={formData.slotSetId}
                      onChange={(e) => setFormData({ ...formData, slotSetId: e.target.value })}
                      disabled={!formData.businessId || slotSetsLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select Slot Set</option>
                      {slotSetsLoading ? (
                        <option value="" disabled>Loading slot sets...</option>
                      ) : (
                        slotSets.map(slotSet => (
                          <option key={slotSet._id} value={slotSet._id}>
                            {slotSet.slotSetName}
                          </option>
                        ))
                      )}
                    </select>
                    {slotSets.length === 0 && formData.businessId && !slotSetsLoading && (
                      <p className="text-sm text-red-600 mt-1">
                        No slot sets found for this business. Please create slot sets first.
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.slotSetId}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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