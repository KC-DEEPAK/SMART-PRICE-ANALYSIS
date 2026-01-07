import { useState } from "react";
import "./PriceAlertSettings.css";

function PriceAlertSettings({ crops = [] }) {
  const [crop, setCrop] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const saveAlert = () => {
    if (!crop) {
      alert("Please select crop");
      return;
    }

    localStorage.setItem(
      "priceAlert",
      JSON.stringify({
        crop,
        minPrice,
        maxPrice
      })
    );

    alert("✅ Price alert saved");
  };

  return (
    <div className="alert-card">
      <h3>🔔 Price Alert Settings</h3>

      <select
        value={crop}
        onChange={e => setCrop(e.target.value)}
      >
        <option value="">🌾 Select Crop</option>
        {crops
          .filter(Boolean)
          .map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
      </select>

      <input
        type="number"
        placeholder="Alert if price below ₹"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Alert if price above ₹"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
      />

      <button onClick={saveAlert}>
        Save Alert
      </button>
    </div>
  );
}

export default PriceAlertSettings;
