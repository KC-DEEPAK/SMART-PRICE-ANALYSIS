export const cropCategoryMap = {
  Tomato: "Vegetables",
  Onion: "Vegetables",
  Potato: "Vegetables",
  "Green Chilli": "Vegetables",

  Apple: "Fruits",
  Banana: "Fruits",
  Mango: "Fruits",

  Rice: "Others",
  Wheat: "Others",
  Cotton: "Others"
};

export const getCategory = (crop) => {
  if (!crop) return "Others";
  return cropCategoryMap[crop.trim()] || "Others";
};
