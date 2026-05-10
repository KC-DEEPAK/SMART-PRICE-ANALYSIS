import { useState, useEffect } from "react";
import { getCategory } from "../utils/cropCategories";
import { getSellDecision } from "../utils/sellDecision";
import { getCropImage } from "../utils/getCropImage";
import { useLanguage } from "../context/LanguageContext";

function CategoryList({ data = [], category }) {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const { t } = useLanguage();

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
        <h3>{t.noData || "No data available"}</h3>
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
  
  // translate category header
  let categoryLabel = category;
  if (category === "Vegetables") categoryLabel = t.vegetables.replace("🥦 ", "");
  if (category === "Fruits") categoryLabel = t.fruits.replace("🍎 ", "");
  if (category === "Others") categoryLabel = t.others.replace("🌾 ", "");

  return (
    <div className="agri-card mt-4 mb-4" style={{ marginTop: "24px" }}>
      <h2 style={{marginTop: 0}}>{categoryLabel} {t.selectCrop ? t.selectCrop.replace("🌾 Select ", "") : "Crops"}</h2>

      {/* 🌾 Crop buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        {cropNames.map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px 8px 8px",
              borderRadius: "50px",
              border: selectedCrop === crop ? "2px solid var(--primary-light)" : "1px solid #e0e0e0",
              background: selectedCrop === crop ? "var(--mint)" : "white",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              transition: "var(--transition)",
              boxShadow: "var(--shadow-sm)"
            }}
            onMouseOver={(e) => { if(selectedCrop !== crop) e.currentTarget.style.background = "#f9f9f9"; }}
            onMouseOut={(e) => { if(selectedCrop !== crop) e.currentTarget.style.background = "white"; }}
          >
            <img 
              src={getCropImage(crop)} 
              alt={crop} 
              style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd" }} 
            />
            {crop}
          </button>
        ))}
      </div>

      {/* 📋 Market table */}
      {selectedCrop &&
        Array.isArray(cropMap[selectedCrop]) && (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>{t.market}</th>
                  <th>{t.state}</th>
                  <th>{t.price}</th>
                  <th>{t.advice}</th>
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
                      <td style={{ fontWeight: "500", color: "var(--primary-dark)" }}>₹{current}</td>
                      <td>
                        {decision === "SELL" && (
                          <span style={{ color: "white", background: "#4caf50", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                            {t.sellNow}
                          </span>
                        )}
                        {decision === "WAIT" && (
                          <span style={{ color: "white", background: "#f44336", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                            {t.wait}
                          </span>
                        )}
                        {decision === "HOLD" && (
                          <span style={{ color: "white", background: "#ff9800", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                            {t.hold}
                          </span>
                        )}
                      </td>
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
