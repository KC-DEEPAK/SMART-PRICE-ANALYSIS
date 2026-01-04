import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function PriceTrendGraph({ cropData = [], cropName }) {
  if (!cropData.length) return null;

  const labels = cropData.map(
    item => `${item.Market} (${item.State})`
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Modal Price (₹)",
        data: cropData.map(item =>
          Number(item.Modal_x0020_Price)
        ),
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>{cropName} – Price Trend</h3>
      <Line data={data} />
    </div>
  );
}

export default PriceTrendGraph;
