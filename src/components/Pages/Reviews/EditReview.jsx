import React, { useEffect, useState } from "react";
import axios from "../../../config/AxiosInstance";
import { useParams } from "react-router-dom";

function EditReview() {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const loadReview = async () => {
    const res = await axios.get(`/reviews/${id}`);
    setRating(res.data.review.rating);
    setReview(res.data.review.review);
  };

  const handleUpdate = async () => {
    await axios.put(`/reviews/${id}`, { rating, review });
    alert("Review Updated Successfully");
  };

  useEffect(() => {
    loadReview();
  }, []);

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Review</h2>

      <label className="block mb-2">Rating</label>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <label className="block mb-2">Review</label>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="border p-2 w-full"
      ></textarea>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
      >
        Update
      </button>
    </div>
  );
}

export default EditReview;
