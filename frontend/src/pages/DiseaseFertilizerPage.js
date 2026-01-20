import { useState } from "react";
import diseaseData from "../utils/diseaseData";
import { speakDisease } from "../utils/speakDisease";

function DiseaseFertilizerPage() {
  const [crop, setCrop] = useState("");
  const [symptom, setSymptom] = useState("");

  const crops = Object.keys(diseaseData);
  const symptoms = crop ? Object.keys(diseaseData[crop]) : [];

  const result =
    crop && symptom ? diseaseData[crop][symptom] : null;

  return (
    <div style={{ padding: "30px" }}>
      <h2>🌱 Disease + Fertilizer Recommendation</h2>

      {/* CROP SELECT */}
      <select
        value={crop}
        onChange={e => {
          setCrop(e.target.value);
          setSymptom("");
        }}
        style={{ padding: "10px", width: "300px", marginBottom: "15px" }}
      >
        <option value="">🌾 Select Crop</option>
        {crops.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <br />

      {/* SYMPTOM SELECT */}
      {crop && (
        <select
          value={symptom}
          onChange={e => setSymptom(e.target.value)}
          style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
        >
          <option value="">🦠 Select Symptom</option>
          {symptoms.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}

      {/* RESULT */}
      {result && (
        <div
          style={{
            background: "#e8f5e9",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "500px"
          }}
        >
          <p><b>🦠 Problem:</b> {result.problem}</p>
          <p><b>💊 Fertilizer:</b> {result.fertilizer}</p>
          <p><b>🌱 Stage:</b> {result.stage}</p>
          <p><b>📈 Benefit:</b> {result.benefit}</p>

          <button
            onClick={() =>
              speakDisease({
                crop,
                problem: result.problem,
                fertilizer: result.fertilizer,
                stage: result.stage
              })
            }
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            🔊 Hear Advice
          </button>
        </div>
      )}
    </div>
  );
}

export default DiseaseFertilizerPage;
