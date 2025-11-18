// import React, { useEffect, useState } from "react";
// import axios from "../../../config/AxiosInstance";

// function ReviewsList() {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchReviews = async () => {
//     try {
//       const res = await axios.get("/reviews/all");
//       setReviews(res.data.reviews);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error loading reviews:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="bg-white p-5 rounded shadow">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">All Reviews</h2>
//         <a href="/reviews/top-businesses" className="text-green-600 underline">
//           View Top Businesses
//         </a>
//       </div>

//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2 border">User</th>
//             <th className="p-2 border">Business</th>
//             <th className="p-2 border">Rating</th>
//             <th className="p-2 border">Review</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reviews.map((r) => (
//             <tr key={r._id}>
//               <td className="p-2 border">{r?.userId?.email}</td>
//               <td className="p-2 border">{r?.businessId?.name || "N/A"}</td>
//               <td className="p-2 border">{r.rating}</td>
//               <td className="p-2 border">{r.review}</td>
//               <td className="p-2 border">
//                 <a
//                   className="text-blue-500"
//                   href={`/reviews/edit/${r._id}`}
//                 >
//                   Edit
//                 </a>
//                 {" | "}
//                 {r?.businessId?._id && (
//                   <a
//                     className="text-green-600"
//                     href={`/reviews/business/${r.businessId._id}`}
//                   >
//                     View Business Reviews
//                   </a>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ReviewsList;



import React, { useEffect, useState } from "react";
import axios from "../../../config/AxiosInstance";

function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/reviews/all");
      setReviews(res.data.reviews);
      setLoading(false);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`/reviews/${id}`);
      alert("Review Deleted Successfully");
      fetchReviews();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-5 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Reviews</h2>
        <a href="/reviews/top-businesses" className="text-green-600 underline">
          View Top Businesses
        </a>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Business</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Review</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r._id}>
              <td className="p-2 border">{r?.userId?.email}</td>
              <td className="p-2 border">{r?.businessId?.name || "N/A"}</td>
              <td className="p-2 border">{r.rating}</td>
              <td className="p-2 border">{r.review}</td>
              <td className="p-2 border">
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </button>

                {" | "}

                {r?.businessId?._id && (
                  <a
                    className="text-green-600"
                    href={`/reviews/business/${r.businessId._id}`}
                  >
                    View Business Reviews
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewsList;
