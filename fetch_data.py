import requests
import os

# ✅ Agmarknet API URL and key
API_KEY = "579b464db66ec23bdd00000114ba38fe81164b9e5e1e88eb4ce2604f"
RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"  # Daily Market Prices dataset

# ✅ Base URL
DATA_URL = f"https://api.data.gov.in/resource/{RESOURCE_ID}"

# ✅ File save location
LOCAL_PATH = "data/full_daily_prices.csv"


def fetch_daily_data():
    print("📡 Fetching data from Data.gov.in ...")

    # Fetch more records for trend analysis
    params = {
        "api-key": API_KEY,
        "format": "csv",
        "limit": 10000  # fetch more historical data
    }

    # Send request
    resp = requests.get(DATA_URL, params=params)

    # Handle response
    if resp.status_code == 200:
        os.makedirs("data", exist_ok=True)
        with open(LOCAL_PATH, "wb") as f:
            f.write(resp.content)
        print(f"✅ Data successfully downloaded and saved to {LOCAL_PATH}")
    else:
        print(f"❌ Failed to fetch data: {resp.status_code}")
        print(resp.text)


if __name__ == "__main__":
    fetch_daily_data()
