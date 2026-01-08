import { useState } from "react";
import { OTHER_CROP_GROUPS } from "../utils/otherGroups";

function OtherCrops({ crops = [], onCropSelect }) {
  const [openGroup, setOpenGroup] = useState(null);

  // Helper: match crop name
  const getGroupForCrop = crop => {
    for (const group in OTHER_CROP_GROUPS) {
      if (
        OTHER_CROP_GROUPS[group].some(key =>
          crop.toLowerCase().includes(key.toLowerCase())
        )
      ) {
        return group;
      }
    }
    return "🐄 Others";
  };

  // Build grouped crops
  const grouped = {};
  crops.forEach(crop => {
    const group = getGroupForCrop(crop);
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(crop);
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Other Crops (Grouped)</h2>

      {Object.keys(grouped).map(group => (
        <div key={group} style={{ marginBottom: "15px" }}>
          <button
            onClick={() =>
              setOpenGroup(openGroup === group ? null : group)
            }
            style={{
              padding: "10px 15px",
              width: "100%",
              textAlign: "left",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#f1f8e9",
              cursor: "pointer"
            }}
          >
            {group} ({grouped[group].length})
          </button>

          {openGroup === group && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px"
              }}
            >
              {grouped[group].map(crop => (
                <button
                  key={crop}
                  onClick={() => onCropSelect(crop)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "20px",
                    border: "1px solid #aaa",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  {crop}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default OtherCrops;
