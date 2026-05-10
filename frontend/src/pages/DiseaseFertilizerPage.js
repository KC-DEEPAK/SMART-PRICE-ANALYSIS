import { useState } from "react";
import diseaseFertilizerData from "../data/diseaseFertilizerData";
import { speakText } from "../utils/speakText";
import { useLanguage } from "../context/LanguageContext";
import "./DiseaseFertilizerPage.css";

function DiseaseFertilizerPage() {
  const crops = Object.keys(diseaseFertilizerData);
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const { t } = useLanguage();

  const diseases = diseaseFertilizerData[selectedCrop] || [];

  const handleSpeak = (disease) => {
    const message =
      `For ${selectedCrop}. ` +
      `Disease is ${disease.disease}. ` +
      `Symptoms are ${disease.symptoms}. ` +
      `Prevention is ${disease.prevention}. ` +
      `Recommended treatment is ${disease.recommended}.`;

    speakText(message);
  };

  return (
    <div className="page-container">
      <div className="agri-card mb-4 agri-card-left-border">
        <h2 style={{marginTop: 0}}>{t.diseaseGuide || "🦠 Disease & Fertilizer Recommendation"}</h2>

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="modern-select"
          style={{ maxWidth: "300px" }}
        >
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-grid">
        {diseases.map((d, index) => (
          <div key={index} className="agri-card" style={{ borderLeft: "5px solid #ef5350" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#c62828", fontSize: "20px" }}>{d.disease}</h3>

            <p style={{ margin: "5px 0", fontSize: "14px" }}><b style={{ color: "var(--text-dark)" }}>{t.symptoms}</b> <span style={{ color: "var(--text-gray)" }}>{d.symptoms}</span></p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}><b style={{ color: "var(--text-dark)" }}>{t.prevention}</b> <span style={{ color: "var(--text-gray)" }}>{d.prevention}</span></p>
            <p style={{ margin: "5px 0 15px 0", fontSize: "14px" }}><b style={{ color: "var(--text-dark)" }}>{t.recommended}</b> <span style={{ color: "var(--text-gray)" }}>{d.recommended}</span></p>

            <button className="btn-secondary" style={{ color: "#c62828", borderColor: "#ef5350" }} onClick={() => handleSpeak(d)}>
              {t.speak}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiseaseFertilizerPage;
