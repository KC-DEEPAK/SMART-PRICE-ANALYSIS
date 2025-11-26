import pandas as pd
import os
from pathlib import Path

def connect_to_csv():
    """
    Connect to the CSV file in backend/data directory
    """
    try:
        # Method 1: Using relative path (recommended)
        csv_filename = 'data/full_daily_prices.csv'
        df = pd.read_csv(csv_filename)
        
        print("✅ CSV file connected successfully!")
        print(f"📁 File name: {csv_filename}")
        print(f"📊 Dataset shape: {df.shape}")
        print(f"📝 Columns: {list(df.columns)}")
        print(f"🔢 First 5 rows:")
        print(df.head())
        
        return df, csv_filename
        
    except FileNotFoundError:
        print("❌ File not found with relative path. Trying absolute path...")
        try:
            # Method 2: Using absolute path
            current_dir = Path(__file__).parent
            csv_path = current_dir / 'data' / 'full_daily_prices.csv'
            df = pd.read_csv(csv_path)
            
            print("✅ CSV file connected successfully with absolute path!")
            print(f"📁 File name: {csv_path}")
            print(f"📊 Dataset shape: {df.shape}")
            print(f"📝 Columns: {list(df.columns)}")
            
            return df, str(csv_path)
            
        except Exception as e:
            print(f"❌ Error with absolute path: {e}")
            return None, None
    except Exception as e:
        print(f"❌ Error reading CSV file: {e}")
        return None, None

def get_file_info():
    """
    Get complete file information to paste
    """
    current_dir = Path(__file__).parent
    csv_path = current_dir / 'data' / 'full_daily_prices.csv'
    
    file_info = f"""
📁 FILE INFORMATION:
-------------------
File Name: full_daily_prices.csv
File Path: {csv_path}
Relative Path: data/full_daily_prices.csv
File Size: {os.path.getsize(csv_path) if os.path.exists(csv_path) else 'File not found'} bytes
File Exists: {os.path.exists(csv_path)}
Parent Directory: {current_dir}
-------------------
"""
    return file_info

def display_sample_data(df, num_rows=5):
    """
    Display sample data from the DataFrame
    """
    if df is not None:
        print(f"\n📋 SAMPLE DATA (First {num_rows} rows):")
        print("=" * 50)
        print(df.head(num_rows))
        print("=" * 50)
        
        print(f"\n📈 DATASET INFO:")
        print(f"Total Rows: {len(df)}")
        print(f"Total Columns: {len(df.columns)}")
        print(f"Column Names: {list(df.columns)}")
        
        # Data types info
        print(f"\n🔧 DATA TYPES:")
        print(df.dtypes)

# Main execution
if __name__ == "__main__":
    print("🔄 Connecting to CSV file...")
    
    # Connect to CSV and get dataframe + filename
    df, filename = connect_to_csv()
    
    # Display file information
    file_info = get_file_info()
    print(file_info)
    
    # Display sample data if connection successful
    if df is not None:
        display_sample_data(df)
        
        # Here's what you can paste about the file:
        print("\n📋 COPY THIS FILE INFORMATION TO PASTE:")
        print("=" * 40)
        print(f"File Name: full_daily_prices.csv")
        print(f"Location: backend/data/full_daily_prices.csv")
        print(f"Rows: {len(df)}, Columns: {len(df.columns)}")
        print(f"Columns: {list(df.columns)}")
        print("=" * 40)
    else:
        print("❌ Failed to connect to CSV file. Please check the file path.")
        