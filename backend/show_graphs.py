import pandas as pd
import numpy as np
import sqlite3
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib import rcParams

# Set up better looking graphs
plt.style.use('seaborn-v0_8')
rcParams['figure.figsize'] = 12, 8

class CropPriceVisualizer:
    def __init__(self, db_path='crop_prices.db'):
        self.db_path = db_path
        self.df = None
        
    def load_data(self):
        """Load data from database"""
        conn = sqlite3.connect(self.db_path)
        self.df = pd.read_sql_query("SELECT * FROM crop_prices", conn)
        conn.close()
        print(f"✅ Loaded {len(self.df)} records for visualization")
        return True
    
    def create_all_graphs(self):
        """Create comprehensive visualizations"""
        print("📊 Creating Agricultural Price Visualizations...")
        
        # Create a figure with multiple subplots
        fig = plt.figure(figsize=(20, 15))
        
        # 1. Price Distribution
        plt.subplot(2, 3, 1)
        plt.hist(self.df['modal_price'], bins=50, color='skyblue', edgecolor='black', alpha=0.7)
        plt.title('💰 Price Distribution Across All Commodities', fontsize=14, fontweight='bold')
        plt.xlabel('Modal Price (₹)')
        plt.ylabel('Frequency')
        plt.grid(True, alpha=0.3)
        
        # 2. Top Commodities by Record Count
        plt.subplot(2, 3, 2)
        top_commodities = self.df['commodity'].value_counts().head(10)
        colors = plt.cm.Set3(np.linspace(0, 1, len(top_commodities)))
        top_commodities.plot(kind='bar', color=colors)
        plt.title('🌾 Top 10 Commodities by Trade Volume', fontsize=14, fontweight='bold')
        plt.xlabel('Commodity')
        plt.ylabel('Number of Records')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        # 3. Average Price by Commodity
        plt.subplot(2, 3, 3)
        avg_prices = self.df.groupby('commodity')['modal_price'].mean().sort_values(ascending=False).head(10)
        colors = plt.cm.viridis(np.linspace(0, 1, len(avg_prices)))
        avg_prices.plot(kind='bar', color=colors)
        plt.title('💵 Average Price by Commodity (Top 10)', fontsize=14, fontweight='bold')
        plt.xlabel('Commodity')
        plt.ylabel('Average Price (₹)')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        # 4. Price Range by Commodity
        plt.subplot(2, 3, 4)
        price_ranges = self.df.groupby('commodity').agg({
            'modal_price': ['min', 'max']
        })
        # Get top 8 commodities by record count for clarity
        top_8 = self.df['commodity'].value_counts().head(8).index
        price_ranges = price_ranges.loc[top_8]
        
        x_pos = np.arange(len(top_8))
        width = 0.35
        
        plt.bar(x_pos - width/2, price_ranges[('modal_price', 'min')], width, 
                label='Min Price', color='lightcoral', alpha=0.7)
        plt.bar(x_pos + width/2, price_ranges[('modal_price', 'max')], width, 
                label='Max Price', color='lightgreen', alpha=0.7)
        
        plt.title('📈 Price Range by Commodity', fontsize=14, fontweight='bold')
        plt.xlabel('Commodity')
        plt.ylabel('Price (₹)')
        plt.xticks(x_pos, top_8, rotation=45, ha='right')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        # 5. State-wise Average Prices
        plt.subplot(2, 3, 5)
        state_prices = self.df.groupby('state')['modal_price'].mean().sort_values(ascending=False).head(10)
        colors = plt.cm.plasma(np.linspace(0, 1, len(state_prices)))
        state_prices.plot(kind='bar', color=colors)
        plt.title('🏛️ Average Price by State (Top 10)', fontsize=14, fontweight='bold')
        plt.xlabel('State')
        plt.ylabel('Average Price (₹)')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        # 6. Commodity Distribution Pie Chart
        plt.subplot(2, 3, 6)
        commodity_counts = self.df['commodity'].value_counts().head(8)
        colors = plt.cm.Pastel1(np.linspace(0, 1, len(commodity_counts)))
        plt.pie(commodity_counts.values, labels=commodity_counts.index, autopct='%1.1f%%', 
                colors=colors, startangle=90)
        plt.title('🥧 Commodity Distribution (Top 8)', fontsize=14, fontweight='bold')
        
        plt.tight_layout()
        plt.savefig('agricultural_dashboard.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        return fig
    
    def create_advanced_visualizations(self):
        """Create more detailed visualizations"""
        print("📈 Creating Advanced Visualizations...")
        
        fig = plt.figure(figsize=(18, 12))
        
        # 1. Price vs Min-Max Spread
        plt.subplot(2, 2, 1)
        self.df['price_spread'] = self.df['max_price'] - self.df['min_price']
        plt.scatter(self.df['modal_price'], self.df['price_spread'], 
                   alpha=0.6, c=self.df['modal_price'], cmap='viridis')
        plt.colorbar(label='Modal Price (₹)')
        plt.xlabel('Modal Price (₹)')
        plt.ylabel('Price Spread (Max - Min)')
        plt.title('💹 Price vs Price Spread', fontsize=14, fontweight='bold')
        plt.grid(True, alpha=0.3)
        
        # 2. Top Districts by Average Price
        plt.subplot(2, 2, 2)
        district_prices = self.df.groupby('district')['modal_price'].mean().sort_values(ascending=False).head(15)
        colors = plt.cm.coolwarm(np.linspace(0, 1, len(district_prices)))
        district_prices.plot(kind='barh', color=colors)
        plt.title('📍 Top 15 Districts by Average Price', fontsize=14, fontweight='bold')
        plt.xlabel('Average Price (₹)')
        plt.gca().invert_yaxis()
        plt.grid(True, alpha=0.3)
        
        # 3. Commodity Price Distribution Box Plot
        plt.subplot(2, 2, 3)
        top_6_commodities = self.df['commodity'].value_counts().head(6).index
        filtered_df = self.df[self.df['commodity'].isin(top_6_commodities)]
        
        box_data = [filtered_df[filtered_df['commodity'] == commodity]['modal_price'] 
                   for commodity in top_6_commodities]
        
        plt.boxplot(box_data, labels=top_6_commodities)
        plt.title('📦 Price Distribution by Commodity', fontsize=14, fontweight='bold')
        plt.xlabel('Commodity')
        plt.ylabel('Price (₹)')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        # 4. Market Concentration
        plt.subplot(2, 2, 4)
        market_activity = self.df['market'].value_counts().head(10)
        colors = plt.cm.spring(np.linspace(0, 1, len(market_activity)))
        market_activity.plot(kind='bar', color=colors)
        plt.title('🏪 Most Active Markets (Top 10)', fontsize=14, fontweight='bold')
        plt.xlabel('Market')
        plt.ylabel('Number of Price Records')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('advanced_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        return fig
    
    def create_profitability_analysis(self):
        """Create profitability-focused visualizations"""
        print("💰 Creating Profitability Analysis...")
        
        # Calculate profitability metrics
        commodity_stats = self.df.groupby('commodity').agg({
            'modal_price': ['mean', 'std', 'count'],
            'min_price': 'mean',
            'max_price': 'mean'
        }).round(2)
        
        commodity_stats.columns = ['avg_price', 'price_std', 'record_count', 'avg_min', 'avg_max']
        commodity_stats['price_stability'] = 1 / (commodity_stats['price_std'] / commodity_stats['avg_price'])
        
        fig = plt.figure(figsize=(16, 10))
        
        # 1. Profitability vs Stability Scatter
        plt.subplot(2, 2, 1)
        plt.scatter(commodity_stats['avg_price'], commodity_stats['price_stability'], 
                   s=commodity_stats['record_count']*10, alpha=0.7, 
                   c=commodity_stats['avg_price'], cmap='RdYlGn')
        
        # Annotate points with commodity names
        for commodity, row in commodity_stats.iterrows():
            plt.annotate(commodity, (row['avg_price'], row['price_stability']), 
                        xytext=(5, 5), textcoords='offset points', fontsize=8)
        
        plt.colorbar(label='Average Price (₹)')
        plt.xlabel('Average Price (₹) - Profitability')
        plt.ylabel('Price Stability (Higher = More Stable)')
        plt.title('📊 Profitability vs Price Stability', fontsize=14, fontweight='bold')
        plt.grid(True, alpha=0.3)
        
        # 2. Top Commodities by Market Presence
        plt.subplot(2, 2, 2)
        market_presence = self.df.groupby('commodity')['market'].nunique().sort_values(ascending=False).head(10)
        colors = plt.cm.Set2(np.linspace(0, 1, len(market_presence)))
        market_presence.plot(kind='bar', color=colors)
        plt.title('🌍 Market Presence by Commodity', fontsize=14, fontweight='bold')
        plt.xlabel('Commodity')
        plt.ylabel('Number of Unique Markets')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        # 3. Price Premium Analysis
        plt.subplot(2, 2, 3)
        commodity_stats['price_premium'] = (commodity_stats['avg_price'] - commodity_stats['avg_price'].mean()) / commodity_stats['avg_price'].mean() * 100
        top_premium = commodity_stats.nlargest(8, 'price_premium')['price_premium']
        colors = ['green' if x > 0 else 'red' for x in top_premium]
        top_premium.plot(kind='bar', color=colors)
        plt.title('🎯 Price Premium/Discount vs Market Average', fontsize=14, fontweight='bold')
        plt.xlabel('Commodity')
        plt.ylabel('Premium/Discount (%)')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        # 4. Best Performing Commodities Summary
        plt.subplot(2, 2, 4)
        performance_metrics = commodity_stats.nlargest(5, 'avg_price')[['avg_price', 'price_stability', 'record_count']]
        performance_metrics['scaled_stability'] = performance_metrics['price_stability'] / performance_metrics['price_stability'].max() * 100
        performance_metrics['scaled_records'] = performance_metrics['record_count'] / performance_metrics['record_count'].max() * 100
        
        x = np.arange(len(performance_metrics))
        width = 0.25
        
        plt.bar(x - width, performance_metrics['avg_price'], width, label='Avg Price (₹)', color='blue', alpha=0.7)
        plt.bar(x, performance_metrics['scaled_stability'], width, label='Stability (%)', color='green', alpha=0.7)
        plt.bar(x + width, performance_metrics['scaled_records'], width, label='Market Presence (%)', color='orange', alpha=0.7)
        
        plt.xlabel('Commodity')
        plt.ylabel('Score')
        plt.title('🏆 Top 5 Commodities - Performance Metrics', fontsize=14, fontweight='bold')
        plt.xticks(x, performance_metrics.index, rotation=45, ha='right')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('profitability_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        return fig, commodity_stats

def main():
    print("🌾 AGRICULTURAL DATA VISUALIZATION DASHBOARD")
    print("=" * 60)
    
    visualizer = CropPriceVisualizer()
    
    if visualizer.load_data():
        # Create all visualizations
        visualizer.create_all_graphs()
        visualizer.create_advanced_visualizations()
        stats = visualizer.create_profitability_analysis()
        
        print("\n✅ All visualizations completed!")
        print("📁 Generated files:")
        print("   - agricultural_dashboard.png (Main dashboard)")
        print("   - advanced_analysis.png (Detailed analysis)")
        print("   - profitability_analysis.png (Business insights)")
        
        # Print key insights
        print("\n💡 KEY INSIGHTS FROM VISUALIZATIONS:")
        print("   • Check price distribution for market understanding")
        print("   • Identify most profitable commodities")
        print("   • Analyze geographic price patterns")
        print("   • Understand price stability vs profitability trade-offs")

if __name__ == "__main__":
    main()