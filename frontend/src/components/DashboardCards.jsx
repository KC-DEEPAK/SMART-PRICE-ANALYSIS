import "./DashboardCards.css";
import { getCategory } from "../utils/cropCategories";
import { useLanguage } from "../context/LanguageContext";

function DashboardCards({ data = [], onCategoryClick }) {
  const { t } = useLanguage();

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
    <div className="mb-4">
      <div className="dashboard-grid">
        <div
          className="agri-card"
          style={{ borderLeft: "5px solid var(--primary-light)", cursor: "pointer" }}
          onClick={() => onCategoryClick("Vegetables")}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "var(--text-gray)" }}>{t.vegetables}</h3>
          <h1 style={{ margin: "0", fontSize: "42px", color: "var(--primary-dark)" }}>{vegetables}</h1>
          <p style={{ margin: "5px 0 0 0", color: "var(--text-light)" }}>{t.cropsTracked}</p>
        </div>

        <div
          className="agri-card"
          style={{ borderLeft: "5px solid var(--accent-orange)", cursor: "pointer" }}
          onClick={() => onCategoryClick("Fruits")}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "var(--text-gray)" }}>{t.fruits}</h3>
          <h1 style={{ margin: "0", fontSize: "42px", color: "var(--primary-dark)" }}>{fruits}</h1>
          <p style={{ margin: "5px 0 0 0", color: "var(--text-light)" }}>{t.cropsTracked}</p>
        </div>

        <div
          className="agri-card"
          style={{ borderLeft: "5px solid var(--accent-blue)", cursor: "pointer" }}
          onClick={() => onCategoryClick("Others")}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "var(--text-gray)" }}>{t.others}</h3>
          <h1 style={{ margin: "0", fontSize: "42px", color: "var(--primary-dark)" }}>{others}</h1>
          <p style={{ margin: "5px 0 0 0", color: "var(--text-light)" }}>{t.cropsTracked}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
