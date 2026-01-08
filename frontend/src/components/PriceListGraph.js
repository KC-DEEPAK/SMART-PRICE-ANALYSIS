import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function PriceListGraph({ data }) {
  if (!data || data.length === 0) return null;

  const labels = data.map(d => d.Market);
  const prices = data.map(d =>
    Number(d.Modal_x0020_Price)
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Modal Price (₹)",
        data: prices,
        backgroundColor: "#4caf50"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Price (₹)"
        }
      },
      x: {
        title: {
          display: true,
          text: "Markets"
        }
      }
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📊 Market Price Comparison</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default PriceListGraph;
