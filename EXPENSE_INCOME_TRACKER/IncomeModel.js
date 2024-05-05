const mongoose = require("mongoose");


const incomeSchema = new mongoose.Schema({
    date: { type: Date},
    amount: { type: Number},
    category: { type: String},
    description: { type: String }
  });



const Income = mongoose.model('Income', incomeSchema);


module.exports = Income;