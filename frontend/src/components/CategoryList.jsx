import { useState } from "react";
import { getCategory } from "../utils/cropCategories";
import { checkPriceAlert } from "../utils/checkPriceAlert";

function CategoryList({ data = [], category }) {
  const [selectedCrop, setSelectedCrop] = useState(null);

  // filter by category
  const filteredData = data.filter(item => {
    const crop =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name;

    return getCategory(crop) === category;
  });

  // group by crop
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

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {Object.keys(cropMap).map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            style={{
              padding: "10px",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            {crop}
          </button>
        ))}
      </div>

      {selectedCrop && (
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
            {cropMap[selectedCrop].map((item, i) => {
              const price = Number(item.Modal_x0020_Price);

              // 🔔 CHECK PRICE ALERT HERE
              checkPriceAlert(selectedCrop, price);

              return (
                <tr key={i}>
                  <td>{item.Market}</td>
                  <td>{item.District}</td>
                  <td>{item.State}</td>
                  <td>{item.Min_x0020_Price}</td>
                  <td>{item.Modal_x0020_Price}</td>
                  <td>{item.Max_x0020_Price}</td>
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
