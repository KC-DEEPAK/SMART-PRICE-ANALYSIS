import { useState } from "react";
import fertilizerData from "../data/fertilizerData";
import diseaseFertilizerData from "../data/diseaseFertilizerData";
import { speakText } from "../utils/speakText";
import "./FertilizerPage.css";

function FertilizerPage() {
  const [selectedCrop, setSelectedCrop] = useState("");

  const crops = Object.keys(fertilizerData);

  const fertilizers = fertilizerData[selectedCrop];
  const diseases = diseaseFertilizerData[selectedCrop];

  return (
    <div className="fertilizer-page">
      <h2>🌱 Fertilizer & Disease Recommendation</h2>

      {/* CROP SELECT */}
      <select
        value={selectedCrop}
        onChange={e => setSelectedCrop(e.target.value)}
        className="crop-select"
      >
        <option value="">🌾 Select Crop</option>
        {crops.map(crop => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>

      {/* 🌱 FERTILIZER SECTION */}
      {fertilizers && (
        <>
          <h3>🌱 Fertilizer Plan</h3>
          {fertilizers.map((f, i) => (
            <div key={i} className="info-card">
              <b>{f.stage} – {f.fertilizer}</b>
              <p>{f.benefit}</p>

              🔊
              <button
                onClick={() =>
                  speakText(
                    `For ${selectedCrop}, apply ${f.fertilizer} at ${f.stage} stage`
                  )
                }
              >
                Speak
              </button>
            </div>
          ))}
        </>
      )}

      {/* 🦠 DISEASE SECTION */}
      {diseases && (
        <>
          <h3>🦠 Common Diseases</h3>
          {diseases.map((d, i) => (
            <div key={i} className="info-card danger">
              <b>{d.disease}</b>
              <p><b>Symptoms:</b> {d.symptoms}</p>
              <p><b>Prevention:</b> {d.prevention}</p>
              <p><b>Recommended:</b> {d.fertilizer}</p>

              🔊
              <button
                onClick={() =>
                  speakText(
                    `${selectedCrop} may get ${d.disease}. Use ${d.fertilizer}`
                  )
                }
              >
                Speak
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default FertilizerPage;
