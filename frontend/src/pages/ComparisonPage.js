import { useEffect, useState } from "react";
import ComparisonChart from "../components/ComparisonChart";
import { speakComparison } from "../utils/speakPrice";

function ComparisonPage() {
  const [data, setData] = useState([]);
  const [cropA, setCropA] = useState("");
  const [cropB, setCropB] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  const crops = [
    ...new Set(
      data.map(
        d =>
          d.Commodity ||
          d.commodity ||
          d.Crop ||
          d.crop_name
      )
    )
  ];

  // 🔢 Average price calculator
  const getAveragePrice = cropName => {
    const cropData = data.filter(d => {
      const name =
        d.Commodity ||
        d.commodity ||
        d.Crop ||
        d.crop_name;
      return name === cropName;
    });

    if (!cropData.length) return 0;

    const total = cropData.reduce(
      (sum, d) => sum + Number(d.Modal_x0020_Price),
      0
    );

    return Math.round(total / cropData.length);
  };

  // 🔊 Speak when both selected
  useEffect(() => {
    if (!cropA || !cropB) return;

    const priceA = getAveragePrice(cropA);
    const priceB = getAveragePrice(cropB);

    speakComparison({
      cropA,
      priceA,
      cropB,
      priceB
    });
  }, [cropA, cropB]);

  return (
    <div className="comparison-page" style={{ padding: "20px" }}>
      <h2>📊 Crop Price Comparison</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px"
        }}
      >
        <select value={cropA} onChange={e => setCropA(e.target.value)}>
          <option value="">🌾 Select Crop 1</option>
          {crops.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={cropB} onChange={e => setCropB(e.target.value)}>
          <option value="">🌾 Select Crop 2</option>
          {crops.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* PRICE INFO */}
      {cropA && cropB && (
        <div
          style={{
            background: "#f1f8e9",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px"
          }}
        >
          <p><b>{cropA} Avg Price:</b> ₹{getAveragePrice(cropA)}</p>
          <p><b>{cropB} Avg Price:</b> ₹{getAveragePrice(cropB)}</p>
        </div>
      )}

      {/* GRAPH */}
      <ComparisonChart
        cropA={cropA}
        cropB={cropB}
        data={data}
      />
    </div>
  );
}

export default ComparisonPage;
