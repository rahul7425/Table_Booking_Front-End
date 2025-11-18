// // components/Pages/Items/MenuItems/MenuItems.js
// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../../config/AxiosInstance';
// import { Plus, Edit, Trash2, Loader, Search, Filter, Tag } from 'lucide-react';

// const MenuItems = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [businesses, setBusinesses] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');

//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'food',
//     category: '',
//     subcategory: '',
//     description: '',
//     businessId: '',
//     branchId: '',
//     variants: [{ name: 'Regular', price: 0, isAvailable: true }],
//     complimentary: [],
//     isAvailable: true
//   });

//   useEffect(() => {
//     fetchItems();
//     fetchCategories();
//     fetchBusinesses();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Item'
//       });
//       if (response.data.success) {
//         setItems(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       alert('Failed to fetch menu items');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axiosInstance.post('/business/get-all', {
//         model: 'Category'
//       });
//       if (response.data.success) {
//         setCategories(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
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
//         model: 'Item',
//         ...formData
//       };

//       if (editingItem) {
//         payload.id = editingItem._id;
//         await axiosInstance.put('/business/update', payload);
//         alert('Menu item updated successfully');
//       } else {
//         await axiosInstance.post('/business/create', payload);
//         alert('Menu item created successfully');
//       }

//       setShowModal(false);
//       resetForm();
//       fetchItems();
//     } catch (error) {
//       console.error('Error saving menu item:', error);
//       alert('Failed to save menu item');
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setFormData({
//       name: item.name,
//       type: item.type,
//       category: item.category,
//       subcategory: item.subcategory || '',
//       description: item.description || '',
//       businessId: item.businessId,
//       branchId: item.branchId || '',
//       variants: item.variants.length > 0 ? item.variants : [{ name: 'Regular', price: 0, isAvailable: true }],
//       complimentary: item.complimentary || [],
//       isAvailable: item.isAvailable
//     });
//     if (item.businessId) {
//       fetchBranches(item.businessId);
//     }
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this menu item?')) return;

//     try {
//       await axiosInstance.delete('/business/delete', {
//         data: { model: 'Item', id }
//       });
//       alert('Menu item deleted successfully');
//       fetchItems();
//     } catch (error) {
//       console.error('Error deleting menu item:', error);
//       alert('Failed to delete menu item');
//     }
//   };

//   const addVariant = () => {
//     setFormData({
//       ...formData,
//       variants: [...formData.variants, { name: '', price: 0, isAvailable: true }]
//     });
//   };

//   const updateVariant = (index, field, value) => {
//     const updatedVariants = [...formData.variants];
//     updatedVariants[index][field] = value;
//     setFormData({ ...formData, variants: updatedVariants });
//   };

//   const removeVariant = (index) => {
//     const updatedVariants = formData.variants.filter((_, i) => i !== index);
//     setFormData({ ...formData, variants: updatedVariants });
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       type: 'food',
//       category: '',
//       subcategory: '',
//       description: '',
//       businessId: '',
//       branchId: '',
//       variants: [{ name: 'Regular', price: 0, isAvailable: true }],
//       complimentary: [],
//       isAvailable: true
//     });
//     setEditingItem(null);
//   };

//   const filteredItems = items.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterType === 'all' || item.type === filterType;
//     return matchesSearch && matchesFilter;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading menu items...</span>
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
//             <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
//             <p className="text-gray-600 mt-2">
//               Manage your food and drink menu items
//             </p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Plus className="h-5 w-5" />
//             <span>Add Item</span>
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
//                   placeholder="Search menu items..."
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
//                 <option value="food">Food</option>
//                 <option value="drink">Drinks</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Items Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredItems.map((item) => (
//             <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-3">
//                   <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
//                     {item.name}
//                   </h3>
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${
//                     item.type === 'food' 
//                       ? 'bg-orange-100 text-orange-800'
//                       : 'bg-blue-100 text-blue-800'
//                   }`}>
//                     {item.type}
//                   </span>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Tag className="h-4 w-4 mr-1" />
//                     <span>{item.category}</span>
//                     {item.subcategory && (
//                       <span className="ml-2 text-gray-400">• {item.subcategory}</span>
//                     )}
//                   </div>

//                   {item.description && (
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {item.description}
//                     </p>
//                   )}

//                   <div className="space-y-1">
//                     {item.variants.map((variant, index) => (
//                       <div key={index} className="flex justify-between text-sm">
//                         <span className={!variant.isAvailable ? 'text-gray-400 line-through' : 'text-gray-700'}>
//                           {variant.name}
//                         </span>
//                         <span className={!variant.isAvailable ? 'text-gray-400' : 'text-green-600 font-medium'}>
//                           ₹{variant.price}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                   <span className={`inline-flex items-center ${
//                     item.isAvailable ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     <div className={`w-2 h-2 rounded-full mr-2 ${
//                       item.isAvailable ? 'bg-green-500' : 'bg-red-500'
//                     }`} />
//                     {item.isAvailable ? 'Available' : 'Unavailable'}
//                   </span>
//                 </div>

//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleEdit(item)}
//                     className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//                   >
//                     <Edit className="h-4 w-4" />
//                     <span>Edit</span>
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id)}
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

//         {filteredItems.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-4">
//               <Filter className="h-12 w-12 mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
//             <p className="text-gray-500">Try adjusting your search or create a new menu item.</p>
//           </div>
//         )}

//         {/* Create/Edit Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {editingItem ? 'Edit Menu Item' : 'Create Menu Item'}
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
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Item Name *
//                       </label>
//                       <input
//                         type="text"
//                         required
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Type *
//                       </label>
//                       <select
//                         required
//                         value={formData.type}
//                         onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       >
//                         <option value="food">Food</option>
//                         <option value="drink">Drink</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Category *
//                       </label>
//                       <select
//                         required
//                         value={formData.category}
//                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       >
//                         <option value="">Select Category</option>
//                         {categories
//                           .filter(cat => cat.type === (formData.type === 'food' ? 'Food' : 'Drinks'))
//                           .map(category => (
//                             <option key={category._id} value={category.name}>
//                               {category.name}
//                             </option>
//                           ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Subcategory
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.subcategory}
//                         onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Business *
//                       </label>
//                       <select
//                         required
//                         value={formData.businessId}
//                         onChange={(e) => {
//                           setFormData({ ...formData, businessId: e.target.value, branchId: '' });
//                           fetchBranches(e.target.value);
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       >
//                         <option value="">Select Business</option>
//                         {businesses.map(business => (
//                           <option key={business._id} value={business._id}>
//                             {business.businessName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Branch (Optional)
//                       </label>
//                       <select
//                         value={formData.branchId}
//                         onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       >
//                         <option value="">All Branches</option>
//                         {branches.map(branch => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.branchName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
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

//                   {/* Variants Section */}
//                   <div>
//                     <div className="flex justify-between items-center mb-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Variants *
//                       </label>
//                       <button
//                         type="button"
//                         onClick={addVariant}
//                         className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
//                       >
//                         + Add Variant
//                       </button>
//                     </div>
//                     {formData.variants.map((variant, index) => (
//                       <div key={index} className="flex space-x-2 mb-2">
//                         <input
//                           type="text"
//                           placeholder="Variant name"
//                           value={variant.name}
//                           onChange={(e) => updateVariant(index, 'name', e.target.value)}
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         />
//                         <input
//                           type="number"
//                           placeholder="Price"
//                           value={variant.price}
//                           onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
//                           className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeVariant(index)}
//                           className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
//                           disabled={formData.variants.length === 1}
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={formData.isAvailable}
//                       onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
//                       className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                     />
//                     <label className="ml-2 text-sm text-gray-700">
//                       Available for ordering
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
//                       {editingItem ? 'Update' : 'Create'} Item
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

// export default MenuItems;




// components/Pages/Items/MenuItems/MenuItems.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../config/AxiosInstance';
import { Plus, Edit, Trash2, Loader, Search, Filter, Tag, Building } from 'lucide-react';

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [businessLoading, setBusinessLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'food',
    category: '',
    subcategory: '',
    description: '',
    businessId: '',
    branchId: '',
    variants: [{ name: 'Regular', price: 0, isAvailable: true }],
    complimentary: [],
    isAvailable: true
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchBusinesses();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/business/get-all', {
        model: 'Item'
      });
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.post('/business/get-all', {
        model: 'Category'
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        model: 'Item',
        ...formData
      };

      if (editingItem) {
        payload.id = editingItem._id;
        await axiosInstance.put('/business/update', payload);
        alert('Menu item updated successfully');
      } else {
        await axiosInstance.post('/business/create', payload);
        alert('Menu item created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      category: item.category,
      subcategory: item.subcategory || '',
      description: item.description || '',
      businessId: item.businessId,
      branchId: item.branchId || '',
      variants: item.variants.length > 0 ? item.variants : [{ name: 'Regular', price: 0, isAvailable: true }],
      complimentary: item.complimentary || [],
      isAvailable: item.isAvailable
    });
    if (item.businessId) {
      fetchBranches(item.businessId);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await axiosInstance.delete('/business/delete', {
        data: { model: 'Item', id }
      });
      alert('Menu item deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item');
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', price: 0, isAvailable: true }]
    });
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'food',
      category: '',
      subcategory: '',
      description: '',
      businessId: '',
      branchId: '',
      variants: [{ name: 'Regular', price: 0, isAvailable: true }],
      complimentary: [],
      isAvailable: true
    });
    setEditingItem(null);
    setBranches([]);
  };

  // Get business name by ID
  const getBusinessName = (businessId) => {
    const business = businesses.find(b => b._id === businessId);
    return business ? business.name : 'Unknown Business';
  };

  // Get branch name by ID
  const getBranchName = (branchId) => {
    if (!branchId) return 'All Branches';
    // Search through all businesses for the branch
    for (let business of businesses) {
      if (business.branches) {
        const branch = business.branches.find(b => b._id === branchId);
        if (branch) return branch.name;
      }
    }
    return 'Unknown Branch';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading menu items...</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-gray-600 mt-2">
              Manage your food and drink menu items
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
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
                  placeholder="Search menu items..."
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
                <option value="food">Food</option>
                <option value="drink">Drinks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                    {item.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${item.type === 'food'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    {item.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{item.category}</span>
                    {item.subcategory && (
                      <span className="ml-2 text-gray-400">• {item.subcategory}</span>
                    )}
                  </div>

                  {/* Business and Branch Info */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="h-4 w-4 mr-1" />
                    <span className="truncate">{getBusinessName(item.businessId)}</span>
                    <span className="mx-1">•</span>
                    <span>{getBranchName(item.branchId)}</span>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-1">
                    {item.variants.map((variant, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className={!variant.isAvailable ? 'text-gray-400 line-through' : 'text-gray-700'}>
                          {variant.name}
                        </span>
                        <span className={!variant.isAvailable ? 'text-gray-400' : 'text-green-600 font-medium'}>
                          ₹{variant.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className={`inline-flex items-center ${item.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new menu item.</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingItem ? 'Edit Menu Item' : 'Create Menu Item'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name *
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
                        <option value="food">Food</option>
                        <option value="drink">Drink</option>
                      </select>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories
                          .filter(cat => cat.type === (formData.type === 'food' ? 'Food' : 'Drinks'))
                          .map(category => (
                            <option key={category._id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Enter category (e.g., Starters)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        placeholder="Enter subcategory (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* Variants Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Variants *
                      </label>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        + Add Variant
                      </button>
                    </div>
                    {formData.variants.map((variant, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Variant name"
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          disabled={formData.variants.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Available for ordering
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
                      {editingItem ? 'Update' : 'Create'} Item
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

export default MenuItems;