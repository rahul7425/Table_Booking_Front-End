import React, { useEffect, useState } from "react";
import axios from "../../../config/AxiosInstance";

function TopBusinesses() {
  const [data, setData] = useState([]);

  const fetchTop = async () => {
    const res = await axios.get("/reviews/top/businesses");
    setData(res.data.topBusinesses);
  };

  useEffect(() => {
    fetchTop();
  }, []);

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Top Rated Businesses</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Business</th>
            <th className="p-2 border">Total Reviews</th>
            <th className="p-2 border">Average Rating</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b._id}>
              <td className="p-2 border">{b.businessData.name}</td>
              <td className="p-2 border">{b.totalReviews}</td>
              <td className="p-2 border">{b.avgRating.toFixed(1)}</td>
              <td className="p-2 border">
                <a
                  className="text-blue-500"
                  href={`/reviews/business/${b._id}`}
                >
                  View Reviews
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopBusinesses;
