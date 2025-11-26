import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CropDashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => setData(data))
      .catch(() => setError("Failed to fetch data"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        🌱 Best Time to Sell Crops
      </h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600">Loading crop prices...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((crop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-green-100"
            >
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                {crop.Commodity}
              </h2>
              <p className="text-gray-700">
                <span className="font-medium">Date:</span> {crop.Arrival_Date}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">State:</span> {crop.State}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">District:</span> {crop.District}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Market:</span> {crop.Market}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Variety:</span> {crop.Variety}
              </p>
              <p className="text-green-600 font-bold text-lg mt-2">
                💰 ₹{crop.Modal_Price}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
