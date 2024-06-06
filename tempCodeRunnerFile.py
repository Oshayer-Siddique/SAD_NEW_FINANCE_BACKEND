import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

# Load data from CSV
data = pd.read_csv('./DATASETS/sales.csv')

# Convert Date column to datetime
data['Date'] = pd.to_datetime(data['Date'])

# Set Date column as index
data.set_index('Date', inplace=True)

# Calculate total revenue
data['Total Revenue'] = data['Quantity Sold'] * data['Unit Price']

# Fit ARIMA model
model = ARIMA(data['Total Revenue'], order=(5,1,0))  # Example order, you may need to tune this
model_fit = model.fit()

# Forecast next 15 days
forecast = model_fit.forecast(steps=15)

print("Forecasted revenue for the next 15 days:")
print(forecast)

import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from datetime import datetime, timedelta

# Load data from CSV
data = pd.read_csv('./DATASETS/sales.csv')

# Convert Date column to datetime
data['Date'] = pd.to_datetime(data['Date'])

# Sort data based on dates
data.sort_values(by='Date', inplace=True)

# Set Date column as index
data.set_index('Date', inplace=True)

# Calculate total revenue
data['Total Revenue'] = data['Quantity Sold'] * data['Unit Price']

# Fit ARIMA model
model = ARIMA(data['Total Revenue'], order=(4,2,0))  # Example order, you may need to tune this
model_fit = model.fit()

# Get the last date in historical data
last_date = data.index[-1]

# Start forecast index from the next day
forecast_index = pd.date_range(start=last_date + timedelta(days=1), periods=25)
forecast = model_fit.forecast(steps=25)

# Plotting
plt.figure(figsize=(10, 6))
plt.plot(data.index, data['Total Revenue'], label='Historical Data')
plt.plot(forecast_index, forecast, color='red', linestyle='--', marker='o', label='Forecasted Revenue (Next 15 days)')
plt.xlabel('Date')
plt.ylabel('Total Revenue')
plt.title('Total Revenue Forecast')
plt.xticks(rotation=45)
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()

