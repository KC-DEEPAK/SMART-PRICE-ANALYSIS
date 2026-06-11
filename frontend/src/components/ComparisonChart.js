import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

function ComparisonChart({ cropA, cropB, data }) {
  // Guard: need both crop names and the full data array
  if (!cropA || !cropB || !data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
        Select two crops to see the comparison chart.
      </div>
    );
  }

  const getCropName = d =>
    d.Commodity || d.commodity || d.Crop || d.crop_name || "";

  // Filter and sort by modal price (descending) for each crop
  const filterCrop = cropName =>
    data
      .filter(d => getCropName(d) === cropName && d.Modal_x0020_Price)
      .sort((a, b) => Number(b.Modal_x0020_Price) - Number(a.Modal_x0020_Price))
      .slice(0, 15); // limit to top-15 markets for readability

  const cropAData = filterCrop(cropA);
  const cropBData = filterCrop(cropB);

  if (cropAData.length === 0 && cropBData.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
        No market data found for either crop.
      </div>
    );
  }

  // Build a unified label list of markets that appear in either crop
  const marketsA = cropAData.map(d => d.Market || "Unknown");
  const marketsB = cropBData.map(d => d.Market || "Unknown");
  const allMarkets = [...new Set([...marketsA, ...marketsB])];

  // Map market → price for each crop (null if missing)
  const priceMapA = Object.fromEntries(
    cropAData.map(d => [d.Market || "Unknown", Number(d.Modal_x0020_Price)])
  );
  const priceMapB = Object.fromEntries(
    cropBData.map(d => [d.Market || "Unknown", Number(d.Modal_x0020_Price)])
  );

  const chartData = {
    labels: allMarkets,
    datasets: [
      {
        label: `${cropA} (₹)`,
        data: allMarkets.map(m => priceMapA[m] ?? null),
        backgroundColor: "rgba(46, 125, 50, 0.75)",
        borderColor: "#2e7d32",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: `${cropB} (₹)`,
        data: allMarkets.map(m => priceMapB[m] ?? null),
        backgroundColor: "rgba(198, 40, 40, 0.75)",
        borderColor: "#c62828",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "Inter, sans-serif", size: 13 },
          padding: 16,
          usePointStyle: true,
          pointStyle: "rectRounded",
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            if (ctx.raw === null || ctx.raw === undefined)
              return `${ctx.dataset.label}: No data`;
            return `${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString("en-IN")}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "Inter, sans-serif", size: 11 },
          maxRotation: 45,
          minRotation: 30,
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          font: { family: "Inter, sans-serif", size: 11 },
          callback: v => `₹${Number(v).toLocaleString("en-IN")}`,
        }
      }
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "320px" }}>
      <Bar data={chartData} options={options} />
      {(cropAData.length === 0 || cropBData.length === 0) && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 16px",
            background: "#fff8e1",
            borderLeft: "4px solid #ffa000",
            borderRadius: "6px",
            fontSize: "13px",
            color: "#795548",
          }}
        >
          ⚠️{" "}
          {cropAData.length === 0
            ? `No data found for "${cropA}".`
            : `No data found for "${cropB}".`}{" "}
          Showing available data only.
        </div>
      )}
    </div>
  );
}

export default ComparisonChart;
