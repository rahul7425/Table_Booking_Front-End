import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../config/AxiosInstance";

function BusinessReviews() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const loadReviews = async () => {
    const res = await axios.get(`/reviews/business/${id}`);
    setData(res.data.reviews);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Business Reviews</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Review</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r._id}>
              <td className="p-2 border">{r?.userId?.email}</td>
              <td className="p-2 border">{r.rating}</td>
              <td className="p-2 border">{r.review}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusinessReviews;
