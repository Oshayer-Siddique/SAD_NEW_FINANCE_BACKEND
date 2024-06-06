import pandas as pd

# Load data from CSV
data = pd.read_csv('./DATASETS/sales.csv')

# Convert Date column to datetime
data['Date'] = pd.to_datetime(data['Date'])

# Sort data based on dates
data.sort_values(by='Date', inplace=True)

# Save the sorted data to a new CSV file
data.to_csv('./DATASETS/sorted_sales.csv', index=False)

print("Data sorted by date and saved to 'sorted_sales.csv'")
