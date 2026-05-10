import { useEffect, useState } from "react";
import ComparisonChart from "../components/ComparisonChart";
import { useLanguage } from "../context/LanguageContext";

function ComparisonPage() {
  const [data, setData] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    fetch("https://smart-price-analysis-1.onrender.com/api/data")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  const crops = [
    ...new Set(
      data
        .map(
          d =>
            d.Commodity ||
            d.commodity ||
            d.Crop ||
            d.crop_name
        )
        .filter(Boolean)
    )
  ];

  const cropData = data.filter(d => {
    const name =
      d.Commodity ||
      d.commodity ||
      d.Crop ||
      d.crop_name;
    return name === selectedCrop;
  });

  const sortedData = [...cropData].sort(
    (a, b) =>
      Number(b.Modal_x0020_Price) -
      Number(a.Modal_x0020_Price)
  );

  const bestMarket = sortedData[0];
  const worstMarket = sortedData[sortedData.length - 1];

  return (
    <div className="page-container">
      <div className="agri-card mb-4 agri-card-left-border">
        <h2>⚖️ {t.priceComparison}</h2>

        <div className="flex gap-3 mb-2 flex-wrap">
          <select
            className="modern-select"
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            style={{ maxWidth: "300px" }}
          >
            <option value="">🌾 {t.selectCrop}</option>
            {crops.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCrop && sortedData.length > 0 && (
        <>
          <div className="dashboard-grid mb-4">
            <div className="agri-card" style={{ borderLeft: "5px solid var(--primary-green)" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "var(--text-gray)", fontSize: "16px" }}>{t.bestMarket}</h3>
              <h2 style={{ margin: "0", color: "var(--primary-dark)" }}>{bestMarket.Market}</h2>
              <p style={{ margin: "5px 0 0 0", color: "var(--primary-green)", fontWeight: "bold", fontSize: "18px" }}>
                ₹{bestMarket.Modal_x0020_Price}
              </p>
            </div>

            <div className="agri-card" style={{ borderLeft: "5px solid #ef5350" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "var(--text-gray)", fontSize: "16px" }}>{t.worstMarket}</h3>
              <h2 style={{ margin: "0", color: "#c62828" }}>{worstMarket.Market}</h2>
              <p style={{ margin: "5px 0 0 0", color: "#c62828", fontWeight: "bold", fontSize: "18px" }}>
                ₹{worstMarket.Modal_x0020_Price}
              </p>
            </div>
          </div>

          <div className="agri-card">
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>📊 {t.compare}</h3>
            <ComparisonChart data={sortedData} />
          </div>
        </>
      )}
    </div>
  );
}

export default ComparisonPage;
