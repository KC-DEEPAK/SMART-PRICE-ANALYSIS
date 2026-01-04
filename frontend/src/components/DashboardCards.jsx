import "./DashboardCards.css";

function DashboardCards({ data = [], onCategoryClick }) {
  let vegetables = 0;
  let fruits = 0;
  let others = 0;

  data.forEach(item => {
    const crop =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name ||
      "";

    const name = crop.toLowerCase();

    // 🥦 VEGETABLE KEYWORDS
    if (
      name.includes("tomato") ||
      name.includes("onion") ||
      name.includes("chilli") ||
      name.includes("brinjal") ||
      name.includes("potato") ||
      name.includes("gourd") ||
      name.includes("beans") ||
      name.includes("cabbage") ||
      name.includes("cauliflower") ||
      name.includes("okra") ||
      name.includes("ladies finger") ||
      name.includes("vegetable")
    ) {
      vegetables++;
    }

    // 🍎 FRUIT KEYWORDS
    else if (
      name.includes("apple") ||
      name.includes("banana") ||
      name.includes("mango") ||
      name.includes("orange") ||
      name.includes("papaya") ||
      name.includes("grapes") ||
      name.includes("guava") ||
      name.includes("pineapple") ||
      name.includes("water melon") ||
      name.includes("melon")
    ) {
      fruits++;
    }

    // 🌾 EVERYTHING ELSE
    else {
      others++;
    }
  });

  const handleClick = category => {
    if (typeof onCategoryClick === "function") {
      onCategoryClick(category);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">🌾 Crop Dashboard</h2>

      <div className="card-container">
        <div
          className="card green"
          onClick={() => handleClick("Vegetables")}
        >
          <h3>🥦 Vegetables</h3>
          <h1>{vegetables}</h1>
          <p>Crops</p>
        </div>

        <div
          className="card orange"
          onClick={() => handleClick("Fruits")}
        >
          <h3>🍎 Fruits</h3>
          <h1>{fruits}</h1>
          <p>Crops</p>
        </div>

        <div
          className="card blue"
          onClick={() => handleClick("Others")}
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
