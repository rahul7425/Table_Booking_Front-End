// components/Pages/Slots/SlotSets.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { Plus, Edit, Trash2, Loader, Clock, Building, X, ChevronDown, ChevronUp } from 'lucide-react';

const SlotSets = () => {
  const [slotSets, setSlotSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlotSet, setEditingSlotSet] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  const [expandedDays, setExpandedDays] = useState({});

  const [formData, setFormData] = useState({
    slotSetName: '',
    businessId: '',
    branchId: '',
    tableId: '',
    monday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
    tuesday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
    wednesday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
    thursday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
    friday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
    saturday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
    sunday: { isOpen: true, times: [{ time: '', isAvailable: true }] }
  });

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
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
      setTables([]);
    }
  };

  const fetchSlotSets = async (businessId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/slots/business/${businessId}`);
      setSlotSets(response.data);
    } catch (error) {
      console.error('Error fetching slot sets:', error);
      setSlotSets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessChange = (businessId) => {
    setFormData({ 
      ...formData, 
      businessId,
      branchId: '',
      tableId: ''
    });
    fetchBranches(businessId);
    setTables([]);
    if (businessId) {
      fetchSlotSets(businessId);
    } else {
      setSlotSets([]);
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId) => {
    setFormData({ 
      ...formData, 
      branchId,
      tableId: ''
    });
    fetchTables(formData.businessId, branchId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.slotSetName.trim()) {
      alert('Please enter a slot set name');
      return;
    }

    if (!formData.businessId) {
      alert('Please select a business');
      return;
    }

    // Validate time slots
    for (const day of days) {
      const dayData = formData[day.key];
      if (dayData.isOpen) {
        const validTimes = dayData.times.filter(timeSlot => timeSlot.time.trim() !== '');
        if (validTimes.length === 0) {
          alert(`Please add at least one time slot for ${day.label}`);
          return;
        }
      }
    }

    try {
      if (editingSlotSet) {
        await axiosInstance.put(`/slots/${editingSlotSet._id}`, formData);
        alert('Slot set updated successfully');
      } else {
        await axiosInstance.post('/slots', formData);
        alert('Slot set created successfully');
      }
      setShowModal(false);
      resetForm();
      if (formData.businessId) {
        fetchSlotSets(formData.businessId);
      }
    } catch (error) {
      console.error('Error saving slot set:', error);
      alert('Failed to save slot set');
    }
  };

  const handleEdit = (slotSet) => {
    setEditingSlotSet(slotSet);
    setFormData({
      slotSetName: slotSet.slotSetName,
      businessId: slotSet.businessId,
      branchId: slotSet.branchId || '',
      tableId: slotSet.tableId || '',
      monday: slotSet.monday || { isOpen: true, times: [{ time: '', isAvailable: true }] },
      tuesday: slotSet.tuesday || { isOpen: true, times: [{ time: '', isAvailable: true }] },
      wednesday: slotSet.wednesday || { isOpen: true, times: [{ time: '', isAvailable: true }] },
      thursday: slotSet.thursday || { isOpen: true, times: [{ time: '', isAvailable: true }] },
      friday: slotSet.friday || { isOpen: true, times: [{ time: '', isAvailable: true }] },
      saturday: slotSet.saturday || { isOpen: true, times: [{ time: '', isAvailable: true }] },
      sunday: slotSet.sunday || { isOpen: true, times: [{ time: '', isAvailable: true }] }
    });
    
    // Fetch branches and tables for the business
    fetchBranches(slotSet.businessId);
    fetchTables(slotSet.businessId, slotSet.branchId);
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot set?')) return;

    try {
      await axiosInstance.delete(`/slots/${id}`);
      alert('Slot set deleted successfully');
      if (formData.businessId) {
        fetchSlotSets(formData.businessId);
      }
    } catch (error) {
      console.error('Error deleting slot set:', error);
      alert('Failed to delete slot set');
    }
  };

  const resetForm = () => {
    setFormData({
      slotSetName: '',
      businessId: '',
      branchId: '',
      tableId: '',
      monday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
      tuesday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
      wednesday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
      thursday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
      friday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
      saturday: { isOpen: true, times: [{ time: '', isAvailable: true }] },
      sunday: { isOpen: true, times: [{ time: '', isAvailable: true }] }
    });
    setEditingSlotSet(null);
    setBranches([]);
    setTables([]);
    setExpandedDays({});
  };

  const addTimeSlot = (day) => {
    const updatedDay = { ...formData[day] };
    updatedDay.times = [...updatedDay.times, { time: '', isAvailable: true }];
    setFormData({ ...formData, [day]: updatedDay });
  };

  const updateTimeSlot = (day, index, field, value) => {
    const updatedDay = { ...formData[day] };
    updatedDay.times[index][field] = value;
    setFormData({ ...formData, [day]: updatedDay });
  };

  const removeTimeSlot = (day, index) => {
    const updatedDay = { ...formData[day] };
    updatedDay.times = updatedDay.times.filter((_, i) => i !== index);
    setFormData({ ...formData, [day]: updatedDay });
  };

  const toggleDayOpen = (day) => {
    const updatedDay = { ...formData[day], isOpen: !formData[day].isOpen };
    setFormData({ ...formData, [day]: updatedDay });
  };

  const toggleDayExpansion = (day) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const getBusinessName = (businessId) => {
    const business = businesses.find(b => b._id === businessId);
    return business ? business.name : 'Unknown Business';
  };

  const getBranchName = (branchId) => {
    if (!branchId) return 'All Branches';
    for (let business of businesses) {
      if (business.branches) {
        const branch = business.branches.find(b => b._id === branchId);
        if (branch) return branch.name;
      }
    }
    return 'Unknown Branch';
  };

  const getTableNumber = (tableId) => {
    if (!tableId) return 'All Tables';
    const table = tables.find(t => t._id === tableId);
    return table ? `Table ${table.tableNumber}` : 'Unknown Table';
  };

  const formatTimeSlots = (slotSet) => {
    const dayInfo = days.map(day => {
      const dayData = slotSet[day.key];
      if (!dayData || !dayData.isOpen || !dayData.times || dayData.times.length === 0) {
        return null;
      }
      const times = dayData.times.map(t => t.time).join(', ');
      return `${day.label}: ${times}`;
    }).filter(Boolean);

    return dayInfo.length > 0 ? dayInfo.slice(0, 2).join(' | ') : 'No time slots configured';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Slot Sets</h1>
            <p className="text-gray-600 mt-2">Manage time slots for scheduling</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Slot Set</span>
          </button>
        </div>

        {/* Business Selection */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Business to View Slot Sets
          </label>
          <select
            value={formData.businessId}
            onChange={(e) => handleBusinessChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Business</option>
            {businesses.map(business => (
              <option key={business._id} value={business._id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading slot sets...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slotSets.map((slotSet) => (
              <div key={slotSet._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {slotSet.slotSetName}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      slotSet.tableId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slotSet.tableId ? 'Table Specific' : 'General'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="font-medium">{getBusinessName(slotSet.businessId)}</span>
                    </div>
                    {slotSet.branchId && (
                      <div className="ml-6">
                        <span className="font-medium">Branch:</span> {getBranchName(slotSet.branchId)}
                      </div>
                    )}
                    {slotSet.tableId && (
                      <div className="ml-6">
                        <span className="font-medium">Table:</span> {getTableNumber(slotSet.tableId)}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    {formatTimeSlots(slotSet)}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(slotSet)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(slotSet._id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {slotSets.length === 0 && formData.businessId && !loading && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No slot sets found</h3>
            <p className="text-gray-500">Create your first slot set for this business.</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingSlotSet ? 'Edit Slot Set' : 'Create Slot Set'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slot Set Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slotSetName}
                        onChange={(e) => setFormData({ ...formData, slotSetName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Standard Hours, Weekend Special"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business *
                      </label>
                      <select
                        required
                        value={formData.businessId}
                        onChange={(e) => handleBusinessChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Business</option>
                        {businesses.map(business => (
                          <option key={business._id} value={business._id}>
                            {business.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch (Optional)
                      </label>
                      <select
                        value={formData.branchId}
                        onChange={(e) => handleBranchChange(e.target.value)}
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
                        Table (Optional)
                      </label>
                      <select
                        value={formData.tableId}
                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">All Tables</option>
                        {tables.map(table => (
                          <option key={table._id} value={table._id}>
                            Table {table.tableNumber} ({table.seatingCapacity} seats)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Day-wise Time Slots */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Time Slots</h3>
                    <div className="space-y-3">
                      {days.map(({ key, label }) => (
                        <div key={key} className="border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between p-4 bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={formData[key].isOpen}
                                onChange={() => toggleDayOpen(key)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="font-medium text-gray-900">{label}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                formData[key].isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {formData[key].isOpen ? 'Open' : 'Closed'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleDayExpansion(key)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedDays[key] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>
                          </div>

                          {formData[key].isOpen && expandedDays[key] && (
                            <div className="p-4 border-t border-gray-200">
                              <div className="space-y-3">
                                {formData[key].times.map((timeSlot, index) => (
                                  <div key={index} className="flex items-center space-x-3">
                                    <input
                                      type="text"
                                      placeholder="e.g., 9:00 AM, 2:30 PM"
                                      value={timeSlot.time}
                                      onChange={(e) => updateTimeSlot(key, index, 'time', e.target.value)}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <label className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={timeSlot.isAvailable}
                                        onChange={(e) => updateTimeSlot(key, index, 'isAvailable', e.target.checked)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                      />
                                      <span className="text-sm text-gray-700">Available</span>
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeTimeSlot(key, index)}
                                      disabled={formData[key].times.length === 1}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addTimeSlot(key)}
                                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                  + Add Time Slot
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingSlotSet ? 'Update' : 'Create'} Slot Set
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

export default SlotSets;