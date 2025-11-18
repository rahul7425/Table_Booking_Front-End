// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axiosInstance from '../../../config/AxiosInstance';
// import { 
//   Eye, 
//   Edit, 
//   Loader, 
//   ArrowLeft,
//   Building,
//   MapPin,
//   Star,
//   Calendar,
//   Users,
//   Utensils,
//   Folder,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Image as ImageIcon
// } from 'lucide-react';

// const BusinessDetails = () => {
//   const { id } = useParams();
//   const [business, setBusiness] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchBusinessDetails();
//   }, [id]);

//   const fetchBusinessDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/details/${id}`);
//       if (response.data.success) {
//         setBusiness(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching business details:', error);
//       alert('Failed to fetch business details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
//       approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
//       rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
//     };
//     const config = statusConfig[status] || statusConfig.pending;
//     const Icon = config.icon;
    
//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
//         <Icon className="w-4 h-4 mr-1" />
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader className="h-6 w-6 animate-spin text-green-600" />
//           <span className="text-gray-600">Loading business details...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!business) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Building className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">Business not found</h3>
//           <Link
//             to="/businesses"
//             className="mt-4 inline-flex items-center text-green-600 hover:text-green-700"
//           >
//             <ArrowLeft className="h-4 w-4 mr-1" />
//             Back to businesses
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Link
//                 to="/businesses"
//                 className="flex items-center text-gray-600 hover:text-gray-900"
//               >
//                 <ArrowLeft className="h-5 w-5 mr-1" />
//                 Back
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
//                 <div className="flex items-center space-x-4 mt-2">
//                   {getStatusBadge(business.requestStatus)}
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                     business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {business.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                   <div className="flex items-center text-yellow-500">
//                     <Star className="h-4 w-4 fill-current" />
//                     <span className="ml-1 text-sm font-medium">
//                       {business.averageRating || 0} ({business.totalRatings || 0} reviews)
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <Link
//               to={`/businesses/edit/${business._id}`}
//               className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Edit className="h-5 w-5" />
//               <span>Edit Business</span>
//             </Link>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               {['overview', 'branches', 'menu', 'categories', 'tables', 'reviews'].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
//                     activeTab === tab
//                       ? 'border-green-500 text-green-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-white rounded-lg shadow">
//           {activeTab === 'overview' && <OverviewTab business={business} />}
//           {activeTab === 'branches' && <BranchesTab business={business} />}
//           {activeTab === 'menu' && <MenuTab business={business} />}
//           {activeTab === 'categories' && <CategoriesTab business={business} />}
//           {activeTab === 'tables' && <TablesTab business={business} />}
//           {activeTab === 'reviews' && <ReviewsTab business={business} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Tab Components
// const OverviewTab = ({ business }) => (
//   <div className="p-6">
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Business Images */}
//       <div className="lg:col-span-2">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {business.images && business.images.length > 0 ? (
//             business.images.map((image, index) => (
//               <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
//                 <img
//                   src={`http://localhost:5000/${image}`}
//                   alt={`${business.name} ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-8 text-gray-500">
//               <ImageIcon className="mx-auto h-12 w-12" />
//               <p className="mt-2">No images available</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Business Info */}
//       <div className="space-y-6">
//         <div>
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm font-medium text-gray-500">Description</label>
//               <p className="mt-1 text-gray-900">{business.description}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-500">Category Type</label>
//               <p className="mt-1 text-gray-900 capitalize">{business.categoryType}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-500">Commission</label>
//               <p className="mt-1 text-gray-900">{business.defaultCommissionPercentage}%</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-500">Created</label>
//               <p className="mt-1 text-gray-900">
//                 {new Date(business.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
//           <div className="space-y-2 text-gray-900">
//             <div className="flex items-center">
//               <MapPin className="h-4 w-4 mr-2 text-gray-400" />
//               <span>{business.address.plotNo}, {business.address.street}</span>
//             </div>
//             <div className="ml-6">
//               {business.address.area && <div>{business.address.area}</div>}
//               <div>{business.address.city}, {business.address.state}</div>
//               <div>{business.address.pincode}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const BranchesTab = ({ business }) => (
//   <div className="p-6">
//     <h3 className="text-lg font-medium text-gray-900 mb-4">Branches</h3>
//     {business.branches && business.branches.length > 0 ? (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {business.branches.map((branch) => (
//           <div key={branch._id} className="border border-gray-200 rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-2">{branch.name}</h4>
//             <p className="text-gray-600 text-sm mb-3">{branch.description}</p>
//             <div className="flex items-center text-gray-500 text-sm mb-3">
//               <MapPin className="h-4 w-4 mr-1" />
//               <span>{branch.address.street}, {branch.address.city}</span>
//             </div>
//             <div className="flex justify-between items-center text-sm">
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {branch.isActive ? 'Active' : 'Inactive'}
//               </span>
//               <span className="text-gray-500">
//                 {new Date(branch.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="text-center py-8 text-gray-500">
//         <Building className="mx-auto h-12 w-12" />
//         <p className="mt-2">No branches available</p>
//       </div>
//     )}
//   </div>
// );

// const MenuTab = ({ business }) => (
//   <div className="p-6">
//     <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Items</h3>
//     {business.menuItems && business.menuItems.length > 0 ? (
//       <div className="space-y-4">
//         {business.menuItems.map((item) => (
//           <div key={item._id} className="border border-gray-200 rounded-lg p-4">
//             <div className="flex justify-between items-start mb-2">
//               <h4 className="font-medium text-gray-900">{item.name}</h4>
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {item.isAvailable ? 'Available' : 'Unavailable'}
//               </span>
//             </div>
//             <p className="text-gray-600 text-sm mb-3">{item.description}</p>
//             <div className="flex justify-between items-center text-sm text-gray-500">
//               <span>Type: {item.type}</span>
//               <span>Category: {item.category}</span>
//               <span>Variants: {item.variants?.length || 0}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="text-center py-8 text-gray-500">
//         <Utensils className="mx-auto h-12 w-12" />
//         <p className="mt-2">No menu items available</p>
//       </div>
//     )}
//   </div>
// );

// const CategoriesTab = ({ business }) => (
//   <div className="p-6">
//     <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
//     {business.categories && business.categories.length > 0 ? (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {business.categories.map((category) => (
//           <div key={category._id} className="border border-gray-200 rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
//             <p className="text-gray-600 text-sm mb-3">{category.description}</p>
//             <div className="flex justify-between items-center text-sm">
//               <span className="text-gray-500 capitalize">{category.type}</span>
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {category.isActive ? 'Active' : 'Inactive'}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="text-center py-8 text-gray-500">
//         <Folder className="mx-auto h-12 w-12" />
//         <p className="mt-2">No categories available</p>
//       </div>
//     )}
//   </div>
// );

// const TablesTab = ({ business }) => (
//   <div className="p-6">
//     <h3 className="text-lg font-medium text-gray-900 mb-4">Tables</h3>
//     {business.tables && business.tables.length > 0 ? (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {business.tables.map((table) => (
//           <div key={table._id} className="border border-gray-200 rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-2">Table {table.tableNumber}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Category: {table.category}</div>
//               <div>Capacity: {table.seatingCapacity} people</div>
//               {table.price && <div>Price: ₹{table.price}</div>}
//             </div>
//             <div className="mt-3">
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 table.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {table.isAvailable ? 'Available' : 'Unavailable'}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="text-center py-8 text-gray-500">
//         <Users className="mx-auto h-12 w-12" />
//         <p className="mt-2">No tables available</p>
//       </div>
//     )}
//   </div>
// );

// const ReviewsTab = ({ business }) => (
//   <div className="p-6">
//     <h3 className="text-lg font-medium text-gray-900 mb-4">Reviews</h3>
//     {business.reviews && business.reviews.length > 0 ? (
//       <div className="space-y-4">
//         {business.reviews.map((review) => (
//           <div key={review._id} className="border border-gray-200 rounded-lg p-4">
//             <div className="flex justify-between items-start mb-2">
//               <div>
//                 <h4 className="font-medium text-gray-900">
//                   {review.userId?.email || 'Anonymous User'}
//                 </h4>
//                 <div className="flex items-center mt-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-4 w-4 ${
//                         i < review.rating
//                           ? 'text-yellow-400 fill-current'
//                           : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <span className="text-sm text-gray-500">
//                 {new Date(review.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//             <p className="text-gray-600 mt-2">{review.review}</p>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="text-center py-8 text-gray-500">
//         <Star className="mx-auto h-12 w-12" />
//         <p className="mt-2">No reviews available</p>
//       </div>
//     )}
//   </div>
// );

// export default BusinessDetails;





import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import { 
  Eye, 
  Edit, 
  Loader, 
  ArrowLeft,
  Building,
  MapPin,
  Star,
  Calendar,
  Users,
  Utensils,
  Folder,
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';

const BusinessDetails = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/details/${id}`);
      if (response.data.success) {
        setBusiness(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
      alert('Failed to fetch business details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading business details...</span>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Business not found</h3>
          <Link
            to="/businesses"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/businesses"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  {getStatusBadge(business.requestStatus)}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {business.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {business.averageRating || 0} ({business.totalRatings || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/businesses/${business._id}/branches`}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Building className="h-5 w-5" />
                <span>Manage Branches</span>
              </Link>
              <Link
                to={`/businesses/edit/${business._id}`}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit className="h-5 w-5" />
                <span>Edit Business</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'branches', 'menu', 'categories', 'tables', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && <OverviewTab business={business} />}
          {activeTab === 'branches' && <BranchesTab business={business} />}
          {activeTab === 'menu' && <MenuTab business={business} />}
          {activeTab === 'categories' && <CategoriesTab business={business} />}
          {activeTab === 'tables' && <TablesTab business={business} />}
          {activeTab === 'reviews' && <ReviewsTab business={business} />}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ business }) => (
  <div className="p-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Business Images */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {business.images && business.images.length > 0 ? (
            business.images.map((image, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:5000/${image}`}
                  alt={`${business.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12" />
              <p className="mt-2">No images available</p>
            </div>
          )}
        </div>
      </div>

      {/* Business Info */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-gray-900">{business.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Category Type</label>
              <p className="mt-1 text-gray-900 capitalize">{business.categoryType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Commission</label>
              <p className="mt-1 text-gray-900">{business.defaultCommissionPercentage}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="mt-1 text-gray-900">
                {new Date(business.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          <div className="space-y-2 text-gray-900">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{business.address.plotNo}, {business.address.street}</span>
            </div>
            <div className="ml-6">
              {business.address.area && <div>{business.address.area}</div>}
              <div>{business.address.city}, {business.address.state}</div>
              <div>{business.address.pincode}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BranchesTab = ({ business }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-900">Branches</h3>
      <Link
        to={`/businesses/${business._id}/branches`}
        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Building className="h-4 w-4" />
        <span>Manage Branches</span>
      </Link>
    </div>
    {business.branches && business.branches.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {business.branches.map((branch) => (
          <div key={branch._id} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{branch.name || business.name}</h4>
            <p className="text-gray-600 text-sm mb-3">{branch.description}</p>
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{branch.address.street}, {branch.address.city}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {branch.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-gray-500">
                {new Date(branch.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Building className="mx-auto h-12 w-12" />
        <p className="mt-2">No branches available</p>
        <Link
          to={`/businesses/${business._id}/branches`}
          className="mt-4 inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Building className="h-4 w-4" />
          <span>Add First Branch</span>
        </Link>
      </div>
    )}
  </div>
);

const MenuTab = ({ business }) => (
  <div className="p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Items</h3>
    {business.menuItems && business.menuItems.length > 0 ? (
      <div className="space-y-4">
        {business.menuItems.map((item) => (
          <div key={item._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Type: {item.type}</span>
              <span>Category: {item.category}</span>
              <span>Variants: {item.variants?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Utensils className="mx-auto h-12 w-12" />
        <p className="mt-2">No menu items available</p>
      </div>
    )}
  </div>
);

const CategoriesTab = ({ business }) => (
  <div className="p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
    {business.categories && business.categories.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {business.categories.map((category) => (
          <div key={category._id} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
            <p className="text-gray-600 text-sm mb-3">{category.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 capitalize">{category.type}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Folder className="mx-auto h-12 w-12" />
        <p className="mt-2">No categories available</p>
      </div>
    )}
  </div>
);

const TablesTab = ({ business }) => (
  <div className="p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Tables</h3>
    {business.tables && business.tables.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {business.tables.map((table) => (
          <div key={table._id} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Table {table.tableNumber}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Category: {table.category}</div>
              <div>Capacity: {table.seatingCapacity} people</div>
              {table.price && <div>Price: ₹{table.price}</div>}
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                table.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {table.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Users className="mx-auto h-12 w-12" />
        <p className="mt-2">No tables available</p>
      </div>
    )}
  </div>
);

const ReviewsTab = ({ business }) => (
  <div className="p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Reviews</h3>
    {business.reviews && business.reviews.length > 0 ? (
      <div className="space-y-4">
        {business.reviews.map((review) => (
          <div key={review._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">
                  {review.userId?.email || 'Anonymous User'}
                </h4>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{review.review}</p>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Star className="mx-auto h-12 w-12" />
        <p className="mt-2">No reviews available</p>
      </div>
    )}
  </div>
);

export default BusinessDetails;