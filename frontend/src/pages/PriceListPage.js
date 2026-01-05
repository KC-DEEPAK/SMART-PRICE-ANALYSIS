import { useEffect, useState } from "react";

function PriceListPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(json => {
        console.log("PRICE LIST DATA:", json);
        setData(Array.isArray(json) ? json : []);
      })
      .catch(err => {
        console.error("FETCH ERROR:", err);
        setData([]);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Price List</h2>

      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table border="1" width="100%" cellPadding="8">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Market</th>
              <th>District</th>
              <th>State</th>
              <th>Modal ₹</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => {
              const crop =
                item.Commodity ||
                item.commodity ||
                item.Crop ||
                item.crop_name;

              return (
                <tr key={i}>
                  <td>{crop}</td>
                  <td>{item.Market}</td>
                  <td>{item.District}</td>
                  <td>{item.State}</td>
                  <td>{item.Modal_x0020_Price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PriceListPage;
