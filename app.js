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



app.use('/sales',SaleRouter);
app.use('/tracking',IncomeExpenseRouter);
app.use('/transaction',TransactionRouter);






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
