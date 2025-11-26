from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import json
from datetime import datetime
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Initialize Flask app FIRST
app = Flask(__name__)

class AgriculturalPriceAnalyzer:
    def __init__(self, csv_path):
        print(f"📂 Loading CSV from: {csv_path}")
        self.df = pd.read_csv(csv_path)
        print(f"✅ Loaded {len(self.df)} records")
        self.preprocess_data()
        
    def preprocess_data(self):
        """Clean and preprocess the data"""
        print("🔄 Preprocessing data...")
        self.df['Arrival_Date'] = pd.to_datetime(self.df['Arrival_Date'], errors='coerce')
        self.df['Year'] = self.df['Arrival_Date'].dt.year
        self.df['Month'] = self.df['Arrival_Date'].dt.month
        self.df['Month_Name'] = self.df['Arrival_Date'].dt.month_name()
        self.df['Price_Spread'] = self.df['Max_x0020_Price'] - self.df['Min_x0020_Price']
        self.df['Avg_Price'] = (self.df['Min_x0020_Price'] + self.df['Max_x0020_Price'] + self.df['Modal_x0020_Price']) / 3
        print("✅ Data preprocessing completed!")
    
    def get_dataset_info(self):
        """Get basic dataset information"""
        info = {
            'total_records': len(self.df),
            'states': self.df['State'].nunique(),
            'districts': self.df['District'].nunique(),
            'crops': self.df['Commodity'].nunique(),
            'markets': self.df['Market'].nunique(),
            'date_range': {
                'start': str(self.df['Arrival_Date'].min())[:10],
                'end': str(self.df['Arrival_Date'].max())[:10]
            }
        }
        return info
    
    def analyze_best_selling_time(self, commodity=None, state=None, district=None):
        """Analyze best time to sell based on historical prices"""
        filtered_df = self.df.copy()
        if commodity and commodity != 'all':
            filtered_df = filtered_df[filtered_df['Commodity'].str.contains(commodity, case=False, na=False)]
        if state and state != 'all':
            filtered_df = filtered_df[filtered_df['State'].str.contains(state, case=False, na=False)]
        if district and district != 'all':
            filtered_df = filtered_df[filtered_df['District'].str.contains(district, case=False, na=False)]
        
        if filtered_df.empty:
            return None
        
        monthly_analysis = filtered_df.groupby(['Month', 'Month_Name']).agg({
            'Avg_Price': ['mean', 'max', 'min'],
            'Price_Spread': 'mean',
            'Commodity': 'count'
        }).round(2)
        
        monthly_analysis.columns = ['Avg_Price', 'Max_Price', 'Min_Price', 'Avg_Spread', 'Transaction_Count']
        monthly_analysis = monthly_analysis.reset_index()
        
        if not monthly_analysis.empty:
            best_month = monthly_analysis.loc[monthly_analysis['Avg_Price'].idxmax()].to_dict()
            worst_month = monthly_analysis.loc[monthly_analysis['Avg_Price'].idxmin()].to_dict()
        else:
            best_month = worst_month = {}
        
        return {
            'monthly_analysis': monthly_analysis.to_dict('records'),
            'best_month': best_month,
            'worst_month': worst_month,
            'summary': {
                'total_transactions': len(filtered_df),
                'avg_price_overall': filtered_df['Avg_Price'].mean().round(2),
                'max_price': filtered_df['Max_x0020_Price'].max(),
                'min_price': filtered_df['Min_x0020_Price'].min()
            }
        }
    
    def find_most_profitable_crops(self, top_n=10):
        """Find most profitable crops based on price spread"""
        crop_profitability = self.df.groupby('Commodity').agg({
            'Avg_Price': 'mean',
            'Price_Spread': 'mean',
            'Max_x0020_Price': 'max',
            'Commodity': 'count'
        }).round(2)
        
        crop_profitability.columns = ['Avg_Price', 'Avg_Spread', 'Max_Price', 'Transaction_Count']
        return crop_profitability.sort_values('Avg_Spread', ascending=False).head(top_n).reset_index()
    
    def get_unique_values(self):
        """Get unique values for filters"""
        return {
            'states': sorted(self.df['State'].unique()),
            'districts': sorted(self.df['District'].unique()),
            'crops': sorted(self.df['Commodity'].unique()),
            'markets': sorted(self.df['Market'].unique())
        }
    
    def generate_price_chart(self, commodity, state='all'):
        """Generate price trend chart"""
        filtered_df = self.df.copy()
        if commodity != 'all':
            filtered_df = filtered_df[filtered_df['Commodity'].str.contains(commodity, case=False, na=False)]
        if state != 'all':
            filtered_df = filtered_df[filtered_df['State'].str.contains(state, case=False, na=False)]
        
        monthly_trend = filtered_df.groupby(['Year', 'Month']).agg({
            'Avg_Price': 'mean'
        }).reset_index()
        
        plt.figure(figsize=(10, 6))
        
        if len(monthly_trend) > 1:
            for year in monthly_trend['Year'].unique():
                year_data = monthly_trend[monthly_trend['Year'] == year]
                plt.plot(year_data['Month'], year_data['Avg_Price'], marker='o', label=f'Year {year}')
        else:
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            current_month = monthly_trend['Month'].iloc[0] if len(monthly_trend) > 0 else 1
            prices = [monthly_trend['Avg_Price'].iloc[0] if i+1 == current_month else 0 for i in range(12)]
            plt.bar(months, prices, color='skyblue', alpha=0.7)
            plt.xticks(rotation=45)
        
        title = f'Price Trends for {commodity}' + (f' in {state}' if state != 'all' else '')
        plt.title(title)
        plt.xlabel('Month')
        plt.ylabel('Average Price (₹)')
        if len(monthly_trend) > 1:
            plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        img = io.BytesIO()
        plt.savefig(img, format='png', bbox_inches='tight', dpi=100)
        img.seek(0)
        plt.close()
        
        return base64.b64encode(img.getvalue()).decode()

# Initialize analyzer
try:
    analyzer = AgriculturalPriceAnalyzer('data/full_daily_prices.csv')
    print("✅ Agricultural Price Analyzer initialized successfully!")
except Exception as e:
    print(f"❌ Error initializing analyzer: {e}")
    analyzer = None

# Debug route - check if templates exist
@app.route('/debug')
def debug():
    """Debug route to check template issues"""
    try:
        import os
        template_files = os.listdir('templates') if os.path.exists('templates') else []
        
        debug_info = {
            'current_directory': os.getcwd(),
            'templates_exist': os.path.exists('templates'),
            'template_files': template_files,
            'analyzer_initialized': analyzer is not None
        }
        
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>🔧 Debug Information</h1>
            <pre>{json.dumps(debug_info, indent=2)}</pre>
            <h2>Quick Fixes:</h2>
            <ol>
                <li>Make sure 'templates' folder exists in backend directory</li>
                <li>Make sure 'index.html' exists in templates folder</li>
                <li>Visit <a href="/simple">/simple</a> to test basic Flask</li>
                <li>Visit <a href="/">/</a> for main page</li>
            </ol>
        </body>
        </html>
        """
    except Exception as e:
        return f"Debug error: {str(e)}"

# Simple test route
@app.route('/simple')
def simple():
    """Simple test without templates"""
    return """
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: green;">✅ Flask is Working!</h1>
        <p>If you can see this, Flask is running correctly.</p>
        <p><a href="/debug">Check Debug Info</a></p>
        <p><a href="/">Try Main Page</a></p>
    </body>
    </html>
    """

# Main routes
@app.route('/')
def index():
    """Main dashboard page"""
    try:
        if analyzer is None:
            return "Error: Analyzer not initialized. Check if CSV file exists.", 500
        
        print("🔍 Getting dataset info...")
        dataset_info = analyzer.get_dataset_info()
        print("🔍 Getting unique values...")
        unique_vals = analyzer.get_unique_values()
        print("🔍 Getting profitable crops...")
        profitable_crops = analyzer.find_most_profitable_crops(8)
        
        print("🚀 Rendering template...")
        return render_template('index.html', 
                             dataset_info=dataset_info,
                             states=unique_vals['states'],
                             crops=unique_vals['crops'],
                             profitable_crops=profitable_crops.to_dict('records'))
                             
    except Exception as e:
        error_msg = f"Error loading page: {str(e)}"
        print(f"❌ {error_msg}")
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: red;">❌ Error Loading Main Page</h1>
            <p><strong>Error:</strong> {error_msg}</p>
            <p>This usually means:</p>
            <ul>
                <li>Templates folder is missing</li>
                <li>index.html is missing in templates folder</li>
                <li>There's an error in the template file</li>
            </ul>
            <p><a href="/simple">Simple Test Page</a></p>
            <p><a href="/debug">Debug Information</a></p>
        </body>
        </html>
        """, 500

@app.route('/analysis')
def analysis_page():
    """Analysis page"""
    if analyzer is None:
        return "Error: Analyzer not initialized", 500
    
    unique_vals = analyzer.get_unique_values()
    return render_template('analysis.html',
                         states=unique_vals['states'],
                         crops=unique_vals['crops'])

@app.route('/markets')
def markets_page():
    """Markets analysis page"""
    return render_template('markets.html')

@app.route('/prices')
def prices_page():
    """Prices analysis page"""
    if analyzer is None:
        return "Error: Analyzer not initialized", 500
    
    unique_vals = analyzer.get_unique_values()
    return render_template('prices.html',
                         states=unique_vals['states'],
                         crops=unique_vals['crops'])

# API endpoints
@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze crop selling time"""
    if analyzer is None:
        return jsonify({'success': False, 'message': 'Analyzer not initialized'})
    
    data = request.json
    commodity = data.get('commodity', 'all')
    state = data.get('state', 'all')
    
    analysis = analyzer.analyze_best_selling_time(commodity, state)
    
    if analysis:
        return jsonify({'success': True, 'data': analysis})
    else:
        return jsonify({'success': False, 'message': 'No data found for the selected filters'})

@app.route('/api/price-chart')
def get_price_chart():
    """Generate price trend chart"""
    if analyzer is None:
        return jsonify({'error': 'Analyzer not initialized'})
    
    commodity = request.args.get('commodity', 'all')
    state = request.args.get('state', 'all')
    
    try:
        chart_data = analyzer.generate_price_chart(commodity, state)
        return jsonify({'chart': f"data:image/png;base64,{chart_data}"})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/profitable-crops')
def get_profitable_crops():
    """Get profitable crops"""
    if analyzer is None:
        return jsonify({'error': 'Analyzer not initialized'})
    
    crops = analyzer.find_most_profitable_crops(15)
    return jsonify(crops.to_dict('records'))

@app.route('/api/dataset-info')
def dataset_info():
    """API endpoint for dataset information"""
    if analyzer is None:
        return jsonify({'error': 'Analyzer not initialized'})
    
    return jsonify(analyzer.get_dataset_info())

@app.route('/api/unique-values')
def unique_values():
    """API endpoint for unique values"""
    if analyzer is None:
        return jsonify({'error': 'Analyzer not initialized'})
    
    return jsonify(analyzer.get_unique_values())

if __name__ == '__main__':
    print("🚀 Starting Agricultural Price Analyzer Web App...")
    print("📊 Access your dashboard at: http://localhost:5000")
    print("🔧 Debug info at: http://localhost:5000/debug")
    print("🧪 Simple test at: http://localhost:5000/simple")
    app.run(debug=True, host='0.0.0.0', port=5000)
    