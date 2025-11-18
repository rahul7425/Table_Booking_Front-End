// import React, { useState, useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axiosInstance from '../../../config/AxiosInstance';

// const CouponManagement = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [selectedCoupon, setSelectedCoupon] = useState(null);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [vendorInfo, setVendorInfo] = useState(null);

//   const [newCoupon, setNewCoupon] = useState({
//     discountType: 'percent',
//     discountValue: '',
//     code: '',
//     expiryDate: '',
//     minOrderValue: '',
//     maxUsePerDay: '',
//     image: null
//   });

//   // Inline Styles
//   const styles = {
//     container: { padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
//     header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' },
//     title: { color: '#333', margin: 0, fontSize: '28px', fontWeight: 'bold' },
//     vendorInfo: { backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c8e6c9' },
//     vendorText: { margin: '5px 0', color: '#2e7d32', fontSize: '14px' },
//     btn: { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s ease', margin: '5px' },
//     btnPrimary: { backgroundColor: '#007bff', color: 'white' },
//     btnSuccess: { backgroundColor: '#28a745', color: 'white' },
//     btnDanger: { backgroundColor: '#dc3545', color: 'white' },
//     btnSecondary: { backgroundColor: '#6c757d', color: 'white' },
//     input: { padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', width: '100%', marginBottom: '10px' },
//     label: { marginBottom: '5px', fontWeight: '600', color: '#495057', display: 'block' },
//     createForm: { background: '#f8f9fa', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' },
//     formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
//     formGroup: { display: 'flex', flexDirection: 'column' },
//     fullWidth: { gridColumn: '1 / -1' },
//     formActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
//     tableContainer: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', overflow: 'hidden' },
//     tableTitle: { padding: '20px', margin: 0, background: '#f8f9fa', borderBottom: '1px solid #dee2e6', color: '#495057' },
//     table: { width: '100%', borderCollapse: 'collapse' },
//     tableHeader: { padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', backgroundColor: '#f8f9fa', fontWeight: 600, color: '#495057' },
//     tableCell: { padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' },
//     status: { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 },
//     statusActive: { backgroundColor: '#d4edda', color: '#155724' },
//     statusInactive: { backgroundColor: '#f8d7da', color: '#721c24' },
//     actions: { display: 'flex', gap: '5px' },
//     modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
//     modalContent: { background: 'white', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' },
//     modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #dee2e6' },
//     closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6c757d' },
//     couponDetails: { padding: '20px' },
//     detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8f9fa' },
//     usageHistory: { marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e9ecef' },
//     usageItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8f9fa' },
//     modalActions: { padding: '20px', borderTop: '1px solid #dee2e6', display: 'flex', gap: '10px', justifyContent: 'flex-end' },
//     loading: { textAlign: 'center', padding: '40px', color: '#6c757d', fontSize: '16px' },
//     stats: { display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' },
//     statCard: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minWidth: '120px', textAlign: 'center' },
//     statValue: { fontSize: '24px', fontWeight: 'bold', color: '#007bff' },
//     statLabel: { fontSize: '12px', color: '#6c757d', marginTop: '5px' }
//   };

//   // Extract vendor info from token
//   const getVendorInfoFromToken = () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('No token found. Please login again.');
//         return null;
//       }

//       // Decode JWT token to get vendor info
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return {
//         id: payload.id,
//         business_id: payload.business_id, // Assuming business_id is stored in token
//         role: payload.role
//       };
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       toast.error('Invalid token. Please login again.');
//       return null;
//     }
//   };

//   // Fetch all coupons for vendor's business
//   const fetchCoupons = async () => {
//     const vendor = getVendorInfoFromToken();
//     if (!vendor || !vendor.business_id) {
//       toast.error('Vendor business information not found in token');
//       return;
//     }

//     setVendorInfo(vendor);
//     setLoading(true);
    
//     try {
//       const response = await axiosInstance.get(`/coupon/business/${vendor.business_id}`);
//       setCoupons(response.data);
//       toast.success(`Loaded ${response.data.length} coupons for your business`);
//     } catch (error) {
//       toast.error('Error loading coupons: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch coupon details by ID
//   const fetchCouponDetails = async (couponId) => {
//     try {
//       const response = await axiosInstance.get(`/coupon/details/${couponId}`);
//       setSelectedCoupon(response.data);
//       toast.success('Coupon details loaded!');
//     } catch (error) {
//       toast.error('Error loading coupon details: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Create new coupon
//   const createCoupon = async (e) => {
//     e.preventDefault();
    
//     const vendor = getVendorInfoFromToken();
//     if (!vendor || !vendor.business_id) {
//       toast.error('Vendor business information not found');
//       return;
//     }

//     setLoading(true);
    
//     const formData = new FormData();
//     formData.append('business_id', vendor.business_id);
//     Object.keys(newCoupon).forEach(key => {
//       if (key === 'image' && newCoupon[key]) {
//         formData.append('image', newCoupon[key]);
//       } else if (newCoupon[key] !== null && newCoupon[key] !== '') {
//         formData.append(key, newCoupon[key]);
//       }
//     });

//     try {
//       const response = await axiosInstance.post('/coupon/create', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       toast.success('Coupon created successfully!');
//       setShowCreateForm(false);
//       setNewCoupon({
//         discountType: 'percent',
//         discountValue: '',
//         code: '',
//         expiryDate: '',
//         minOrderValue: '',
//         maxUsePerDay: '',
//         image: null
//       });
//       fetchCoupons(); // Refresh the list
//     } catch (error) {
//       toast.error('Error creating coupon: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete coupon
//   const deleteCoupon = async (couponId) => {
//     if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
//     try {
//       await axiosInstance.delete(`/coupon/delete/${couponId}`);
//       toast.success('Coupon deleted successfully!');
//       fetchCoupons(); // Refresh the list
//       if (selectedCoupon && selectedCoupon._id === couponId) {
//         setSelectedCoupon(null);
//       }
//     } catch (error) {
//       toast.error('Error deleting coupon: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // Handle input changes for create form
//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'image') {
//       setNewCoupon(prev => ({ ...prev, image: files[0] }));
//     } else {
//       setNewCoupon(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // Calculate statistics
//   const getStats = () => {
//     const totalCoupons = coupons.length;
//     const activeCoupons = coupons.filter(c => c.isActive).length;
//     const totalUsage = coupons.reduce((sum, coupon) => sum + coupon.totalUsedCount, 0);
    
//     return { totalCoupons, activeCoupons, totalUsage };
//   };

//   useEffect(() => {
//     // Auto-load coupons when component mounts
//     fetchCoupons();
//   }, []);

//   const stats = getStats();

//   return (
//     <div style={styles.container}>
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <div style={styles.header}>
//         <h1 style={styles.title}>My Coupons</h1>
//         <button 
//           style={{...styles.btn, ...styles.btnPrimary}}
//           onClick={() => setShowCreateForm(!showCreateForm)}
//         >
//           {showCreateForm ? 'Cancel Create' : 'Create New Coupon'}
//         </button>
//       </div>

//       {/* Vendor Information */}
//       {vendorInfo && (
//         <div style={styles.vendorInfo}>
//           <p style={styles.vendorText}>
//             <strong>Vendor ID:</strong> {vendorInfo.id}
//           </p>
//           <p style={styles.vendorText}>
//             <strong>Business ID:</strong> {vendorInfo.business_id}
//           </p>
//           <p style={styles.vendorText}>
//             <strong>Role:</strong> {vendorInfo.role}
//           </p>
//         </div>
//       )}

//       {/* Statistics Cards */}
//       {coupons.length > 0 && (
//         <div style={styles.stats}>
//           <div style={styles.statCard}>
//             <div style={styles.statValue}>{stats.totalCoupons}</div>
//             <div style={styles.statLabel}>Total Coupons</div>
//           </div>
//           <div style={styles.statCard}>
//             <div style={styles.statValue}>{stats.activeCoupons}</div>
//             <div style={styles.statLabel}>Active Coupons</div>
//           </div>
//           <div style={styles.statCard}>
//             <div style={styles.statValue}>{stats.totalUsage}</div>
//             <div style={styles.statLabel}>Total Usage</div>
//           </div>
//         </div>
//       )}

//       {/* Create Coupon Form */}
//       {showCreateForm && (
//         <div style={styles.createForm}>
//           <h2 style={{marginTop: 0, color: '#495057', marginBottom: '20px'}}>Create New Coupon</h2>
//           <form onSubmit={createCoupon}>
//             <div style={styles.formGrid}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Coupon Code *</label>
//                 <input
//                   type="text"
//                   name="code"
//                   value={newCoupon.code}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="e.g., SAVE10"
//                   style={styles.input}
//                 />
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Discount Type *</label>
//                 <select
//                   name="discountType"
//                   value={newCoupon.discountType}
//                   onChange={handleInputChange}
//                   style={styles.input}
//                 >
//                   <option value="percent">Percentage (%)</option>
//                   <option value="fixed">Fixed Amount ($)</option>
//                 </select>
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Discount Value *</label>
//                 <input
//                   type="number"
//                   name="discountValue"
//                   value={newCoupon.discountValue}
//                   onChange={handleInputChange}
//                   required
//                   placeholder={newCoupon.discountType === 'percent' ? '10' : '5'}
//                   style={styles.input}
//                 />
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Expiry Date *</label>
//                 <input
//                   type="date"
//                   name="expiryDate"
//                   value={newCoupon.expiryDate}
//                   onChange={handleInputChange}
//                   required
//                   style={styles.input}
//                 />
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Minimum Order Value</label>
//                 <input
//                   type="number"
//                   name="minOrderValue"
//                   value={newCoupon.minOrderValue}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 100"
//                   style={styles.input}
//                 />
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Max Uses Per Day</label>
//                 <input
//                   type="number"
//                   name="maxUsePerDay"
//                   value={newCoupon.maxUsePerDay}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 50"
//                   style={styles.input}
//                 />
//               </div>
              
//               <div style={{...styles.formGroup, ...styles.fullWidth}}>
//                 <label style={styles.label}>Coupon Image</label>
//                 <input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleInputChange}
//                   style={styles.input}
//                 />
//               </div>
//             </div>
            
//             <div style={styles.formActions}>
//               <button 
//                 type="submit" 
//                 disabled={loading}
//                 style={{...styles.btn, ...styles.btnSuccess}}
//               >
//                 {loading ? 'Creating...' : 'Create Coupon'}
//               </button>
//               <button 
//                 type="button" 
//                 onClick={() => setShowCreateForm(false)}
//                 style={{...styles.btn, ...styles.btnSecondary}}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Coupons Table */}
//       <div style={styles.tableContainer}>
//         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #dee2e6'}}>
//           <h2 style={{margin: 0, color: '#495057'}}>My Coupons</h2>
//           <button 
//             style={{...styles.btn, ...styles.btnPrimary}}
//             onClick={fetchCoupons}
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : 'Refresh'}
//           </button>
//         </div>
        
//         {loading ? (
//           <div style={styles.loading}>Loading your coupons...</div>
//         ) : coupons.length === 0 ? (
//           <div style={styles.loading}>
//             No coupons found for your business. Create your first coupon!
//           </div>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.tableHeader}>Code</th>
//                 <th style={styles.tableHeader}>Discount</th>
//                 <th style={styles.tableHeader}>Expiry Date</th>
//                 <th style={styles.tableHeader}>Status</th>
//                 <th style={styles.tableHeader}>Usage</th>
//                 <th style={styles.tableHeader}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {coupons.map(coupon => (
//                 <tr key={coupon._id}>
//                   <td style={styles.tableCell}>
//                     <strong>{coupon.code}</strong>
//                   </td>
//                   <td style={styles.tableCell}>
//                     {coupon.discountValue}
//                     {coupon.discountType === 'percent' ? '%' : '$'}
//                   </td>
//                   <td style={styles.tableCell}>
//                     {new Date(coupon.expiryDate).toLocaleDateString()}
//                   </td>
//                   <td style={styles.tableCell}>
//                     <span style={{
//                       ...styles.status,
//                       ...(coupon.isActive ? styles.statusActive : styles.statusInactive)
//                     }}>
//                       {coupon.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td style={styles.tableCell}>
//                     {coupon.totalUsedCount} {coupon.totalUsedCount === 1 ? 'use' : 'uses'}
//                   </td>
//                   <td style={styles.tableCell}>
//                     <div style={styles.actions}>
//                       <button 
//                         style={{...styles.btn, ...styles.btnSuccess}}
//                         onClick={() => fetchCouponDetails(coupon._id)}
//                       >
//                         View Details
//                       </button>
//                       <button 
//                         style={{...styles.btn, ...styles.btnDanger}}
//                         onClick={() => deleteCoupon(coupon._id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Coupon Details Modal */}
//       {selectedCoupon && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <div style={styles.modalHeader}>
//               <h2 style={{margin: 0, color: '#495057'}}>Coupon Details - {selectedCoupon.code}</h2>
//               <button 
//                 style={styles.closeBtn}
//                 onClick={() => setSelectedCoupon(null)}
//               >
//                 ×
//               </button>
//             </div>
            
//             <div style={styles.couponDetails}>
//               <div style={styles.detailRow}>
//                 <span style={{fontWeight: 600, color: '#495057'}}>Code:</span>
//                 <span style={{color: '#6c757d', fontWeight: 'bold'}}>{selectedCoupon.code}</span>
//               </div>
              
//               <div style={styles.detailRow}>
//                 <span style={{fontWeight: 600, color: '#495057'}}>Discount:</span>
//                 <span style={{color: '#6c757d'}}>
//                   {selectedCoupon.discountValue}
//                   {selectedCoupon.discountType === 'percent' ? '%' : '$'}
//                 </span>
//               </div>
              
//               <div style={styles.detailRow}>
//                 <span style={{fontWeight: 600, color: '#495057'}}>Expiry Date:</span>
//                 <span style={{color: '#6c757d'}}>
//                   {new Date(selectedCoupon.expiryDate).toLocaleDateString()}
//                 </span>
//               </div>
              
//               <div style={styles.detailRow}>
//                 <span style={{fontWeight: 600, color: '#495057'}}>Status:</span>
//                 <span style={{
//                   ...styles.status,
//                   ...(selectedCoupon.isActive ? styles.statusActive : styles.statusInactive)
//                 }}>
//                   {selectedCoupon.isActive ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
              
//               <div style={styles.detailRow}>
//                 <span style={{fontWeight: 600, color: '#495057'}}>Total Used:</span>
//                 <span style={{color: '#6c757d'}}>{selectedCoupon.totalUsedCount} times</span>
//               </div>
              
//               <div style={styles.detailRow}>
//                 <span style={{fontWeight: 600, color: '#495057'}}>Created:</span>
//                 <span style={{color: '#6c757d'}}>
//                   {new Date(selectedCoupon.createdAt).toLocaleDateString()}
//                 </span>
//               </div>

//               {selectedCoupon.usageHistory && selectedCoupon.usageHistory.length > 0 && (
//                 <div style={styles.usageHistory}>
//                   <h4 style={{marginBottom: '15px', color: '#495057'}}>Usage History</h4>
//                   {selectedCoupon.usageHistory.map(usage => (
//                     <div key={usage._id} style={styles.usageItem}>
//                       <span>User: {usage.user_id}</span>
//                       <span>Used: {new Date(usage.usedAt).toLocaleDateString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div style={styles.modalActions}>
//               <button 
//                 style={{...styles.btn, ...styles.btnDanger}}
//                 onClick={() => deleteCoupon(selectedCoupon._id)}
//               >
//                 Delete Coupon
//               </button>
//               <button 
//                 style={{...styles.btn, ...styles.btnSecondary}}
//                 onClick={() => setSelectedCoupon(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CouponManagement;