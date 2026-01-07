import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import CategoryList from "../components/CategoryList";
import TopBestCrops from "../components/TopBestCrops";

function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔄 LOAD DATA + SAVE ALL CROPS
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(json => {
        // save full data
        setData(json);

        // ✅ EXTRACT ALL UNIQUE CROP NAMES
        const allCrops = [
          ...new Set(
            json
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

        // ✅ SAVE TO LOCAL STORAGE
        localStorage.setItem(
          "allCrops",
          JSON.stringify(allCrops)
        );
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <div>
      {/* CATEGORY CARDS */}
      <DashboardCards
        data={data}
        onCategoryClick={category =>
          setSelectedCategory(category)
        }
      />

      {/* TOP BEST CROPS */}
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
