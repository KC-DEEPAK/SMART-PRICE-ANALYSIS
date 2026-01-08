import { useState } from "react";
import { getCategory } from "../utils/cropCategories";

function CategoryList({ data = [], category }) {
  const [selectedCrop, setSelectedCrop] = useState(null);

  // 🛑 SAFETY CHECK
  if (!Array.isArray(data) || !category) {
    return null;
  }

  // ✅ FILTER BY CATEGORY
  const filteredData = data.filter(item => {
    const crop =
      item?.Commodity ||
      item?.commodity ||
      item?.Crop ||
      item?.crop_name;

    return crop && getCategory(crop) === category;
  });

  // 🛑 If nothing found
  if (!filteredData.length) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>No data found for {category}</h3>
      </div>
    );
  }

  // ✅ GROUP BY CROP NAME
  const cropMap = {};
  filteredData.forEach(item => {
    const crop =
      item?.Commodity ||
      item?.commodity ||
      item?.Crop ||
      item?.crop_name;

    if (!crop) return;

    if (!cropMap[crop]) {
      cropMap[crop] = [];
    }
    cropMap[crop].push(item);
  });

  const cropNames = Object.keys(cropMap);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category} Crops</h2>

      {/* 🌾 CROP BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        {cropNames.map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            style={{
              padding: "10px 16px",
              borderRadius: "20px",
              border: "1px solid #aaa",
              background:
                selectedCrop === crop ? "#c8e6c9" : "#f5f5f5",
              cursor: "pointer"
            }}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* 📋 MARKET TABLE */}
      {selectedCrop &&
        Array.isArray(cropMap[selectedCrop]) && (
          <table
            border="1"
            width="100%"
            cellPadding="8"
            style={{ borderCollapse: "collapse" }}
          >
            <thead style={{ background: "#f1f8e9" }}>
              <tr>
                <th>Market</th>
                <th>District</th>
                <th>State</th>
                <th>Min ₹</th>
                <th>Modal ₹</th>
                <th>Max ₹</th>
              </tr>
            </thead>

            <tbody>
              {cropMap[selectedCrop].map((item, i) => (
                <tr key={i}>
                  <td>{item.Market}</td>
                  <td>{item.District}</td>
                  <td>{item.State}</td>
                  <td>{item.Min_x0020_Price}</td>
                  <td>{item.Modal_x0020_Price}</td>
                  <td>{item.Max_x0020_Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}

export default CategoryList;
