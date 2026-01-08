import { useEffect, useState } from "react";
import PriceListGraph from "../components/PriceListGraph";
import { speakPrice } from "../utils/speakPrice";

function PriceListPage() {
  const [data, setData] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
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
    return selectedCrop ? name === selectedCrop : false;
  });

  const sortedData = [...cropData].sort(
    (a, b) =>
      Number(b.Modal_x0020_Price) -
      Number(a.Modal_x0020_Price)
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Crop Price List</h2>

      {/* LANGUAGE TOGGLE */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setLang("en")}
          style={{
            marginRight: "10px",
            padding: "6px 12px",
            background: lang === "en" ? "#c8e6c9" : "#eee",
            border: "1px solid #aaa",
            cursor: "pointer"
          }}
        >
          English
        </button>

        <button
          onClick={() => setLang("kn")}
          style={{
            padding: "6px 12px",
            background: lang === "kn" ? "#c8e6c9" : "#eee",
            border: "1px solid #aaa",
            cursor: "pointer"
          }}
        >
          ಕನ್ನಡ
        </button>
      </div>

      <select
        value={selectedCrop}
        onChange={e => setSelectedCrop(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "300px"
        }}
      >
        <option value="">🌾 Select Crop</option>
        {crops.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {selectedCrop && <PriceListGraph data={sortedData} />}

      {selectedCrop && (
        <table
          border="1"
          width="100%"
          cellPadding="8"
          style={{
            marginTop: "30px",
            borderCollapse: "collapse"
          }}
        >
          <thead style={{ background: "#f1f8e9" }}>
            <tr>
              <th>Market</th>
              <th>State</th>
              <th>Modal ₹</th>
              <th>Voice</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((d, i) => (
              <tr
                key={i}
                style={{
                  background: i === 0 ? "#fff9c4" : "white"
                }}
              >
                <td>
                  {i === 0 && "⭐ "} {d.Market}
                </td>
                <td>{d.State}</td>
                <td>₹{d.Modal_x0020_Price}</td>
                <td>
                  <button
                    onClick={() =>
                      speakPrice({
                        crop: selectedCrop,
                        market: d.Market,
                        price: d.Modal_x0020_Price,
                        state: d.State,
                        lang
                      })
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "18px"
                    }}
                  >
                    🔊
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PriceListPage;
