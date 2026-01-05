import { useEffect, useState } from "react";
import ComparisonChart from "../components/ComparisonChart";
import "./ComparisonPage.css"; // ✅ ADD THIS

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

  return (
    <div className="comparison-page">
      <h2 className="comparison-title">
        📊 Crop Price Comparison
      </h2>

      <div className="comparison-card">
        <div className="dropdowns">
          <select
            value={cropA}
            onChange={e => setCropA(e.target.value)}
          >
            <option value="">🌾 Select Crop 1</option>
            {crops.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="vs">VS</span>

          <select
            value={cropB}
            onChange={e => setCropB(e.target.value)}
          >
            <option value="">🌾 Select Crop 2</option>
            {crops.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* GRAPH */}
        <ComparisonChart
          cropA={cropA}
          cropB={cropB}
          data={data}
        />
      </div>
    </div>
  );
}

export default ComparisonPage;
