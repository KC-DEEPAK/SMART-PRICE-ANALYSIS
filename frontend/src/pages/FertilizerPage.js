import { useState } from "react";
import fertilizerData from "../data/fertilizerData";
import diseaseFertilizerData from "../data/diseaseFertilizerData";
import { speakText } from "../utils/speakText";
import { useLanguage } from "../context/LanguageContext";
import "./FertilizerPage.css";

function FertilizerPage() {
  const [selectedCrop, setSelectedCrop] = useState("");
  const { t } = useLanguage();

  const crops = Object.keys(fertilizerData);

  const fertilizers = fertilizerData[selectedCrop];
  const diseases = diseaseFertilizerData[selectedCrop];

  return (
    <div className="page-container">
      <div className="agri-card mb-4 agri-card-left-border">
        <h2 style={{marginTop: 0}}>{t.fertilizerGuide}</h2>

        {/* CROP SELECT */}
        <select
          value={selectedCrop}
          onChange={e => setSelectedCrop(e.target.value)}
          className="modern-select"
          style={{ maxWidth: "300px" }}
        >
          <option value="">🌾 {t.selectCrop}</option>
          {crops.map(crop => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </div>

      {/* 🌱 FERTILIZER SECTION */}
      {fertilizers && (
        <div className="mb-4">
          <h3 style={{ color: "var(--primary-dark)" }}>{t.fertilizerPlan}</h3>
          <div className="dashboard-grid">
            {fertilizers.map((f, i) => (
              <div key={i} className="agri-card">
                <h4 style={{ margin: "0 0 10px 0", color: "var(--primary-green)", fontSize: "18px" }}>
                  {f.stage} – {f.fertilizer}
                </h4>
                <p style={{ color: "var(--text-gray)", marginBottom: "15px" }}>{f.benefit}</p>

                <button
                  className="btn-secondary"
                  onClick={() =>
                    speakText(
                      `For ${selectedCrop}, apply ${f.fertilizer} at ${f.stage} stage`
                    )
                  }
                >
                  {t.speak}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🦠 DISEASE SECTION */}
      {diseases && (
        <div className="mb-4">
          <h3 style={{ color: "#c62828" }}>{t.commonDiseases}</h3>
          <div className="dashboard-grid">
            {diseases.map((d, i) => (
              <div key={i} className="agri-card" style={{ borderLeft: "5px solid #ef5350" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#c62828", fontSize: "18px" }}>{d.disease}</h4>
                <p style={{ margin: "5px 0", fontSize: "14px" }}><b style={{ color: "var(--text-dark)" }}>{t.symptoms}</b> <span style={{ color: "var(--text-gray)" }}>{d.symptoms}</span></p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}><b style={{ color: "var(--text-dark)" }}>{t.prevention}</b> <span style={{ color: "var(--text-gray)" }}>{d.prevention}</span></p>
                <p style={{ margin: "5px 0 15px 0", fontSize: "14px" }}><b style={{ color: "var(--text-dark)" }}>{t.recommended}</b> <span style={{ color: "var(--text-gray)" }}>{d.fertilizer || d.recommended}</span></p>

                <button
                  className="btn-secondary"
                  style={{ color: "#c62828", borderColor: "#ef5350" }}
                  onClick={() =>
                    speakText(
                      `${selectedCrop} may get ${d.disease}. Use ${d.fertilizer || d.recommended}`
                    )
                  }
                >
                  {t.speak}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FertilizerPage;
