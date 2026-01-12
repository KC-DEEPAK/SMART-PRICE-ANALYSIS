import { useEffect, useState } from "react";
import PriceListGraph from "../components/PriceListGraph";
import { speakDecision } from "../utils/speakDecision";

function PriceListPage() {
  const [data, setData] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

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
    return name === selectedCrop;
  });

  const sortedData = [...cropData].sort(
    (a, b) =>
      Number(b.Modal_x0020_Price) -
      Number(a.Modal_x0020_Price)
  );

  const allPrices = sortedData.map(d =>
    Number(d.Modal_x0020_Price)
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Crop Price List</h2>

      <select
        value={selectedCrop}
        onChange={e => setSelectedCrop(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      >
        <option value="">🌾 Select Crop</option>
        {crops.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {selectedCrop && (
        <>
          <PriceListGraph data={sortedData} />

          <table
            border="1"
            width="100%"
            cellPadding="8"
            style={{ marginTop: "20px" }}
          >
            <thead style={{ background: "#e8f5e9" }}>
              <tr>
                <th>Market</th>
                <th>State</th>
                <th>Price</th>
                <th>Voice</th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((d, i) => (
                <tr
                  key={i}
                  style={{
                    background:
                      i === 0 ? "#fff9c4" : "white"
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
                        speakDecision({
                          userName: user.name || "Farmer",
                          crop: selectedCrop,
                          market: d.Market,
                          state: d.State,
                          price: Number(
                            d.Modal_x0020_Price
                          ),
                          allPrices
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
        </>
      )}
    </div>
  );
}

export default PriceListPage;
