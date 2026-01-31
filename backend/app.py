from flask import Flask, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)

# ✅ ENABLE CORS (fixes frontend fetch error)
CORS(app)

DATA = []

# ✅ SAFE CSV PATH (VERY IMPORTANT)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "crops.csv")

# 🔹 LOAD CSV DATA
with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        DATA.append(row)

# 🔹 API ENDPOINT
@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify(DATA)

# 🔹 HEALTH CHECK
@app.route("/")
def home():
    return "Backend is running successfully 🚀"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
