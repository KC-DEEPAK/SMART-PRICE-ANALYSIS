import { useState } from "react";
import { getCategory } from "../utils/cropCategories";
import PriceTrendGraph from "./PriceTrendGraph";

function CategoryList({ data = [], category }) {
  const [selectedCrop, setSelectedCrop] = useState(null);

  // ✅ FILTER BY CATEGORY
  const filteredData = data.filter(item => {
    const crop =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name;

    return getCategory(crop) === category;
  });

  // ✅ GROUP BY CROP NAME
  const cropMap = {};
  filteredData.forEach(item => {
    const crop =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name;

    if (!cropMap[crop]) cropMap[crop] = [];
    cropMap[crop].push(item);
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category} Crops</h2>

      {/* CROP BUTTONS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {Object.keys(cropMap).map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            style={{
              padding: "10px 14px",
              borderRadius: "20px",
              border: "1px solid #aaa",
              cursor: "pointer",
              background:
                selectedCrop === crop ? "#c8e6c9" : "#f5f5f5"
            }}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* MARKET TABLE + GRAPH */}
      {selectedCrop && cropMap[selectedCrop] && (
        <>
          <table
            border="1"
            width="100%"
            cellPadding="8"
            style={{ marginTop: "20px" }}
          >
            <thead>
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
              {[...cropMap[selectedCrop]]
                .sort(
                  (a, b) =>
                    Number(b.Modal_x0020_Price) -
                    Number(a.Modal_x0020_Price)
                )
                .map((item, i) => (
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

          {/* 📈 PRICE TREND GRAPH */}
          <PriceTrendGraph
            cropName={selectedCrop}
            cropData={cropMap[selectedCrop]}
          />
        </>
      )}
    </div>
  );
}

export default CategoryList;
