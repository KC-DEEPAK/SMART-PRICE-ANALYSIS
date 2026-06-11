import diseaseData from "../data/diseaseFertilizerData";
import fertilizerData from "../data/fertilizerData";
import { CHAT_API_URL } from "./api";

export const generateBotResponse = async (message, cropPriceData) => {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        cropPriceData
      })
    });

    const data = await response.json();
    if (data.success && data.reply) {
      return data.reply;
    }
    
    return data.error || "Sorry, I couldn't understand that or generate a response at the moment. Please try again.";
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return "Error connecting to the Smart Farmer AI service. Please try again later.";
  }
};

