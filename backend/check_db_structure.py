import sqlite3
import pandas as pd
import os

def check_database_structure():
    databases = ['crop_prices.db', 'full_daily_prices.db', 'crop_data.db', 'crops.db']
    
    print("🔍 Agricultural Database Structure Diagnostic")
    print("=" * 60)
    
    for db_name in databases:
        print(f"\n📁 Database: {db_name}")
        print("-" * 40)
        
        # Check if database file exists
        if not os.path.exists(db_name):
            print("❌ Database file not found")
            continue
            
        try:
            conn = sqlite3.connect(db_name)
            
            # Get all tables
            tables = pd.read_sql_query(
                "SELECT name FROM sqlite_master WHERE type='table'", 
                conn
            )
            
            if tables.empty:
                print("❌ No tables found in this database")
                conn.close()
                continue
                
            print(f"✅ Found {len(tables)} table(s):")
            
            for table_name in tables['name']:
                print(f"\n📊 Table: '{table_name}'")
                
                # Get table schema
                schema = pd.read_sql_query(f"PRAGMA table_info({table_name})", conn)
                print("   Columns:")
                for _, col in schema.iterrows():
                    print(f"     [{col['cid']}] {col['name']} ({col['type']})")
                
                # Get record count
                count_result = conn.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()
                record_count = count_result[0]
                print(f"   📈 Total records: {record_count}")
                
                # Get sample data (first 3 rows)
                try:
                    sample = pd.read_sql_query(f"SELECT * FROM {table_name} LIMIT 3", conn)
                    print(f"\n   Sample data (first 3 rows):")
                    print("   " + "-" * 30)
                    
                    # Print column headers
                    headers = sample.columns.tolist()
                    print(f"   {headers}")
                    
                    # Print sample rows
                    for _, row in sample.iterrows():
                        print(f"   {row.tolist()}")
                        
                except Exception as e:
                    print(f"   ❌ Error reading sample data: {e}")
                    
                # Show some unique values for important columns
                try:
                    # Check for common column names
                    possible_columns = {
                        'crop': ['crop', 'commodity', 'item', 'product'],
                        'district': ['district', 'region', 'area'],
                        'market': ['market', 'location', 'mandi', 'market_center'],
                        'price': ['price', 'value', 'rate', 'amount'],
                        'date': ['date', 'timestamp', 'day', 'created_at']
                    }
                    
                    print(f"\n   🔍 Unique values in key columns:")
                    for col_type, possible_names in possible_columns.items():
                        for possible_name in possible_names:
                            if possible_name in [col.lower() for col in sample.columns]:
                                # Found a matching column
                                actual_col = [col for col in sample.columns if col.lower() == possible_name][0]
                                unique_vals = pd.read_sql_query(
                                    f"SELECT DISTINCT {actual_col} FROM {table_name} LIMIT 5", 
                                    conn
                                )
                                print(f"     {actual_col}: {unique_vals[actual_col].tol()}")
                                break
                            
                except Exception as e:
                    print(f"   ⚠️  Could not analyze unique values: {e}")
                    
            conn.close()
            
        except Exception as e:
            print(f"❌ Error analyzing database: {e}")

def check_specific_queries():
    """Test some specific queries to understand data better"""
    print(f"\n🎯 Testing Specific Queries")
    print("=" * 50)
    
    if os.path.exists('crop_prices.db'):
        try:
            conn = sqlite3.connect('crop_prices.db')
            
            # Get first table (assuming it's the main one)
            tables = pd.read_sql_query(
                "SELECT name FROM sqlite_master WHERE type='table' LIMIT 1", 
                conn
            )
            
            if not tables.empty:
                table_name = tables['name'][0]
                print(f"📋 Testing queries on table: {table_name}")
                
                # Get all column names
                schema = pd.read_sql_query(f"PRAGMA table_info({table_name})", conn)
                all_columns = schema['name'].tolist()
                print(f"   All columns: {all_columns}")
                
                # Try to find what columns contain crop data
                sample_row = pd.read_sql_query(f"SELECT * FROM {table_name} LIMIT 1", conn)
                print(f"\n   Sample row structure:")
                for col, value in sample_row.iloc[0].items():
                    print(f"     {col}: {value} ({type(value).__name__})")
                    
            conn.close()
            
        except Exception as e:
            print(f"❌ Error in specific queries: {e}")

if __name__ == "__main__":
    check_database_structure()
    check_specific_queries()
    print("\n" + "=" * 60)
    print("✅ Diagnostic completed!")