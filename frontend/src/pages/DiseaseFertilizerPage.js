import { useState } from "react";
import diseaseFertilizerData from "../data/diseaseFertilizerData";
import { speakText } from "../utils/speakText";
import "./DiseaseFertilizerPage.css";

function DiseaseFertilizerPage() {
  const crops = Object.keys(diseaseFertilizerData);
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);

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
    <div className="disease-page">
      <h2>🦠 Disease & Fertilizer Recommendation</h2>

      <select
        value={selectedCrop}
        onChange={(e) => setSelectedCrop(e.target.value)}
      >
        {crops.map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>

      {diseases.map((d, index) => (
        <div key={index} className="disease-card">
          <h3>{d.disease}</h3>

          <p><b>Symptoms:</b> {d.symptoms}</p>
          <p><b>Prevention:</b> {d.prevention}</p>
          <p><b>Recommended:</b> {d.recommended}</p>

          <button onClick={() => handleSpeak(d)}>
            🔊 Speak Guidance
          </button>
        </div>
      ))}
    </div>
  );
}

export default DiseaseFertilizerPage;
