import { useState } from "react";
import productGroups from "../utils/productGroups";

function ProductGroups({ crops = [], onCropSelect }) {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const groupedCrops = selectedGroup
    ? crops.filter(crop => {
        const name = crop.toLowerCase();
        return productGroups[selectedGroup].some(k =>
          name.includes(k)
        );
      })
    : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Products</h2>

      {/* GROUP BUTTONS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {Object.keys(productGroups).map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            style={{
              padding: "10px 16px",
              borderRadius: "20px",
              border: "1px solid #aaa",
              cursor: "pointer",
              background:
                selectedGroup === group ? "#d1f2eb" : "#f5f5f5"
            }}
          >
            {group}
          </button>
        ))}
      </div>

      {/* CROPS */}
      {selectedGroup && (
        <div style={{ marginTop: "15px" }}>
          <h3>{selectedGroup}</h3>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {groupedCrops.map((crop, i) => (
              <span
                key={i}
                onClick={() => onCropSelect(crop)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "14px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >
                {crop}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductGroups;
