const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const app = express();
const csv = require('csv-parser');
const { on } = require("events");
const { exec } = require('child_process');


dotenv.config();



// Define a route
const mongourl = process.env.DB;


//console.log(mongourl);



mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });



app.use(express.json());

app.use(cors({
  origin : "http://localhost:3000",
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.get('/',(req,res)=>{
    res.send("Is IT OKK::??");
  
  })



const SaleRouter = require('./SALES/salesRouter');
const IncomeExpenseRouter = require('./EXPENSE_INCOME_TRACKER/IncomeExpenseRouter');
const TransactionRouter = require('./EXPENSE_INCOME_TRACKER/Transactions');
const FinanceRouter = require('./Finance/financeRouter');



app.use('/sales',SaleRouter);
app.use('/tracking',IncomeExpenseRouter);
app.use('/transaction',TransactionRouter);
app.use('/finance',FinanceRouter);



app.get('/forecast', (req, res) => {
  exec('python revenue.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res.status(500).send('Server Error');
    }

    try {
      const forecastData = JSON.parse(stdout);
      res.json(forecastData);
    } catch (err) {
      console.error(`Error parsing JSON: ${err}`);
      res.status(500).send('Server Error');
    }
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
