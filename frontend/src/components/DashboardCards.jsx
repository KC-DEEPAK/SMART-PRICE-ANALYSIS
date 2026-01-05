import "./DashboardCards.css";
import { getCategory } from "../utils/cropCategories";

function DashboardCards({ data = [], onCategoryClick }) {
  const vegetables = data.filter(d =>
    getCategory(
      d.Commodity || d.commodity || d.Crop || d.crop_name
    ) === "Vegetables"
  ).length;

  const fruits = data.filter(d =>
    getCategory(
      d.Commodity || d.commodity || d.Crop || d.crop_name
    ) === "Fruits"
  ).length;

  const others = data.length - vegetables - fruits;

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">🌾 Crop Dashboard</h2>

      <div className="card-container">
        <div
          className="card green"
          onClick={() => onCategoryClick("Vegetables")}
        >
          <h3>🥦 Vegetables</h3>
          <h1>{vegetables}</h1>
          <p>Crops</p>
        </div>

        <div
          className="card orange"
          onClick={() => onCategoryClick("Fruits")}
        >
          <h3>🍎 Fruits</h3>
          <h1>{fruits}</h1>
          <p>Crops</p>
        </div>

        <div
          className="card blue"
          onClick={() => onCategoryClick("Others")}
        >
          <h3>🌾 Others</h3>
          <h1>{others}</h1>
          <p>Crops</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
