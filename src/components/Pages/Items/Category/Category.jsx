
// // components/Pages/Items/Category/Category.js
// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../../config/AxiosInstance';
// import { Plus, Edit, Trash2, Eye, Loader, Search, Filter, Building } from 'lucide-react';

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
//   const [businessLoading, setBusinessLoading] = useState(false);

//   useEffect(() => {
//     fetchCategories();
//     fetchBusinesses();
//   }, []);

//   // Fetch categories from your existing API
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

//   // Fetch businesses from the new API
//   const fetchBusinesses = async () => {
//     try {
//       setBusinessLoading(true);
//       const response = await axiosInstance.post('/details/list', {
//         page: 1,
//         limit: 100 // Fetch all businesses
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
//     setBranches([]);
//   };

//   const filteredCategories = categories.filter(category => {
//     const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          category.type.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterType === 'all' || category.type === filterType;
//     return matchesSearch && matchesFilter;
//   });

//   // Get business name by ID
//   const getBusinessName = (businessId) => {
//     const business = businesses.find(b => b._id === businessId);
//     return business ? business.name : 'Unknown Business';
//   };

//   // Get branch name by ID
//   const getBranchName = (branchId) => {
//     if (!branchId) return 'All Branches';
//     const branch = branches.find(b => b._id === branchId);
//     return branch ? branch.name : 'Unknown Branch';
//   };

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
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
//                   <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                     {category.description}
//                   </p>
//                 )}

//                 {/* Business and Branch Info */}
//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Building className="h-4 w-4 mr-2" />
//                     <span className="truncate">{getBusinessName(category.businessId)}</span>
//                   </div>
//                   {/* <div className="text-sm text-gray-500 ml-6">
//                     {getBranchName(category.branchId)}
//                   </div> */}
//                 </div>

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
//                       onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
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




import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../config/AxiosInstance';
import { 
  Plus, Edit, Trash2, Eye, Loader, Search, Filter, Building, 
  Package, ChevronDown, ChevronUp, Tag, IndianRupee, X, 
  CheckCircle, List, DollarSign, Hash
} from 'lucide-react';

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
    branchId: '',
    image: null,        // NEW image file
    imagePreview: ""
  });
  const [businesses, setBusinesses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [businessLoading, setBusinessLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState({});
  const [itemsLoading, setItemsLoading] = useState({});

  // New state for item creation
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    dietaryType: 'Veg',
    subcategory: '',
    variants: [{ name: '', price: '', isAvailable: true }],
    isAvailable: true,
    isRecommended: false
  });

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

  // Fetch items for a specific category
  const fetchCategoryItems = async (categoryId) => {
    if (categoryItems[categoryId]) {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
      return;
    }

    try {
      setItemsLoading(prev => ({ ...prev, [categoryId]: true }));
      const response = await axiosInstance.post('/business/items-by-category', {
        categoryId
      });
      
      if (response.data.success) {
        setCategoryItems(prev => ({ ...prev, [categoryId]: response.data.data }));
        setExpandedCategory(categoryId);
      }
    } catch (error) {
      console.error('Error fetching category items:', error);
      alert('Failed to fetch items for this category');
    } finally {
      setItemsLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // Create new item
  const createItem = async () => {
    try {
      // Validate form
      if (!itemFormData.name.trim()) {
        alert('Item name is required');
        return;
      }

      if (!itemFormData.description.trim()) {
        alert('Description is required');
        return;
      }

      // Validate variants
      const validVariants = itemFormData.variants.filter(v => 
        v.name.trim() && !isNaN(v.price) && v.price > 0
      );

      if (validVariants.length === 0) {
        alert('At least one valid variant is required');
        return;
      }

      const payload = {
        model: 'Item',
        categoryId: currentCategoryId,
        ...itemFormData,
        variants: validVariants.map(variant => ({
          name: variant.name.trim(),
          price: Number(variant.price),
          isAvailable: variant.isAvailable
        }))
      };

      const response = await axiosInstance.post('/business/create', payload);
      
      if (response.data.success) {
        alert('Item created successfully!');
        
        // Refresh items for the category
        await fetchCategoryItems(currentCategoryId);
        
        // Reset and close modal
        setShowItemModal(false);
        resetItemForm();
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    }
  };

  // Item form handlers
  const handleAddVariant = () => {
    setItemFormData({
      ...itemFormData,
      variants: [...itemFormData.variants, { name: '', price: '', isAvailable: true }]
    });
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...itemFormData.variants];
    newVariants.splice(index, 1);
    setItemFormData({
      ...itemFormData,
      variants: newVariants
    });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...itemFormData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setItemFormData({
      ...itemFormData,
      variants: newVariants
    });
  };

  const resetItemForm = () => {
    setItemFormData({
      name: '',
      description: '',
      dietaryType: 'Veg',
      subcategory: '',
      variants: [{ name: '', price: '', isAvailable: true }],
      isAvailable: true,
      isRecommended: false
    });
    setCurrentCategoryId(null);
  };

  const openItemModal = (categoryId) => {
    setCurrentCategoryId(categoryId);
    setShowItemModal(true);
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
      const data = new FormData();

      data.append("model", "Category");
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("businessId", formData.businessId);
      data.append("branchId", formData.branchId);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);

      if (formData.image) {
        data.append("image", formData.image); // ✅ REAL FILE
      }

      if (editingCategory) {
        data.append("id", editingCategory._id);
        await axiosInstance.put("/business/update", data);
        alert("Category updated successfully");
      } else {
        await axiosInstance.post("/business/create", data);
        alert("Category created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
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
      branchId: category.branchId || '',
      image: category.image || null,  // Assuming fullImageUrl is the URL of the existing image
      imagePreview: category.fullImageUrl || "",
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
      branchId: '',
      image:  null,  // Assuming fullImageUrl is the URL of the existing image
      imagePreview: "",
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Selected image file: ", file);
    setFormData({
      ...formData,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };
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
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Category Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              category.type === 'Food' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {category.type}
                            </span>
                            <button
                              onClick={() => fetchCategoryItems(category._id)}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              {expandedCategory === category._id ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {category.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                            {category.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{getBusinessName(category.businessId)}</span>
                          </div>
                          <span className={`inline-flex items-center ${
                            category.isActive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              category.isActive ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => openItemModal(category._id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Items Section - Expandable */}
              {expandedCategory === category._id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-5 w-5 text-gray-600" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Items in this Category
                        </h4>
                        <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {categoryItems[category._id]?.length || 0} items
                        </span>
                      </div>
                      <button
                        onClick={() => openItemModal(category._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add New Item</span>
                      </button>
                    </div>

                    {itemsLoading[category._id] ? (
                      <div className="flex justify-center py-8">
                        <Loader className="h-6 w-6 animate-spin text-green-600" />
                      </div>
                    ) : categoryItems[category._id]?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryItems[category._id].map((item) => (
                          <div key={item._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.dietaryType === 'Veg' 
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {item.dietaryType}
                              </span>
                            </div>

                            {/* Variants */}
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-gray-500">Variants:</div>
                              {item.variants?.map((variant, index) => (
                                <div key={variant._id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">{variant.name}</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        variant.isAvailable 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {variant.isAvailable ? 'Available' : 'Not Available'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-green-700 font-semibold">
                                    <IndianRupee className="h-3 w-3" />
                                    <span>{variant.price}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                                  }`} />
                                  {item.isAvailable ? 'Available' : 'Not Available'}
                                </span>
                                {item.isRecommended && (
                                  <span className="text-yellow-600 font-medium">⭐ Recommended</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-3">
                          <Package className="h-12 w-12 mx-auto" />
                        </div>
                        <h5 className="text-gray-900 font-medium mb-1">No Items Found</h5>
                        <p className="text-gray-500 text-sm">This category doesn't have any items yet.</p>
                        <button
                          onClick={() => openItemModal(category._id)}
                          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add First Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
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

        {/* Create/Edit Category Modal */}
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

                <form onSubmit={handleSubmit} className="space-y-4" encType='multipart/form-data'>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Image
                    </label>

                    {formData.imagePreview && (
                      <div className="mb-2">
                        <img
                          src={formData.imagePreview}
                          alt="Category Preview"
                          className="h-24 w-24 object-cover rounded-lg border"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
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

        {/* Create Item Modal */}
        {showItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Item</h2>
                  <button
                    onClick={() => {
                      setShowItemModal(false);
                      resetItemForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={itemFormData.name}
                        onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                        placeholder="Enter item name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Type *
                      </label>
                      <select
                        value={itemFormData.dietaryType}
                        onChange={(e) => setItemFormData({ ...itemFormData, dietaryType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Veg">Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory (Optional)
                    </label>
                    <input
                      type="text"
                      value={itemFormData.subcategory}
                      onChange={(e) => setItemFormData({ ...itemFormData, subcategory: e.target.value })}
                      placeholder="e.g., Namkeen, Snacks, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={itemFormData.description}
                      onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                      rows="3"
                      placeholder="Enter item description"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Variants Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <List className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Variants *</h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Variant</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {itemFormData.variants.map((variant, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                            {itemFormData.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                              </label>
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                placeholder="e.g., Regular Bowl, Large Bowl"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price *
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <IndianRupee className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  step="1"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={variant.isAvailable}
                                onChange={(e) => handleVariantChange(index, 'isAvailable', e.target.checked)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <label className="text-sm text-gray-700">
                                Available
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={itemFormData.isAvailable}
                        onChange={(e) => setItemFormData({ ...itemFormData, isAvailable: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Item Available</label>
                        <p className="text-xs text-gray-500">Make this item available for ordering</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={itemFormData.isRecommended}
                        onChange={(e) => setItemFormData({ ...itemFormData, isRecommended: e.target.checked })}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Mark as Recommended</label>
                        <p className="text-xs text-gray-500">Show this as a recommended item</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowItemModal(false);
                        resetItemForm();
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={createItem}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Create Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;