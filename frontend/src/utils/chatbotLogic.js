import diseaseData from "../data/diseaseFertilizerData";
import fertilizerData from "../data/fertilizerData";

const GEMINI_API_KEY = "AIzaSyCjJwjTM5tQOJgIjd3QfWaGXHDa0qBpTpA";

export const generateBotResponse = async (message, cropPriceData) => {
  try {
    // Summarize the top data for the AI context to avoid hitting payload limits
    const topPrices = cropPriceData ? cropPriceData.slice(0, 15).map(d => `${d.Commodity || d.commodity}: ₹${d.Modal_x0020_Price} at ${d.Market}`).join(", ") : "No price data available.";

    const systemPrompt = `You are a Smart Farmer Assistant, an AI expert in agriculture. 
You provide advice on crop prices, diseases, fertilizers, and general farming tips.
Be concise, helpful, and use simple language suitable for farmers.

Here is some current market price data for context:
${topPrices}

Please answer the following user question:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + message }] }
        ]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "Sorry, I couldn't understand that or generate a response at the moment. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the Smart Farmer AI service. Please try again later.";
  }
};
