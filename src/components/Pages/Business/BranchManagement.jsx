
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axiosInstance from '../../../config/AxiosInstance';
// import { 
//   ArrowLeft, 
//   Loader, 
//   Plus, 
//   X,
//   Upload,
//   MapPin,
//   Trash2,
//   Edit
// } from 'lucide-react';

// const BranchManagement = () => {
//   const { businessId } = useParams();
//   const [business, setBusiness] = useState(null);
//   const [branches, setBranches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formData, setFormData] = useState({
//     description: '',
//     address: { street: '', city: '', state: '' }
//   });
//   const [branchImages, setBranchImages] = useState([]);

//   useEffect(() => {
//     fetchBusinessDetails();
//   }, [businessId]);

//   const fetchBusinessDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/details/${businessId}`);
//       if (response.data.success) {
//         setBusiness(response.data.data);
//         setBranches(response.data.data.branches || []);
//       }
//     } catch (error) {
//       console.error('Error fetching business details:', error);
//       alert('Failed to fetch business details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       address: {
//         ...prev.address,
//         [name]: value
//       }
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setBranchImages(files);
//   };

//   const addBranch = async (e) => {
//     e.preventDefault();

//     try {
//       const submitData = new FormData();
//       submitData.append('description', formData.description);
//       submitData.append('address', JSON.stringify(formData.address));

//       // Append images
//       branchImages.forEach(image => {
//         submitData.append('images', image);
//       });

//       const response = await axiosInstance.post(`/details/${businessId}/branches`, submitData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         alert('Branch added successfully');
//         setShowAddForm(false);
//         setFormData({ description: '', address: { street: '', city: '', state: '' } });
//         setBranchImages([]);
//         fetchBusinessDetails(); // Refresh branches list
//       }
//     } catch (error) {
//       console.error('Error adding branch:', error);
//       alert('Failed to add branch');
//     }
//   };

//   const deleteBranch = async (branchId) => {
//     if (!window.confirm('Are you sure you want to delete this branch?')) {
//       return;
//     }

//     try {
//       // Note: You'll need to implement branch deletion in your backend
//       // For now, this is a placeholder
//       alert('Branch deletion functionality to be implemented');
//     } catch (error) {
//       console.error('Error deleting branch:', error);
//       alert('Failed to delete branch');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading branches...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Link
//                 to="/businesses"
//                 className="flex items-center text-gray-600 hover:text-gray-900"
//               >
//                 <ArrowLeft className="h-5 w-5 mr-1" />
//                 Back to Businesses
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">{business?.name} - Branches</h1>
//                 <p className="text-gray-600 mt-1">Manage branches for this business</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowAddForm(true)}
//               className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Plus className="h-5 w-5" />
//               <span>Add Branch</span>
//             </button>
//           </div>
//         </div>

//         {/* Add Branch Form */}
//         {showAddForm && (
//           <div className="bg-white rounded-lg shadow p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Add New Branch</h3>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <form onSubmit={addBranch} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Branch description..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Street
//                   </label>
//                   <input
//                     type="text"
//                     name="street"
//                     value={formData.address.street}
//                     onChange={handleAddressChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Street address"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.address.city}
//                     onChange={handleAddressChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="City"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     State
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.address.state}
//                     onChange={handleAddressChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="State"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Branch Images
//                   </label>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddForm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   Add Branch
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Branches List */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Branches ({branches.length})
//             </h3>

//             {branches.length === 0 ? (
//               <div className="text-center py-8">
//                 <MapPin className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No branches</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Get started by adding your first branch.
//                 </p>
//                 <button
//                   onClick={() => setShowAddForm(true)}
//                   className="mt-4 flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   <Plus className="h-4 w-4" />
//                   <span>Add First Branch</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {branches.map((branch) => (
//                   <div key={branch._id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex justify-between items-start mb-3">
//                       <h4 className="font-medium text-gray-900">
//                         {branch.name || business?.name}
//                       </h4>
//                       {/* <div className="flex space-x-2">
//                         <button className="text-blue-600 hover:text-blue-700">
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button 
//                           onClick={() => deleteBranch(branch._id)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div> */}
//                     </div>

//                     <p className="text-gray-600 text-sm mb-3">{branch.description}</p>

//                     <div className="flex items-center text-gray-500 text-sm mb-3">
//                       <MapPin className="h-4 w-4 mr-1" />
//                       <span>
//                         {branch.address.street}, {branch.address.city}, {branch.address.state}
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center text-sm">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {branch.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                       <span className="text-gray-500">
//                         {new Date(branch.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BranchManagement;





import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import {
  ArrowLeft,
  Loader,
  Plus,
  X,
  Upload,
  MapPin,
  Trash2,
  Edit
} from 'lucide-react';

const BranchManagement = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    address: { plotNo: '', street: '', city: '', state: '', pincode: '' }
  });
  const [branchImages, setBranchImages] = useState([]);

  useEffect(() => {
    fetchBusinessDetails();
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/details/${businessId}`);
      if (response.data.success) {
        setBusiness(response.data.data);
        setBranches(response.data.data.branches || []);
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
      alert('Failed to fetch business details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setBranchImages(files);
  };

  const addBranch = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('description', formData.description);
      submitData.append('address', JSON.stringify(formData.address));

      // Append images
      branchImages.forEach(image => {
        submitData.append('images', image);
      });

      const response = await axiosInstance.post(`/details/${businessId}/branches`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Branch added successfully');
        setShowAddForm(false);
        setFormData({ description: '', address: { plotNo: '', street: '', city: '', state: '', pincode: '' } });
        setBranchImages([]);
        fetchBusinessDetails(); // Refresh branches list
      }
    } catch (error) {
      console.error('Error adding branch:', error);
      alert('Failed to add branch');
    }
  };

  const updateBranch = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        plotNo: formData.address.plotNo,
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode
      };

      const response = await axiosInstance.put(
        `/details/${businessId}/branches/${editingBranch._id}`,
        updateData
      );

      if (response.data.success) {
        alert('Branch updated successfully');
        setEditingBranch(null);
        setFormData({ description: '', address: { plotNo: '', street: '', city: '', state: '', pincode: '' } });
        setBranchImages([]);
        fetchBusinessDetails(); // Refresh branches list
      }
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Failed to update branch');
    }
  };

  const startEditing = (branch) => {
    setEditingBranch(branch);
    setFormData({
      description: branch.description || '',
      address: {
        plotNo: branch.address?.plotNo || '',
        street: branch.address?.street || '',
        city: branch.address?.city || '',
        state: branch.address?.state || '',
        pincode: branch.address?.pincode || ''
      }
    });
  };

  const cancelEditing = () => {
    setEditingBranch(null);
    setFormData({ description: '', address: { plotNo: '', street: '', city: '', state: '', pincode: '' } });
    setBranchImages([]);
  };

  const deleteBranch = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) {
      return;
    }

    try {
      // Note: You'll need to implement branch deletion in your backend
      // For now, this is a placeholder
      alert('Branch deletion functionality to be implemented');
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Failed to delete branch');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading branches...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/businesses"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Businesses
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{business?.name} - Branches</h1>
                <p className="text-gray-600 mt-1">Manage branches for this business</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Branch</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Branch Form */}
        {(showAddForm || editingBranch) && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </h3>
              <button
                onClick={editingBranch ? cancelEditing : () => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={editingBranch ? updateBranch : addBranch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Branch description..."
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot No
                  </label>
                  <input
                    type="text"
                    name="plotNo"
                    value={formData.address.plotNo}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Plot number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Pincode"
                  />
                </div>
                {!editingBranch && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={editingBranch ? cancelEditing : () => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingBranch ? 'Update Branch' : 'Add Branch'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Branches List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Branches ({branches.length})
            </h3>

            {branches.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No branches</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first branch.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add First Branch</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch) => (
                  <div key={branch._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">
                        {branch.name || business?.name}
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(branch)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {/* <button 
                          onClick={() => deleteBranch(branch._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button> */}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{branch.description}</p>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {branch.address?.plotNo && (
                        <div>Plot No: {branch.address.plotNo}</div>
                      )}
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>
                          {branch.address.street}, {branch.address.city}, {branch.address.state} - {branch.address.pincode}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500">
                        {new Date(branch.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchManagement;