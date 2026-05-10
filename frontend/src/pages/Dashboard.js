import { useEffect, useState, useRef } from "react";
import DashboardCards from "../components/DashboardCards";
import CategoryList from "../components/CategoryList";
import TopBestCrops from "../components/TopBestCrops";
import { speakBestMarket } from "../utils/speakPrice";
import { useLanguage } from "../context/LanguageContext";

function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const hasSpoken = useRef(false);
  const { t } = useLanguage();

  // 🔄 Load data
  useEffect(() => {
    fetch("https://smart-price-analysis-1.onrender.com/api/data")
      .then(res => res.json())
      .then(json => {
        setData(json);
      })
      .catch(err => console.error(err));
  }, []);

  // 🔊 MANUAL TRIGGER (IMPORTANT FOR BROWSER)
  const handleSpeakBestMarket = () => {
    if (!data.length) return;

    // 🕒 Time-based greeting
    const hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 17) greeting = "Good afternoon";

    // ⭐ Find best market
    const best = data.reduce((max, cur) =>
      Number(cur.Modal_x0020_Price) >
      Number(max.Modal_x0020_Price)
        ? cur
        : max
    );

    const crop =
      best.Commodity ||
      best.commodity ||
      best.Crop ||
      best.crop_name;

    speakBestMarket({
      crop,
      market: best.Market,
      state: best.State,
      price: best.Modal_x0020_Price,
      greeting
    });

    // Save spoken date
    localStorage.setItem(
      "spokenDate",
      new Date().toDateString()
    );
    hasSpoken.current = true;
  };

  return (
    <div className="page-container">
      {/* 🔊 VOICE BUTTON */}
      <div className="mb-4 flex items-center justify-between">
        <h2 style={{margin: 0}}>{t.cropDashboard}</h2>
        <button
          onClick={handleSpeakBestMarket}
          className="btn-primary"
        >
          {t.hearBestPrice || "🔊 Hear Today’s Best Market"}
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <DashboardCards
        data={data}
        onCategoryClick={setSelectedCategory}
      />

      {/* TOP CROPS */}
      <TopBestCrops data={data} />

      {/* CATEGORY DETAILS */}
      {selectedCategory && (
        <CategoryList
          data={data}
          category={selectedCategory}
        />
      )}
    </div>
  );
}

export default Dashboard;
