import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from datetime import timedelta
import json
import matplotlib.pyplot as plt

# Load data from CSV
data = pd.read_csv('./DATASETS/sales.csv')

# Convert Date column to datetime
data['Date'] = pd.to_datetime(data['Date'])

# Sort data based on dates
data.sort_values(by='Date', inplace=True)

# Set Date column as index
data.set_index('Date', inplace=True)

# Calculate total revenue
data['Units'] = data['Quantity Sold']

# Fit ARIMA model
model = ARIMA(data['Units'], order=(4,2,0))  # Example order, you may need to tune this
model_fit = model.fit()

# Get the last date in historical data
last_date = data.index[-1]

# Start forecast index from the next day
forecast_index = pd.date_range(start=last_date + timedelta(days=1), periods=30)
forecast = model_fit.forecast(steps=30)

# Create a list of dictionaries with date and forecasted revenue
forecast_with_dates = [{'date': date.strftime('%Y-%m-%d'), 'units': units} for date, units in zip(forecast_index, forecast)]

# Print forecast with dates as JSON
print(json.dumps(forecast_with_dates, indent=4))

# Plotting the forecast
plt.figure(figsize=(10, 6))
plt.plot(data.index, data['Units'], label='Historical Data')
plt.plot(forecast_index, forecast, color='red', linestyle='--', marker='o', label='Forecasted Units Sold (Next 30 days)')
plt.xlabel('Date')
plt.ylabel('Units Sold')
plt.title('Units Sold Forecast')
plt.xticks(rotation=45)
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()
