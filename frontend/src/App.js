import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  // Labels for multi-language support
  const labels = {
    en: { commodity: "Commodity", market: "Market", price: "Modal Price", state: "State", search: "Search Crop" },
    hi: { commodity: "फसल", market: "बाजार", price: "मूल्य", state: "राज्य", search: "फसल खोजें" },
    te: { commodity: "పంట", market: "మార్కెట్", price: "ధర", state: "రాజ్యం", search: "పంట శోధించండి" },
    kn: { commodity: "ಫಸಲು", market: "ಮಾರುಕಟ್ಟೆ", price: "ಬೆಲೆ", state: "ರಾಜ್ಯ", search: "ಫಸಲು ಹುಡುಕಿ" }
  };

  // Filtered data for search
  const filteredData = data.filter(item =>
    item.Commodity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Crop Market Prices</h2>

      <div className="controls">
        {/* Language Selector */}
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="te">తెలుగు</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>

        {/* Small Search Bar */}
        <input
          type="text"
          placeholder={labels[language].search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>{labels[language].commodity}</th>
            <th>{labels[language].market}</th>
            <th>{labels[language].price}</th>
            <th>{labels[language].state}</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.Commodity}</td>
              <td>{item.Market}</td>
              <td>₹{item.Modal_x0020_Price}</td>
              <td>{item.State}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
