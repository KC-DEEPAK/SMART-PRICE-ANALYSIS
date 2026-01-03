import "./DashboardCards.css";
import { getCategory } from "../utils/cropCategories";

function DashboardCards({ data = [], onCategoryClick }) {

  const categories = {
    Vegetables: [],
    Fruits: [],
    Others: []
  };

  data.forEach(item => {
    const cropName =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name;

    const category = getCategory(cropName);
    categories[category].push(item);
  });

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">🌾 Crop Categories</h2>

      <div className="card-container">
        <div
          className="card green clickable"
          onClick={() => onCategoryClick("Vegetables")}
        >
          <h3>🥦 Vegetables</h3>
          <h1>{categories.Vegetables.length}</h1>
        </div>

        <div
          className="card orange clickable"
          onClick={() => onCategoryClick("Fruits")}
        >
          <h3>🍎 Fruits</h3>
          <h1>{categories.Fruits.length}</h1>
        </div>

        <div
          className="card blue clickable"
          onClick={() => onCategoryClick("Others")}
        >
          <h3>🌾 Others</h3>
          <h1>{categories.Others.length}</h1>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
