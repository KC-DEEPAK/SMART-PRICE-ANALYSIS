import pandas as pd
import numpy as np
import sqlite3
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder
import warnings
warnings.filterwarnings('ignore')

class SingleDayAnalyzer:
    def __init__(self, db_path='crop_prices.db'):
        self.db_path = db_path
        self.df = None
        
    def load_data(self):
        """Load data from database"""
        conn = sqlite3.connect(self.db_path)
        self.df = pd.read_sql_query("SELECT * FROM crop_prices", conn)
        conn.close()
        
        print(f"✅ Loaded {len(self.df)} records from {self.df['arrival_date'].iloc[0]}")
        return True
    
    def analyze_geographic_patterns(self):
        """Analyze price patterns across regions"""
        print("\n📍 GEOGRAPHIC PRICE ANALYSIS")
        print("=" * 50)
        
        # State-level analysis
        state_stats = self.df.groupby('state').agg({
            'modal_price': ['mean', 'count', 'std'],
            'commodity': 'nunique'
        }).round(2)
        
        state_stats.columns = ['avg_price', 'record_count', 'price_std', 'unique_commodities']
        state_stats = state_stats.sort_values('avg_price', ascending=False)
        
        print("🏛️ STATE-WISE ANALYSIS:")
        for state, row in state_stats.head(10).iterrows():
            print(f"  {state}: ₹{row['avg_price']} | {row['record_count']} records | {row['unique_commodities']} commodities")
        
        return state_stats
    
    def analyze_commodity_performance(self):
        """Analyze commodity performance across regions"""
        print("\n🌾 COMMODITY PERFORMANCE ANALYSIS")
        print("=" * 50)
        
        commodity_stats = self.df.groupby('commodity').agg({
            'modal_price': ['mean', 'min', 'max', 'std', 'count'],
            'state': 'nunique',
            'district': 'nunique'
        }).round(2)
        
        commodity_stats.columns = ['avg_price', 'min_price', 'max_price', 'price_std', 'total_records', 'states_count', 'districts_count']
        commodity_stats = commodity_stats.sort_values('avg_price', ascending=False)
        
        print("💰 COMMODITY PRICE RANKINGS:")
        for commodity, row in commodity_stats.iterrows():
            print(f"  {commodity}:")
            print(f"    Price: ₹{row['avg_price']} (Min: ₹{row['min_price']}, Max: ₹{row['max_price']})")
            print(f"    Availability: {row['states_count']} states, {row['districts_count']} districts")
            print(f"    Records: {row['total_records']}")
            print()
        
        return commodity_stats
    
    def find_profitable_markets(self):
        """Find most profitable markets for each commodity"""
        print("\n🎯 PROFITABLE MARKET ANALYSIS")
        print("=" * 50)
        
        # For each commodity, find markets with highest prices
        top_markets_by_commodity = {}
        
        for commodity in self.df['commodity'].unique():
            commodity_data = self.df[self.df['commodity'] == commodity]
            market_prices = commodity_data.groupby('market').agg({
                'modal_price': 'mean',
                'state': 'first',
                'district': 'first'
            }).round(2)
            
            market_prices = market_prices.sort_values('modal_price', ascending=False)
            top_markets_by_commodity[commodity] = market_prices.head(3)
        
        print("🏆 BEST MARKETS FOR EACH COMMODITY:")
        for commodity, markets in top_markets_by_commodity.items():
            print(f"\n{commodity}:")
            for market, row in markets.iterrows():
                print(f"  {market} ({row['district']}, {row['state']}): ₹{row['modal_price']}")
        
        return top_markets_by_commodity
    
    def build_price_predictor(self):
        """Build a model to predict prices based on location/commodity"""
        print("\n🤖 PRICE PREDICTION MODEL")
        print("=" * 50)
        
        # Prepare features
        df_ml = self.df.copy()
        
        # Encode categorical variables
        le_commodity = LabelEncoder()
        le_state = LabelEncoder()
        le_district = LabelEncoder()
        
        df_ml['commodity_encoded'] = le_commodity.fit_transform(df_ml['commodity'])
        df_ml['state_encoded'] = le_state.fit_transform(df_ml['state'])
        df_ml['district_encoded'] = le_district.fit_transform(df_ml['district'])
        
        # Features and target
        features = ['commodity_encoded', 'state_encoded', 'district_encoded']
        X = df_ml[features]
        y = df_ml['modal_price']
        
        # Train model
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"✅ Model Performance:")
        print(f"   Mean Absolute Error: ₹{mae:.2f}")
        print(f"   R² Score: {r2:.4f}")
        print(f"   This means the model explains {r2*100:.1f}% of price variations")
        
        # Feature importance
        print(f"\n🎯 What affects prices most:")
        feature_names = ['Commodity Type', 'State', 'District']
        for i, importance in enumerate(model.feature_importances_):
            print(f"   {feature_names[i]}: {importance:.3f}")
        
        return model, le_commodity, le_state, le_district
    
    def generate_recommendations(self):
        """Generate business recommendations"""
        print("\n💡 BUSINESS RECOMMENDATIONS")
        print("=" * 50)
        
        # 1. Highest paying commodities
        high_value_commodities = self.df.groupby('commodity')['modal_price'].mean().nlargest(3)
        
        print("💰 HIGHEST VALUE CROPS:")
        for commodity, price in high_value_commodities.items():
            print(f"  {commodity}: ₹{price:.2f}")
        
        # 2. Best states for farming
        state_avg_prices = self.df.groupby('state')['modal_price'].mean().nlargest(3)
        
        print(f"\n🏆 BEST STATES FOR FARMING:")
        for state, price in state_avg_prices.items():
            print(f"  {state}: ₹{price:.2f} average price")
        
        # 3. Price stability analysis
        commodity_volatility = self.df.groupby('commodity')['modal_price'].std() / self.df.groupby('commodity')['modal_price'].mean()
        stable_crops = commodity_volatility.nsmallest(3)
        volatile_crops = commodity_volatility.nlargest(3)
        
        print(f"\n📊 PRICE STABILITY ANALYSIS:")
        print("  Most Stable (Low Risk):")
        for crop, vol in stable_crops.items():
            print(f"    {crop}: {vol:.3f} volatility")
        
        print("  Most Volatile (High Risk/Reward):")
        for crop, vol in volatile_crops.items():
            print(f"    {crop}: {vol:.3f} volatility")
        
        # 4. Market recommendations
        print(f"\n🎯 STRATEGIC RECOMMENDATIONS:")
        print("  1. Focus on high-value commodities in top-paying states")
        print("  2. Consider stable crops for consistent income")
        print("  3. Explore volatile crops for potential high returns")
        print("  4. Use the prediction model to estimate prices for new locations")

def main():
    print("🌾 SINGLE-DAY AGRICULTURAL PRICE ANALYZER")
    print("=" * 60)
    
    analyzer = SingleDayAnalyzer()
    
    if analyzer.load_data():
        # Run analyses
        analyzer.analyze_geographic_patterns()
        analyzer.analyze_commodity_performance()
        analyzer.find_profitable_markets()
        analyzer.build_price_predictor()
        analyzer.generate_recommendations()
        
        print("\n✅ Analysis completed! Key files saved:")
        print("   - Geographic analysis completed")
        print("   - Commodity rankings generated")
        print("   - Price prediction model trained")
        print("   - Business recommendations ready")

if __name__ == "__main__":
    main()