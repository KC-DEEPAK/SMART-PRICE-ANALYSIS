import pandas as pd
import matplotlib.pyplot as plt
import os

DATA_FILE = "data/full_daily_prices.csv"

if not os.path.exists(DATA_FILE):
    print(f"❌ File not found: {DATA_FILE}")
    print("Please run fetch_data.py first to download real-time data.")
else:
    print("📊 Analyzing crop price trends...")

    try:
        df = pd.read_csv(DATA_FILE)
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

        # Find date column
        date_col = next((c for c in df.columns if "date" in c), None)
        if not date_col:
            print("⚠️ No valid 'date' column found — cannot compute monthly trend.")
            exit()

        # Find price column (supports multiple naming patterns)
        price_col = next(
            (
                c
                for c in df.columns
                if "modal" in c and "price" in c
            ),
            None,
        )

        if not price_col:
            print("⚠️ Could not find modal price column. Available columns:")
            print(df.columns.tolist())
            exit()

        # Prepare data
        df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
        df["month"] = df[date_col].dt.strftime("%b")
        df[price_col] = pd.to_numeric(df[price_col], errors="coerce")

        # Group and average
        avg_monthly = (
            df.groupby(["commodity", "month"])[price_col]
            .mean()
            .reset_index()
        )

        # Find best month
        best_months = (
            avg_monthly.loc[avg_monthly.groupby("commodity")[price_col].idxmax()]
            .reset_index(drop=True)
        )

        print("\n🌾 Best Month to Sell Each Crop:")
        print(best_months)

        # Plot for few popular crops
        for crop in ["Maize", "Paddy", "Wheat", "Tomato", "Turmeric"]:
            crop_data = avg_monthly[
                avg_monthly["commodity"].str.contains(crop, case=False, na=False)
            ]
            if not crop_data.empty:
                plt.figure(figsize=(8, 4))
                plt.bar(
                    crop_data["month"],
                    crop_data[price_col],
                    color="#81C784",
                    edgecolor="black",
                )
                plt.title(f"Average Monthly Price for {crop}")
                plt.xlabel("Month")
                plt.ylabel("Price (₹/quintal)")
                plt.grid(axis="y", linestyle="--", alpha=0.6)
                plt.tight_layout()
                plt.show()
            else:
                print(f"⚠️ No data found for {crop}")

    except Exception as e:
        print(f"❌ Error analyzing data: {e}")
