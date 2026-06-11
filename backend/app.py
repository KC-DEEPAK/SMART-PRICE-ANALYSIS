from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import csv
import os
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

DATA = []

# ✅ CORRECT CSV PATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "crops.csv")

if os.path.exists(CSV_PATH):
    with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            DATA.append(row)

@app.route("/api/data")
def get_data():
    return jsonify(DATA)

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        message = data.get("message", "").strip()
        crop_price_data = data.get("cropPriceData", [])
        
        if not message:
            return jsonify({"success": False, "error": "Message cannot be empty"}), 400
            
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
            return jsonify({"success": False, "error": "Gemini API key is not configured on the server"}), 500
        
        # Format crop price data for AI context
        if crop_price_data:
            top_prices = ", ".join([
                f"{d.get('Commodity', d.get('commodity', 'Unknown'))}: ₹{d.get('Modal_x0020_Price', d.get('modal_price', '0'))} at {d.get('Market', 'Unknown')}"
                for d in crop_price_data[:15]
            ])
        else:
            top_prices = "No price data available."
            
        system_prompt = f"""You are a Smart Farmer Assistant, an AI expert in agriculture. 
You provide advice on crop prices, diseases, fertilizers, and general farming tips.
Be concise, helpful, and use simple language suitable for farmers.

Here is some current market price data for context:
{top_prices}

Please answer the following user question:"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
        
        response = requests.post(url, json={
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_prompt}\n\nUser Question: {message}"}]
                }
            ]
        }, headers={"Content-Type": "application/json"})
        
        if response.status_code != 200:
            try:
                error_details = response.json()
                error_msg = error_details.get("error", {}).get("message", "Unknown Gemini API error")
            except Exception:
                error_msg = response.text
            return jsonify({"success": False, "error": f"Gemini API error: {error_msg}"}), response.status_code
            
        res_data = response.json()
        if res_data.get("candidates") and len(res_data["candidates"]) > 0:
            text_response = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return jsonify({"success": True, "reply": text_response})
            
        return jsonify({"success": False, "error": "No response candidates returned from Gemini"}), 500

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500

@app.route("/")
def home():
    return "Backend is running successfully 🚀"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
