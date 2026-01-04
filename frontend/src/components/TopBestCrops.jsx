function TopBestCrops({ data = [] }) {
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
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginTop: "20px"
      }}
    >
      <h3>🔥 Top 5 Best Crops Today</h3>

      <table width="100%" cellPadding="8">
        <thead>
          <tr>
            <th align="left">Crop</th>
            <th align="left">Best Market</th>
            <th align="left">State</th>
            <th align="right">Modal ₹</th>
          </tr>
        </thead>

        <tbody>
          {top5.map((item, i) => (
            <tr key={i}>
              <td>{item.crop}</td>
              <td>{item.market}</td>
              <td>{item.state}</td>
              <td align="right">₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopBestCrops;
