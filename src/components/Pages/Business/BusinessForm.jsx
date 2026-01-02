
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import axiosInstance from '../../../config/AxiosInstance';
// import { 
//   ArrowLeft, 
//   Loader, 
//   Upload,
//   MapPin,
//   X
// } from 'lucide-react';

// const BusinessForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);
  
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     address: {
//       plotNo: '',
//       street: '',
//       area: '',
//       city: '',
//       state: '',
//       pincode: ''
//     },
//     isActive: true,
//     requestStatus: 'pending',
//     categoryType: 'both'
//   });
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   useEffect(() => {
//     if (isEdit) {
//       fetchBusiness();
//     }
//   }, [id]);

//   const fetchBusiness = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/details/${id}`);
//       if (response.data.success) {
//         const business = response.data.data;
//         setFormData({
//           name: business.name,
//           description: business.description,
//           address: business.address,
//           isActive: business.isActive,
//           requestStatus: business.requestStatus,
//           categoryType: business.categoryType
//         });
//         setImagePreviews(business.images || []);
//       }
//     } catch (error) {
//       console.error('Error fetching business:', error);
//       alert('Failed to fetch business details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
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
//     setImages(prev => [...prev, ...files]);
    
//     // Create preview URLs
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(prev => [...prev, ...newPreviews]);
//   };

//   const removeImage = (index) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       setLoading(true);
      
//       const submitData = new FormData();
//       submitData.append('name', formData.name);
//       submitData.append('description', formData.description);
//       submitData.append('address', JSON.stringify(formData.address));
//       submitData.append('isActive', formData.isActive);
//       submitData.append('requestStatus', formData.requestStatus);
//       submitData.append('categoryType', formData.categoryType);
      
//       // Append images
//       images.forEach(image => {
//         submitData.append('images', image);
//       });

//       let response;
//       if (isEdit) {
//         response = await axiosInstance.put(`/details/${id}`, submitData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       } else {
//         response = await axiosInstance.post('/details', submitData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       }

//       if (response.data.success) {
//         alert(`Business ${isEdit ? 'updated' : 'created'} successfully`);
//         navigate('/businesses');
//       }
//     } catch (error) {
//       console.error('Error saving business:', error);
//       alert(`Failed to ${isEdit ? 'update' : 'create'} business`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && isEdit) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading business...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center space-x-4">
//             <Link
//               to="/businesses"
//               className="flex items-center text-gray-600 hover:text-gray-900"
//             >
//               <ArrowLeft className="h-5 w-5 mr-1" />
//               Back
//             </Link>
//             <h1 className="text-2xl font-bold text-gray-900">
//               {isEdit ? 'Edit Business' : 'Create New Business'}
//             </h1>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
//           <div className="space-y-6">
//             {/* Basic Information */}
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Business Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
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
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category Type
//                   </label>
//                   <select
//                     name="categoryType"
//                     value={formData.categoryType}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   >
//                     <option value="food">Food</option>
//                     <option value="table">Table</option>
//                     <option value="both">Both</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Request Status
//                   </label>
//                   <select
//                     name="requestStatus"
//                     value={formData.requestStatus}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Address Information */}
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                 <MapPin className="h-5 w-5 mr-2" />
//                 Address Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Plot No.
//                   </label>
//                   <input
//                     type="text"
//                     name="plotNo"
//                     value={formData.address.plotNo}
//                     onChange={handleAddressChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Area
//                   </label>
//                   <input
//                     type="text"
//                     name="area"
//                     value={formData.address.area}
//                     onChange={handleAddressChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     City *
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.address.city}
//                     onChange={handleAddressChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     State *
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.address.state}
//                     onChange={handleAddressChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Pincode *
//                   </label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={formData.address.pincode}
//                     onChange={handleAddressChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Images */}
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                 <div className="text-center">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="mt-4">
//                     <label htmlFor="images" className="cursor-pointer">
//                       <span className="mt-2 block text-sm font-medium text-gray-900">
//                         Upload images
//                       </span>
//                       <input
//                         id="images"
//                         name="images"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="sr-only"
//                       />
//                     </label>
//                     <p className="text-xs text-gray-500">
//                       PNG, JPG, GIF up to 10MB
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {imagePreviews.map((preview, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={preview.startsWith('blob:') ? preview : `http://localhost:5000/${preview}`}
//                         alt={`Preview ${index + 1}`}
//                         className="w-full h-32 object-cover rounded-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Status */}
//             <div className="flex items-center">
//               <input
//                 id="isActive"
//                 name="isActive"
//                 type="checkbox"
//                 checked={formData.isActive}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
//                 Active Business
//               </label>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//               <Link
//                 to="/businesses"
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </Link>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//               >
//                 {loading && <Loader className="h-4 w-4 animate-spin" />}
//                 <span>{isEdit ? 'Update Business' : 'Create Business'}</span>
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BusinessForm;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import { 
  ArrowLeft, 
  Loader, 
  Upload,
  MapPin,
  X,
  Building,
  Tag
} from 'lucide-react';

const BusinessForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      plotNo: '',
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: ''
    },
    isActive: true,
    requestStatus: 'pending',
    categoryType: 'Both',
    foodType: 'Veg'
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isEdit) {
      fetchBusiness();
    }
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/details/${id}`);
      if (response.data.success) {
        const business = response.data.data;
        setFormData({
          name: business.businessName,
          description: business.businessDescription
 || '',
          address: business.address || {
            plotNo: '',
            street: '',
            area: '',
            city: '',
            state: '',
            pincode: ''
          },
          isActive: business.businessActive,
          requestStatus: business.requestStatus || 'pending',
          categoryType: business.categoryType || 'Both',
          foodType: business.foodType || 'Veg'
        });
        setImagePreviews(business.fullImageUrls || business.businessImages
 || []);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      alert('Failed to fetch business details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('address', JSON.stringify(formData.address));
      submitData.append('isActive', formData.isActive);
      submitData.append('requestStatus', formData.requestStatus);
      submitData.append('categoryType', formData.categoryType);
      submitData.append('foodType', formData.foodType);
      
      // Append images
      images.forEach(image => {
        submitData.append('images', image);
      });

      let response;
      if (isEdit) {
        response = await axiosInstance.put(`/details/${id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axiosInstance.post('/details', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.success) {
        alert(`Business ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/businesses');
      }
    } catch (error) {
      console.error('Error saving business:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} business: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading business...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/businesses"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Business' : 'Create New Business'}
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter business name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your business..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Type
                  </label>
                  <select
                    name="categoryType"
                    value={formData.categoryType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Food">Food</option>
                    <option value="Table">Table</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Type
                  </label>
                  <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot No.
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
                    placeholder="Street name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.address.area}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Area/Locality"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    required
                    pattern="[0-9]{6}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Images</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload business images
                      </span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.startsWith('blob:') ? preview : preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Business
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/businesses"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading && <Loader className="h-4 w-4 animate-spin" />}
                <span>{isEdit ? 'Update Business' : 'Create Business'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;