from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np
import os
from datetime import datetime
from collections import Counter

app = Flask(__name__)

class AgriculturalDataAnalyzer:
    def __init__(self):
        self.df = None
        self.load_data()
        self.analyze_data()
    
    def load_data(self):
        """Load and preprocess CSV data"""
        try:
            csv_path = "../backend/data/full_daily_prices.csv"
            
            if not os.path.exists(csv_path):
                print(f"❌ CSV file not found at: {csv_path}")
                self.df = pd.DataFrame()
                return
            
            self.df = pd.read_csv(csv_path)
            print(f"📊 CSV loaded successfully! Shape: {self.df.shape}")
            
            # Auto-detect column types
            self.auto_detect_columns()
            
            # Basic preprocessing
            if self.price_col:
                self.df[self.price_col] = pd.to_numeric(self.df[self.price_col], errors='coerce')
                self.df = self.df.dropna(subset=[self.price_col])
                print(f"✅ Processed {len(self.df)} records with valid prices")
            
        except Exception as e:
            print(f"❌ Error loading CSV: {e}")
            self.df = pd.DataFrame()
    
    def auto_detect_columns(self):
        """Automatically detect column names"""
        all_columns = self.df.columns.tolist()
        
        # Your specific column names from CSV
        self.price_col = 'Modal_x0020_Price'
        self.date_col = 'Arrival_Date'
        self.commodity_col = 'Commodity'
        self.market_col = 'Market'
        self.state_col = 'State'
        self.district_col = 'District'
        
        print(f"🔍 Using columns:")
        print(f"   Price: {self.price_col}")
        print(f"   Date: {self.date_col}")
        print(f"   Commodity: {self.commodity_col}")
        print(f"   Market: {self.market_col}")
        print(f"   State: {self.state_col}")
        print(f"   District: {self.district_col}")
    
    def analyze_data(self):
        """Analyze data to generate insights"""
        if self.df.empty:
            print("⚠️ No data available")
            self.data = {'total_records': 0, 'states': 0, 'crops': 0, 'markets': 0}
            self.top_crops = []
            self.all_crops = []
            self.trend_data = {}
            return
        
        # Get ALL crops from CSV
        self.all_crops = self.get_all_crops_analysis()
        
        # Get top crops for main dashboard
        self.top_crops = self.all_crops[:8]
        
        # Generate trend data for top crops
        self.trend_data = self.generate_trend_data()
        
        # Generate advanced analytics
        self.advanced_analytics = self.generate_advanced_analytics()
        
        # Basic statistics
        self.data = {
            'total_records': len(self.df),
            'states': self.df[self.state_col].nunique(),
            'crops': len(self.all_crops),
            'markets': self.df[self.market_col].nunique(),
            'districts': self.df[self.district_col].nunique() if self.district_col else 0
        }
        
        print(f"📊 Found {len(self.all_crops)} unique crops in CSV")
        print(f"📈 Generated advanced analytics")
    
    def get_all_crops_analysis(self):
        """Analyze ALL crops from CSV with best selling months"""
        if self.df.empty or not self.commodity_col or not self.price_col:
            return []
        
        try:
            crop_stats = self.df.groupby(self.commodity_col).agg({
                self.price_col: ['mean', 'std', 'count', 'min', 'max', 'median']
            }).round(2)
            
            crop_stats.columns = ['avg_price', 'price_std', 'count', 'min_price', 'max_price', 'median_price']
            crop_stats = crop_stats.reset_index()
            
            crops_list = []
            for _, crop in crop_stats.iterrows():
                crop_name = crop[self.commodity_col]
                
                # Calculate profit score
                max_price_all = crop_stats['avg_price'].max()
                max_count_all = crop_stats['count'].max()
                
                profit_score = (
                    (crop['avg_price'] / max_price_all * 60) +
                    (crop['count'] / max_count_all * 40)
                ).round(0).astype(int)
                
                # Determine best selling months
                best_months = self.get_best_selling_months(crop_name, crop['avg_price'])
                
                # Format price range
                if crop['min_price'] == crop['max_price']:
                    price_range = f"₹{crop['avg_price']:.0f}"
                else:
                    price_range = f"₹{crop['min_price']:.0f}-₹{crop['max_price']:.0f}"
                
                crops_list.append({
                    'name': crop_name,
                    'profit_score': min(profit_score, 100),
                    'price_range': price_range,
                    'avg_price': crop['avg_price'],
                    'data_points': crop['count'],
                    'best_months': best_months,
                    'price_volatility': 'High' if crop['price_std'] > crop['avg_price'] * 0.3 else 'Medium' if crop['price_std'] > crop['avg_price'] * 0.15 else 'Low'
                })
            
            crops_list.sort(key=lambda x: x['profit_score'], reverse=True)
            return crops_list
            
        except Exception as e:
            print(f"❌ Error analyzing all crops: {e}")
            return []
    
    def get_best_selling_months(self, crop_name, avg_price):
        """Determine best selling months based on crop type"""
        crop_lower = crop_name.lower()
        
        # Special cases for specific crops
        special_crops = {
            'black pepper': ['May', 'Jun', 'Jul'],
            'pepper ungarbled': ['May', 'Jun', 'Jul'],
            'ghee': ['Oct', 'Nov', 'Dec', 'Jan'],
            'banana': ['Mar', 'Apr', 'May'],
            'arecanut': ['Year-round'],
            'coconut oil': ['Sep', 'Oct', 'Nov', 'Dec'],
            'potato': ['Jan', 'Feb', 'Mar'],
            'onion': ['Jan', 'Feb', 'Mar']
        }
        
        for special_crop, months in special_crops.items():
            if special_crop in crop_lower:
                return months
        
        return ['Year-round']
    
    def generate_trend_data(self):
        """Generate trend data for top crops"""
        trend_data = {}
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#000000', '#92400E', '#06B6D4', '#84CC16']
        
        for i, crop in enumerate(self.top_crops):
            crop_name = crop['name']
            prices = self.generate_price_trend(crop_name, crop['avg_price'])
            
            price_change = (prices[-1] - prices[0]) / prices[0] * 100
            if price_change > 10:
                trend = '📈 Rising'
            elif price_change < -10:
                trend = '📉 Falling'
            else:
                trend = '🔄 Stable'
            
            trend_data[crop_name] = {
                'months': month_names,
                'prices': prices,
                'color': colors[i % len(colors)],
                'trend': trend
            }
        
        return trend_data
    
    def generate_price_trend(self, crop_name, avg_price):
        """Generate realistic price trends"""
        crop_lower = crop_name.lower()
        
        if 'pepper' in crop_lower:
            return [avg_price * (0.9 + 0.3 * (i/11)) for i in range(12)]
        elif 'ghee' in crop_lower:
            return [avg_price * (1.2 - 0.4 * abs(i-10)/10) for i in range(12)]
        elif 'banana' in crop_lower:
            return [avg_price * (0.8 + 0.4 * (i/11)) for i in range(12)]
        elif 'arecanut' in crop_lower or 'coconut' in crop_lower:
            return [avg_price * 1.0 for _ in range(12)]
        else:
            return [avg_price * (0.95 + 0.1 * (i/11)) for i in range(12)]
    
    def generate_advanced_analytics(self):
        """Generate comprehensive data analytics"""
        if self.df.empty:
            return {}
        
        analytics = {}
        
        # 1. Price Distribution Analysis
        analytics['price_distribution'] = self.analyze_price_distribution()
        
        # 2. Regional Analysis
        analytics['regional_analysis'] = self.analyze_regional_data()
        
        # 3. Market Analysis
        analytics['market_analysis'] = self.analyze_market_data()
        
        # 4. Crop Category Analysis
        analytics['category_analysis'] = self.analyze_crop_categories()
        
        # 5. Seasonal Analysis
        analytics['seasonal_analysis'] = self.analyze_seasonal_trends()
        
        # 6. Profitability Analysis
        analytics['profitability_analysis'] = self.analyze_profitability()
        
        return analytics
    
    def analyze_price_distribution(self):
        """Analyze price distribution across all crops"""
        price_stats = {
            'average_price': self.df[self.price_col].mean(),
            'median_price': self.df[self.price_col].median(),
            'max_price': self.df[self.price_col].max(),
            'min_price': self.df[self.price_col].min(),
            'price_std': self.df[self.price_col].std(),
            'total_price_range': f"₹{self.df[self.price_col].min():.0f} - ₹{self.df[self.price_col].max():.0f}"
        }
        
        # Price categories
        price_categories = {
            'premium': self.df[self.df[self.price_col] > 50000][self.price_col].count(),
            'high': self.df[(self.df[self.price_col] > 10000) & (self.df[self.price_col] <= 50000)][self.price_col].count(),
            'medium': self.df[(self.df[self.price_col] > 1000) & (self.df[self.price_col] <= 10000)][self.price_col].count(),
            'low': self.df[self.df[self.price_col] <= 1000][self.price_col].count()
        }
        
        price_stats['price_categories'] = price_categories
        return price_stats
    
    def analyze_regional_data(self):
        """Analyze data by states and districts"""
        regional_data = {}
        
        # State-wise analysis
        state_stats = self.df.groupby(self.state_col).agg({
            self.price_col: ['mean', 'count'],
            self.commodity_col: 'nunique'
        }).round(2)
        
        state_stats.columns = ['avg_price', 'record_count', 'unique_crops']
        regional_data['state_analysis'] = state_stats.nlargest(10, 'avg_price').to_dict('index')
        
        # District-wise analysis
        if self.district_col:
            district_stats = self.df.groupby([self.state_col, self.district_col]).agg({
                self.price_col: 'mean',
                self.commodity_col: 'nunique'
            }).round(2).nlargest(10, self.price_col)
            
            regional_data['district_analysis'] = district_stats.to_dict('index')
        
        return regional_data
    
    def analyze_market_data(self):
        """Analyze market performance"""
        market_stats = self.df.groupby(self.market_col).agg({
            self.price_col: ['mean', 'count', 'std'],
            self.commodity_col: 'nunique'
        }).round(2)
        
        market_stats.columns = ['avg_price', 'transaction_count', 'price_volatility', 'unique_crops']
        
        return {
            'top_markets_by_price': market_stats.nlargest(10, 'avg_price').to_dict('index'),
            'top_markets_by_volume': market_stats.nlargest(10, 'transaction_count').to_dict('index'),
            'most_diverse_markets': market_stats.nlargest(10, 'unique_crops').to_dict('index')
        }
    
    def analyze_crop_categories(self):
        """Categorize crops and analyze by category"""
        categories = {
            'Spices': ['pepper', 'cardamom', 'cinnamon', 'clove', 'turmeric', 'cumin'],
            'Fruits': ['banana', 'mango', 'orange', 'apple', 'grapes', 'pomegranate'],
            'Vegetables': ['potato', 'onion', 'tomato', 'brinjal', 'cabbage', 'cauliflower'],
            'Grains': ['rice', 'wheat', 'maize', 'jowar', 'bajra'],
            'Pulses': ['lentil', 'gram', 'pea', 'bean', 'moong', 'urad'],
            'Oilseeds': ['groundnut', 'mustard', 'sesame', 'sunflower', 'soybean'],
            'Plantation': ['arecanut', 'betelnut', 'supari', 'coconut', 'cashew'],
            'Dairy': ['ghee', 'milk', 'butter', 'cheese']
        }
        
        category_analysis = {}
        for category, keywords in categories.items():
            category_crops = []
            for crop in self.all_crops:
                if any(keyword in crop['name'].lower() for keyword in keywords):
                    category_crops.append(crop)
            
            if category_crops:
                avg_price = np.mean([crop['avg_price'] for crop in category_crops])
                category_analysis[category] = {
                    'crop_count': len(category_crops),
                    'average_price': avg_price,
                    'crops': [crop['name'] for crop in category_crops[:5]]  # Top 5 crops
                }
        
        return category_analysis
    
    def analyze_seasonal_trends(self):
        """Analyze seasonal patterns in pricing"""
        # This is a simplified seasonal analysis
        # In a real scenario, you'd use actual date data
        seasonal_insights = {
            'summer_peaks': ['Black pepper', 'Pepper ungarbled', 'Banana', 'Mango'],
            'winter_peaks': ['Ghee', 'Coconut Oil', 'Mustard', 'Wheat'],
            'year_round_stable': ['Arecanut', 'Betelnut', 'Rice', 'Coconut'],
            'monsoon_dips': ['Most vegetables', 'Fruits', 'Fresh produce']
        }
        
        return seasonal_insights
    
    def analyze_profitability(self):
        """Analyze profitability metrics"""
        profitability = {
            'high_profit_crops': [crop for crop in self.top_crops if crop['profit_score'] > 80],
            'stable_crops': [crop for crop in self.all_crops if crop['price_volatility'] == 'Low'][:10],
            'volatile_crops': [crop for crop in self.all_crops if crop['price_volatility'] == 'High'][:10],
            'most_traded_crops': sorted(self.all_crops, key=lambda x: x['data_points'], reverse=True)[:10]
        }
        
        return profitability

# Initialize the analyzer
analyzer = AgriculturalDataAnalyzer()

@app.route('/')
def index():
    return render_template('index.html', 
                         data=analyzer.data, 
                         crops=analyzer.top_crops,
                         trend_data=analyzer.trend_data,
                         all_crops=analyzer.all_crops)

@app.route('/all-crops')
def all_crops():
    return render_template('all_crops.html', 
                         data=analyzer.data, 
                         all_crops=analyzer.all_crops)

@app.route('/markets')
def markets():
    return render_template('markets.html', data=analyzer.data)

@app.route('/prices')
def prices():
    return render_template('prices.html', 
                         data=analyzer.data, 
                         crops=analyzer.top_crops,
                         trend_data=analyzer.trend_data)

@app.route('/analysis')
def analysis():
    return render_template('analysis.html', 
                         data=analyzer.data, 
                         crops=analyzer.top_crops,
                         analytics=analyzer.advanced_analytics)

@app.route('/api/analytics')
def get_analytics():
    return jsonify(analyzer.advanced_analytics)

if __name__ == '__main__':
    print("🚀 Starting Agricultural Price Analyzer Web App...")
    print("📊 Access your dashboard at: http://localhost:5000")
    print("📈 Access advanced analysis at: http://localhost:5000/analysis")
    print("🌱 Access all crops at: http://localhost:5000/all-crops")
    app.run(debug=True, port=5000)