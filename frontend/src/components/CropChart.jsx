import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CropChart = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="commodity" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="modal_x0020_price" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropChart;
