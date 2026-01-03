import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import CategoryList from "../components/CategoryList";

function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(json => {
        console.log("✅ Backend data loaded:", json.length);
        setData(json);
      });
  }, []);

  console.log("👉 Selected category:", selectedCategory);

  return (
    <>
      <DashboardCards
        data={data}
        onCategoryClick={setSelectedCategory}
      />

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
