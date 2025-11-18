// // components/Pages/Items/Category/Category.js
// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../../config/AxiosInstance';
// import { Plus, Edit, Trash2, Eye, Loader, Search, Filter } from 'lucide-react';

// const Category = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'Food',
//     description: '',
//     isActive: true,
//     businessId: '',
//     branchId: ''
//   });
//   const [businesses, setBusinesses] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');

//   useEffect(() => {
//     fetchCategories();
//     fetchBusinesses();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Category'
//       });
//       if (response.data.success) {
//         setCategories(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       alert('Failed to fetch categories');
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         model: 'Category',
//         ...formData
//       };

//       if (editingCategory) {
//         payload.id = editingCategory._id;
//         await axiosInstance.put('/business/update', payload);
//         alert('Category updated successfully');
//       } else {
//         await axiosInstance.post('/business/create', payload);
//         alert('Category created successfully');
//       }

//       setShowModal(false);
//       resetForm();
//       fetchCategories();
//     } catch (error) {
//       console.error('Error saving category:', error);
//       alert('Failed to save category');
//     }
//   };

//   const handleEdit = (category) => {
//     setEditingCategory(category);
//     setFormData({
//       name: category.name,
//       type: category.type,
//       description: category.description || '',
//       isActive: category.isActive,
//       businessId: category.businessId,
//       branchId: category.branchId || ''
//     });
//     if (category.businessId) {
//       fetchBranches(category.businessId);
//     }
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) return;

//     try {
//       await axiosInstance.delete('/business/delete', {
//         data: { model: 'Category', id }
//       });
//       alert('Category deleted successfully');
//       fetchCategories();
//     } catch (error) {
//       console.error('Error deleting category:', error);
//       alert('Failed to delete category');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       type: 'Food',
//       description: '',
//       isActive: true,
//       businessId: '',
//       branchId: ''
//     });
//     setEditingCategory(null);
//   };

//   const filteredCategories = categories.filter(category => {
//     const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          category.type.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterType === 'all' || category.type === filterType;
//     return matchesSearch && matchesFilter;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading categories...</span>
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
//             <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
//             <p className="text-gray-600 mt-2">
//               Manage your food and drink categories
//             </p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Plus className="h-5 w-5" />
//             <span>Add Category</span>
//           </button>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   type="text"
//                   placeholder="Search categories..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               >
//                 <option value="all">All Types</option>
//                 <option value="Food">Food</option>
//                 <option value="Drinks">Drinks</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCategories.map((category) => (
//             <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900 truncate">
//                     {category.name}
//                   </h3>
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                     category.type === 'Food' 
//                       ? 'bg-blue-100 text-blue-800'
//                       : 'bg-purple-100 text-purple-800'
//                   }`}>
//                     {category.type}
//                   </span>
//                 </div>
                
//                 {category.description && (
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {category.description}
//                   </p>
//                 )}

//                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                   <span className={`inline-flex items-center ${
//                     category.isActive ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     <div className={`w-2 h-2 rounded-full mr-2 ${
//                       category.isActive ? 'bg-green-500' : 'bg-red-500'
//                     }`} />
//                     {category.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                   <span>
//                     {new Date(category.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>

//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleEdit(category)}
//                     className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//                   >
//                     <Edit className="h-4 w-4" />
//                     <span>Edit</span>
//                   </button>
//                   <button
//                     onClick={() => handleDelete(category._id)}
//                     className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     <span>Delete</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredCategories.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-4">
//               <Filter className="h-12 w-12 mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
//             <p className="text-gray-500">Try adjusting your search or create a new category.</p>
//           </div>
//         )}

//         {/* Create/Edit Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {editingCategory ? 'Edit Category' : 'Create Category'}
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
//                       Category Name *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Type *
//                     </label>
//                     <select
//                       required
//                       value={formData.type}
//                       onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="Food">Food</option>
//                       <option value="Drinks">Drinks</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Business *
//                     </label>
//                     <select
//                       required
//                       value={formData.businessId}
//                       onChange={(e) => {
//                         setFormData({ ...formData, businessId: e.target.value, branchId: '' });
//                         fetchBranches(e.target.value);
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
//                       onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
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
//                       Description
//                     </label>
//                     <textarea
//                       value={formData.description}
//                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                       rows="3"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={formData.isActive}
//                       onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//                       className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                     />
//                     <label className="ml-2 text-sm text-gray-700">
//                       Active Category
//                     </label>
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
//                       {editingCategory ? 'Update' : 'Create'} Category
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

// export default Category;



// components/Pages/Items/Category/Category.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../config/AxiosInstance';
import { Plus, Edit, Trash2, Eye, Loader, Search, Filter, Building } from 'lucide-react';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Food',
    description: '',
    isActive: true,
    businessId: '',
    branchId: ''
  });
  const [businesses, setBusinesses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [businessLoading, setBusinessLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBusinesses();
  }, []);

  // Fetch categories from your existing API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/business/get-all', {
        model: 'Category'
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
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
        limit: 100 // Fetch all businesses
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        model: 'Category',
        ...formData
      };

      if (editingCategory) {
        payload.id = editingCategory._id;
        await axiosInstance.put('/business/update', payload);
        alert('Category updated successfully');
      } else {
        await axiosInstance.post('/business/create', payload);
        alert('Category created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      description: category.description || '',
      isActive: category.isActive,
      businessId: category.businessId,
      branchId: category.branchId || ''
    });
    if (category.businessId) {
      fetchBranches(category.businessId);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axiosInstance.delete('/business/delete', {
        data: { model: 'Category', id }
      });
      alert('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Food',
      description: '',
      isActive: true,
      businessId: '',
      branchId: ''
    });
    setEditingCategory(null);
    setBranches([]);
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || category.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Get business name by ID
  const getBusinessName = (businessId) => {
    const business = businesses.find(b => b._id === businessId);
    return business ? business.name : 'Unknown Business';
  };

  // Get branch name by ID
  const getBranchName = (branchId) => {
    if (!branchId) return 'All Branches';
    const branch = branches.find(b => b._id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading categories...</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">
              Manage your food and drink categories
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Food">Food</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {category.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    category.type === 'Food' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {category.type}
                  </span>
                </div>
                
                {category.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Business and Branch Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="truncate">{getBusinessName(category.businessId)}</span>
                  </div>
                  <div className="text-sm text-gray-500 ml-6">
                    {getBranchName(category.branchId)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className={`inline-flex items-center ${
                    category.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      category.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
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

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new category.</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Create Category'}
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
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Food">Food</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business *
                    </label>
                    <select
                      required
                      value={formData.businessId}
                      onChange={(e) => {
                        setFormData({ ...formData, businessId: e.target.value, branchId: '' });
                        fetchBranches(e.target.value);
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
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
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
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active Category
                    </label>
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
                      {editingCategory ? 'Update' : 'Create'} Category
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

export default Category;