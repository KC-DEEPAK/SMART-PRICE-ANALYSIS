import { useLanguage } from "../context/LanguageContext";

function TopBestCrops({ data = [] }) {
  const { t } = useLanguage();

  if (!data.length) return null;

  // Group by crop and find best market per crop
  const cropBestMap = {};

  data.forEach(item => {
    const crop =
      item.Commodity ||
      item.commodity ||
      item.Crop ||
      item.crop_name;

    const price = Number(item.Modal_x0020_Price || 0);

    if (!cropBestMap[crop] || price > cropBestMap[crop].price) {
      cropBestMap[crop] = {
        crop,
        market: item.Market,
        state: item.State,
        price
      };
    }
  });

  // Take top 5 crops by price
  const top5 = Object.values(cropBestMap)
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  return (
    <div className="agri-card" style={{ marginTop: "24px" }}>
      <h3 style={{ marginTop: 0 }}>🔥 Top 5 Best Crops Today</h3>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>{t.selectCrop ? t.selectCrop.replace("🌾 Select ", "") : "Crop"}</th>
              <th>{t.bestMarket ? t.bestMarket.replace("🏆 ", "").replace(":", "") : "Best Market"}</th>
              <th>{t.state}</th>
              <th align="right">Modal ₹</th>
            </tr>
          </thead>

          <tbody>
            {top5.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: "var(--primary-dark)" }}>{item.crop}</td>
                <td>{item.market}</td>
                <td>{item.state}</td>
                <td align="right" style={{ fontWeight: 600, color: "var(--primary-green)" }}>₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopBestCrops;
