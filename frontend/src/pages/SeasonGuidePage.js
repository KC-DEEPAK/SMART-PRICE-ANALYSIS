import React from "react";
import SeasonalRecommendation from "../components/SeasonalRecommendation";

function SeasonGuidePage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🌤️ Seasonal Crop Guide</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Discover the best crops to plant and sell based on the current season in India.
      </p>
      <SeasonalRecommendation />
    </div>
  );
}

export default SeasonGuidePage;
