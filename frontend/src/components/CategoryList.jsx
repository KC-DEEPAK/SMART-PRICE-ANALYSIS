import { useState, useEffect } from "react";
import { getCategory } from "../utils/cropCategories";
import { getSellDecision } from "../utils/sellDecision";

function CategoryList({ data = [], category }) {
  const [selectedCrop, setSelectedCrop] = useState(null);

  // 🔑 RESET selected crop when category changes
  useEffect(() => {
    setSelectedCrop(null);
  }, [category]);

  // 🛑 Safety checks
  if (!Array.isArray(data) || !category) return null;

  // Filter data by category
  const filteredData = data.filter(item => {
    const crop =
      item?.Commodity ||
      item?.commodity ||
      item?.Crop ||
      item?.crop_name;

    return crop && getCategory(crop) === category;
  });

  if (!filteredData.length) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>No data found for {category}</h3>
      </div>
    );
  }

  // Group by crop
  const cropMap = {};
  filteredData.forEach(item => {
    const crop =
      item?.Commodity ||
      item?.commodity ||
      item?.Crop ||
      item?.crop_name;

    if (!crop) return;

    if (!cropMap[crop]) cropMap[crop] = [];
    cropMap[crop].push(item);
  });

  const cropNames = Object.keys(cropMap);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category} Crops</h2>

      {/* 🌾 Crop buttons */}
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

      {/* 📋 Market table */}
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
                <th>State</th>
                <th>Price ₹</th>
                <th>Advice</th>
              </tr>
            </thead>

            <tbody>
              {cropMap[selectedCrop].map((item, i) => {
                const prices = cropMap[selectedCrop].map(d =>
                  Number(d.Modal_x0020_Price)
                );

                const avg =
                  prices.reduce((a, b) => a + b, 0) /
                  prices.length;

                const current = Number(
                  item.Modal_x0020_Price
                );

                const decision = getSellDecision(
                  current,
                  avg
                );

                return (
                  <tr key={i}>
                    <td>{item.Market}</td>
                    <td>{item.State}</td>
                    <td>₹{current}</td>
                    <td>
                      {decision === "SELL" && (
                        <span style={{ color: "green" }}>
                          🟢 SELL NOW
                        </span>
                      )}
                      {decision === "WAIT" && (
                        <span style={{ color: "red" }}>
                          🔴 WAIT
                        </span>
                      )}
                      {decision === "HOLD" && (
                        <span style={{ color: "orange" }}>
                          🟡 HOLD
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
    </div>
  );
}

export default CategoryList;
