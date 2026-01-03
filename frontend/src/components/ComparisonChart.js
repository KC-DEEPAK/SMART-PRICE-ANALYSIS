import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

// ✅ REGISTER SCALES & ELEMENTS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ComparisonChart({ data }) {

  const cropMap = {};

  data.forEach(item => {
    const crop = item.Commodity;
    if (!cropMap[crop]) {
      cropMap[crop] = item.Modal_x0020_Price;
    }
  });

  const labels = Object.keys(cropMap).slice(0, 10);
  const prices = labels.map(crop => cropMap[crop]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Modal Price",
        data: prices,
      }
    ]
  };

  return (
    <div style={{ width: "700px", marginTop: "40px" }}>
      <Bar data={chartData} />
    </div>
  );
}

export default ComparisonChart;
