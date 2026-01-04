import PriceTrendGraph from "./PriceTrendGraph";

function CategoryList({ data = [], category }) {
  if (!data.length) {
    return <h3 style={{ padding: "20px" }}>No data available</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category} – Market Prices</h2>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Market</th>
            <th>District</th>
            <th>State</th>
            <th>Min ₹</th>
            <th>Modal ₹</th>
            <th>Max ₹</th>
          </tr>
        </thead>

        <tbody>
          {[...data]
            .sort(
              (a, b) =>
                Number(b.Modal_x0020_Price) -
                Number(a.Modal_x0020_Price)
            )
            .map((item, i) => (
              <tr key={i}>
                <td>{item.Market}</td>
                <td>{item.District}</td>
                <td>{item.State}</td>
                <td>{item.Min_x0020_Price}</td>
                <td>{item.Modal_x0020_Price}</td>
                <td>{item.Max_x0020_Price}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* PRICE TREND GRAPH */}
      <PriceTrendGraph cropName={category} cropData={data} />
    </div>
  );
}

export default CategoryList;
