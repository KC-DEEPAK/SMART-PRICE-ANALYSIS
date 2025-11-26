import pandas as pd
import numpy as np
import sqlite3
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import warnings
warnings.filterwarnings('ignore')

class SimpleCropPriceAnalyzer:
    def __init__(self, db_path='crop_prices.db'):
        self.db_path = db_path
        self.df = None
        
    def load_data(self):
        """Load data from database"""
        try:
            conn = sqlite3.connect(self.db_path)
            self.df = pd.read_sql_query("SELECT * FROM crop_prices", conn)
            conn.close()
            
            print(f"✅ Loaded {len(self.df)} records")
            print(f"📅 Date range: {self.df['arrival_date'].min()} to {self.df['arrival_date'].max()}")
            
            # Convert date column
            self.df['arrival_date'] = pd.to_datetime(self.df['arrival_date'])
            
            return True
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def explore_data(self):
        """Basic data exploration"""
        print("\n🔍 DATA EXPLORATION")
        print("=" * 50)
        
        print(f"Total records: {len(self.df)}")
        print(f"Total commodities: {self.df['commodity'].nunique()}")
        print(f"Total states: {self.df['state'].nunique()}")
        
        print(f"\n💰 PRICE STATISTICS:")
        print(f"Average Modal Price: ₹{self.df['modal_price'].mean():.2f}")
        print(f"Min Price: ₹{self.df['modal_price'].min():.2f}")
        print(f"Max Price: ₹{self.df['modal_price'].max():.2f}")
        
        print(f"\n🌾 TOP COMMODITIES:")
        top_commodities = self.df['commodity'].value_counts().head(5)
        for commodity, count in top_commodities.items():
            avg_price = self.df[self.df['commodity'] == commodity]['modal_price'].mean()
            print(f"  {commodity}: {count} records, Avg: ₹{avg_price:.2f}")
    
    def simple_analysis(self):
        """Simple analysis without complex plots"""
        # Basic price distribution
        plt.figure(figsize=(12, 8))
        
        # Plot 1: Price histogram
        plt.subplot(2, 2, 1)
        plt.hist(self.df['modal_price'], bins=30, edgecolor='black', alpha=0.7)
        plt.title('Price Distribution')
        plt.xlabel('Price (₹)')
        plt.ylabel('Frequency')
        
        # Plot 2: Top commodities
        plt.subplot(2, 2, 2)
        top_5 = self.df['commodity'].value_counts().head(5)
        top_5.plot(kind='bar')
        plt.title('Top 5 Commodities')
        plt.xticks(rotation=45)
        
        # Plot 3: Average price by commodity
        plt.subplot(2, 2, 3)
        avg_prices = self.df.groupby('commodity')['modal_price'].mean().sort_values(ascending=False).head(8)
        avg_prices.plot(kind='bar')
        plt.title('Average Price by Commodity (Top 8)')
        plt.xticks(rotation=45)
        plt.ylabel('Price (₹)')
        
        # Plot 4: Price by state
        plt.subplot(2, 2, 4)
        state_prices = self.df.groupby('state')['modal_price'].mean().sort_values(ascending=False)
        state_prices.plot(kind='bar')
        plt.title('Average Price by State')
        plt.xticks(rotation=45)
        plt.ylabel('Price (₹)')
        
        plt.tight_layout()
        plt.savefig('simple_analysis.png', dpi=150, bbox_inches='tight')
        plt.show()
    
    def train_simple_model(self):
        """Train a simple Random Forest model"""
        print("\n🤖 TRAINING SIMPLE PREDICTION MODEL")
        print("=" * 50)
        
        # Prepare features
        df_ml = self.df.copy()
        
        # Basic feature engineering
        df_ml['month'] = df_ml['arrival_date'].dt.month
        df_ml['day_of_year'] = df_ml['arrival_date'].dt.dayofyear
        
        # Encode categorical variables
        le_commodity = LabelEncoder()
        le_state = LabelEncoder()
        
        df_ml['commodity_encoded'] = le_commodity.fit_transform(df_ml['commodity'])
        df_ml['state_encoded'] = le_state.fit_transform(df_ml['state'])
        
        # Select features
        features = ['commodity_encoded', 'state_encoded', 'month', 'day_of_year']
        X = df_ml[features]
        y = df_ml['modal_price']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        print(f"✅ Model Results:")
        print(f"   MAE: ₹{mae:.2f}")
        print(f"   RMSE: ₹{rmse:.2f}")
        print(f"   R² Score: {r2:.4f}")
        
        # Feature importance
        print(f"\n🎯 Feature Importance:")
        for i, feature in enumerate(features):
            importance = model.feature_importances_[i]
            print(f"   {feature}: {importance:.4f}")
        
        return model, le_commodity, le_state
    
    def generate_insights(self):
        """Generate simple business insights"""
        print("\n💡 BUSINESS INSIGHTS")
        print("=" * 50)
        
        # Most profitable commodities
        commodity_stats = self.df.groupby('commodity').agg({
            'modal_price': ['mean', 'count']
        }).round(2)
        commodity_stats.columns = ['avg_price', 'count']
        top_profitable = commodity_stats.nlargest(3, 'avg_price')
        
        print("💰 MOST PROFITABLE COMMODITIES:")
        for commodity, row in top_profitable.iterrows():
            print(f"  {commodity}: ₹{row['avg_price']} ({row['count']} records)")
        
        # Best states for prices
        state_avg = self.df.groupby('state')['modal_price'].mean().nlargest(3)
        print(f"\n📍 HIGHEST PRICE STATES:")
        for state, price in state_avg.items():
            print(f"  {state}: ₹{price:.2f}")

def main():
    """Run the simple analysis"""
    print("🌾 SIMPLE AGRICULTURAL PRICE ANALYZER")
    print("=" * 50)
    
    analyzer = SimpleCropPriceAnalyzer()
    
    if analyzer.load_data():
        analyzer.explore_data()
        analyzer.simple_analysis()
        analyzer.train_simple_model()
        analyzer.generate_insights()
        
        print("\n✅ Simple analysis completed!")
        print("📊 Check 'simple_analysis.png' for charts")

if __name__ == "__main__":
    main()