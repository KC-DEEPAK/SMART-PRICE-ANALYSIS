import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import CategoryList from "../components/CategoryList";
import TopBestCrops from "../components/TopBestCrops";
import ProductGroups from "../components/ProductGroups";

function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <>
      {/* CATEGORY SUMMARY CARDS */}
      <DashboardCards data={data} />

      {/* TOP 5 BEST CROPS */}
      <TopBestCrops data={data} />

      {/* PRODUCT GROUPS (Grains, Pulses, etc.) */}
      <ProductGroups
        crops={[
          ...new Set(
            data.map(
              d =>
                d.Commodity ||
                d.commodity ||
                d.Crop ||
                d.crop_name
            )
          )
        ]}
        onCropSelect={crop => setSelectedCrop(crop)}
      />

      {/* MARKET PRICES FOR SELECTED CROP */}
      {selectedCrop && (
        <CategoryList
          data={data.filter(d => {
            const name =
              d.Commodity ||
              d.commodity ||
              d.Crop ||
              d.crop_name;

            return (
              name &&
              name.toLowerCase().includes(selectedCrop.toLowerCase())
            );
          })}
          category={selectedCrop}
        />
      )}
    </>
  );
}

export default Dashboard;
