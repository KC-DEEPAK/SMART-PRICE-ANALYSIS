function PriceListPage({ data }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Crop Price List</h2>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Market</th>
            <th>State</th>
            <th>Modal Price (₹)</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Commodity}</td>
              <td>{item.Market}</td>
              <td>{item.State}</td>
              <td>{item.Modal_x0020_Price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PriceListPage;
