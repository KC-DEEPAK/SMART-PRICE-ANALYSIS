import { useState } from "react";

function FavoriteCrops({ allCrops = [] }) {
  const saved =
    JSON.parse(localStorage.getItem("favoriteCrops")) || [];

  const [favorites, setFavorites] = useState(saved);

  const toggleCrop = crop => {
    let updated;

    if (favorites.includes(crop)) {
      updated = favorites.filter(c => c !== crop);
    } else {
      updated = [...favorites, crop];
    }

    setFavorites(updated);
    localStorage.setItem(
      "favoriteCrops",
      JSON.stringify(updated)
    );
  };

  if (!allCrops.length) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h3>⭐ Select Your Favorite Crops</h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "10px"
        }}
      >
        {allCrops.map(crop => (
          <button
            key={crop}
            onClick={() => toggleCrop(crop)}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: favorites.includes(crop)
                ? "2px solid green"
                : "1px solid #ccc",
              background: favorites.includes(crop)
                ? "#e8f5e9"
                : "white",
              cursor: "pointer"
            }}
          >
            {favorites.includes(crop) ? "⭐ " : ""}
            {crop}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FavoriteCrops;
