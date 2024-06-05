from fbprophet import Prophet

# Load the data
data = pd.read_csv("sales_data.csv")
data['Date'] = pd.to_datetime(data['Date'])
data.rename(columns={'Date': 'ds', 'Quantity Sold': 'y'}, inplace=True)  # Rename columns for Prophet

# Initialize Prophet model
model = Prophet()

# Fit the model
model.fit(data)

# Forecast future data
future = model.make_future_dataframe(periods=7)  # Forecasting 7 days into the future
forecast = model.predict(future)

# Plot forecast
fig = model.plot(forecast)
plt.title('Sales Forecast with Prophet')
plt.xlabel('Date')
plt.ylabel('Quantity Sold')
plt.show()
