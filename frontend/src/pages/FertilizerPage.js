import { useState } from "react";
import fertilizerData from "../utils/fertilizerData";
import { speakFertilizer } from "../utils/speakFertilizer";

function FertilizerPage() {
  const [selectedCrop, setSelectedCrop] = useState("");

  const crops = Object.keys(fertilizerData);
  const recommendations = fertilizerData[selectedCrop] || [];

  return (
    <div style={{ padding: "30px" }}>
      <h2>🌱 Fertilizer Recommendation</h2>

      <select
        value={selectedCrop}
        onChange={e => setSelectedCrop(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px"
        }}
      >
        <option value="">Select Crop</option>
        {crops.map(crop => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>

      {recommendations.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "12px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <b>{item.stage}</b> – {item.fertilizer}
            <br />
            <small>{item.benefit}</small>
          </div>

          <button
            onClick={() =>
              speakFertilizer({
                crop: selectedCrop,
                stage: item.stage,
                fertilizer: item.fertilizer
              })
            }
            style={{
              fontSize: "18px",
              border: "none",
              background: "transparent",
              cursor: "pointer"
            }}
          >
            🔊
          </button>
        </div>
      ))}
    </div>
  );
}

export default FertilizerPage;
