export const cropImageMap = {
  Tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80",
  Onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=150&q=80",
  Potato: "https://images.unsplash.com/photo-1518977622835-4020b666da81?auto=format&fit=crop&w=150&q=80",
  "Green Chilli": "https://images.unsplash.com/photo-1589178225586-30c144e532b9?auto=format&fit=crop&w=150&q=80",
  Apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&w=150&q=80",
  Banana: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=150&q=80",
  Mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=150&q=80",
  Rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=150&q=80",
  Wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=150&q=80",
  Cotton: "https://images.unsplash.com/photo-1576014131341-f11181f5c66b?auto=format&fit=crop&w=150&q=80",
  Maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=150&q=80",
  Jute: "https://images.unsplash.com/photo-1601001815894-0e3c59cb9e6c?auto=format&fit=crop&w=150&q=80",
  Coffee: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=150&q=80",
  Tea: "https://images.unsplash.com/photo-1597481499750-3e6b22687e12?auto=format&fit=crop&w=150&q=80",  
  Other: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=150&q=80"
};

export const getCropImage = (cropName) => {
  if (!cropName) return cropImageMap.Other;
  // Try exact match
  if (cropImageMap[cropName]) return cropImageMap[cropName];
  
  // Try case-insensitive matching
  const normalizedCropName = cropName.trim().toLowerCase();
  for (const [key, image] of Object.entries(cropImageMap)) {
    if (key.toLowerCase() === normalizedCropName) {
      return image;
    }
  }

  // Fallback map for similar names
  if (normalizedCropName.includes('tomato')) return cropImageMap.Tomato;
  if (normalizedCropName.includes('potato')) return cropImageMap.Potato;
  if (normalizedCropName.includes('onion')) return cropImageMap.Onion;
  if (normalizedCropName.includes('chilli') || normalizedCropName.includes('chili') || normalizedCropName.includes('pepper')) return cropImageMap["Green Chilli"];
  if (normalizedCropName.includes('apple')) return cropImageMap.Apple;
  if (normalizedCropName.includes('banana')) return cropImageMap.Banana;
  if (normalizedCropName.includes('mango')) return cropImageMap.Mango;
  if (normalizedCropName.includes('rice') || normalizedCropName.includes('paddy')) return cropImageMap.Rice;
  if (normalizedCropName.includes('wheat') || normalizedCropName.includes('grain')) return cropImageMap.Wheat;
  if (normalizedCropName.includes('cotton')) return cropImageMap.Cotton;
  if (normalizedCropName.includes('maize') || normalizedCropName.includes('corn')) return cropImageMap.Maize;

  // Use LoremFlickr for other crops by extracting a clean name
  const cleanName = cropName.replace(/\(.*?\)/g, '').trim();
  return `https://loremflickr.com/150/150/${encodeURIComponent(cleanName)}`;
};
