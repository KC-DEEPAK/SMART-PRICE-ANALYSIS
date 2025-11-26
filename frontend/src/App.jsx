import React, { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/latest");
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = data.filter(
      (item) =>
        (item.commodity && item.commodity.toLowerCase().includes(value)) ||
        (item.state && item.state.toLowerCase().includes(value)) ||
        (item.district && item.district.toLowerCase().includes(value))
    );
    setFilteredData(filtered);
  };

  return (
    <div style={{ fontFamily: "Arial", backgroundColor: "#f8f8f8", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "green", textAlign: "center" }}>🌾 Crop Price Dashboard</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="🔍 Search by crop, state, or district..."
          style={{
            width: "60%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading data...</p>
      ) : filteredData.length === 0 ? (
        <p style={{ textAlign: "center" }}>No matching results found.</p>
      ) : (
        filteredData.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              margin: "15px auto",
              padding: "20px",
              borderRadius: "12px",
              width: "80%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#333" }}>{item.commodity}</h2>
            <p>📍 <strong>State:</strong> {item.state}</p>
            <p>🏙️ <strong>District:</strong> {item.district}</p>
            <p>🏬 <strong>Market:</strong> {item.market}</p>
            <p>📅 <strong>Date:</strong> {item.arrival_date}</p>
            <p>💰 <strong>Price:</strong> ₹{item.modal_price}</p>
          </div>
        ))
      )}
    </div>
  );
}
