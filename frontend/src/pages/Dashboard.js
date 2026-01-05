import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import CategoryList from "../components/CategoryList";
import TopBestCrops from "../components/TopBestCrops";

function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(json => {
        setData(json);
      });
  }, []);

  return (
    <>
      <DashboardCards
        data={data}
        onCategoryClick={setSelectedCategory}
      />

      <TopBestCrops data={data} />

      {selectedCategory && (
        <CategoryList
          data={data}
          category={selectedCategory}
        />
      )}
    </>
  );
}

export default Dashboard;
