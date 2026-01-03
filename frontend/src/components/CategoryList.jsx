import { useState } from "react";
import { getCategory } from "../utils/cropCategories";

function CategoryList({ data = [], category }) {
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  if (!data.length) {
    return <h3 style={{ padding: "20px" }}>Loading data...</h3>;
  }

  // Filter by category
  const categoryData = data.filter(item => {
    const crop =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name;

    return getCategory(crop) === category;
  });

  // Group by crop
  const cropMap = {};
  categoryData.forEach(item => {
    const crop =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name;

    if (!cropMap[crop]) cropMap[crop] = [];
    cropMap[crop].push(item);
  });

  // Best market logic
  const bestMarket =
    selectedCrop &&
    cropMap[selectedCrop] &&
    cropMap[selectedCrop].reduce((best, cur) =>
      Number(cur.Modal_x0020_Price) > Number(best.Modal_x0020_Price)
        ? cur
        : best
    );

  // Search crops
  const cropNames = Object.keys(cropMap).filter(crop =>
    crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category} Crops</h2>

      <input
        type="text"
        placeholder="Search crop (e.g., Tomato)"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setSelectedCrop(null);
        }}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {cropNames.map(crop => (
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

      {selectedCrop && cropMap[selectedCrop] && (
        <div style={{ marginTop: "30px" }}>
          <h3>{selectedCrop} – Market Prices</h3>

          {/* ⭐ BEST MARKET */}
          {bestMarket && (
            <div
              style={{
                background: "#e8f5e9",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                borderLeft: "6px solid green"
              }}
            >
              ⭐ <b>Best Market to Sell</b><br />
              {bestMarket.Market}, {bestMarket.State} — ₹
              {bestMarket.Modal_x0020_Price}
            </div>
          )}

          <table border="1" width="100%" cellPadding="8">
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
    .map((item, i, arr) => {
      const prev =
        i > 0
          ? Number(arr[i - 1].Modal_x0020_Price)
          : null;

      const current = Number(item.Modal_x0020_Price);

      let trend = "—";
      if (prev !== null) {
        trend =
          current > prev
            ? "⬆️"
            : current < prev
            ? "⬇️"
            : "➡️";
      }

      return (
        <tr key={i}>
          <td>{item.Market}</td>
          <td>{item.District}</td>
          <td>{item.State}</td>
          <td>{item.Min_x0020_Price}</td>
          <td>
            {item.Modal_x0020_Price} {trend}
          </td>
          <td>{item.Max_x0020_Price}</td>
        </tr>
      );
    })}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default CategoryList;
