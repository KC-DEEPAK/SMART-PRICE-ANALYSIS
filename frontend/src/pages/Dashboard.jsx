import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

function Dashboard() {
  const [cropData, setCropData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/latest")
      .then((res) => {
        console.log("✅ API response:", res.data);
        setCropData(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching data:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="p-10 text-red-600 font-semibold">
        ⚠️ Error loading data: {error}
      </div>
    );
  }

  if (cropData.length === 0) {
    return (
      <div className="p-10 text-gray-600 text-lg animate-pulse">
        ⏳ Loading crop data...
      </div>
    );
  }

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        🌾 Price Trends and Increases This Month
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cropData.map((crop, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {crop.Commodity || "Unknown Crop"}
                </h2>
                <p className="text-sm text-gray-500">{crop.State || "—"}</p>
              </div>

              <div
                className={`p-2 rounded-full ${
                  crop.PercentageChange >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {crop.PercentageChange >= 0 ? (
                  <ArrowUp size={18} />
                ) : (
                  <ArrowDown size={18} />
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">
                ₹{crop.ModalPrice ? crop.ModalPrice.toFixed(2) : "N/A"}
              </p>
              <p
                className={`font-medium text-sm ${
                  crop.PercentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {crop.PercentageChange
                  ? `${crop.PercentageChange >= 0 ? "+" : ""}${crop.PercentageChange.toFixed(
                      1
                    )}% vs last month`
                  : "No change data"}
              </p>
            </div>

            <div className="mt-5 h-32">
              {crop.PriceTrend ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crop.PriceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No trend data
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
