import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function ComparisonChart({ cropA, cropB, data }) {
  if (!cropA || !cropB) return null;

  const filterCrop = crop =>
    data
      .filter(d => {
        const name =
          d.Commodity || d.commodity || d.Crop || d.crop_name;
        return name === crop;
      })
      .sort(
        (a, b) =>
          new Date(a.Arrival_Date) - new Date(b.Arrival_Date)
      );

  const cropAData = filterCrop(cropA);
  const cropBData = filterCrop(cropB);

  const labels = cropAData.map(d => d.Arrival_Date);

  const chartData = {
    labels,
    datasets: [
      {
        label: cropA,
        data: cropAData.map(d =>
          Number(d.Modal_x0020_Price)
        ),
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46,125,50,0.2)",
        tension: 0.3
      },
      {
        label: cropB,
        data: cropBData.map(d =>
          Number(d.Modal_x0020_Price)
        ),
        borderColor: "#c62828",
        backgroundColor: "rgba(198,40,40,0.2)",
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📊 Crop vs Crop Price Comparison</h3>
      <Line data={chartData} />
    </div>
  );
}

export default ComparisonChart;
