const mongoose = require("mongoose");


const incomeSchema = new mongoose.Schema({
    title: { type: String},
    date: { type: Date},
    amount: { type: Number},
    category: { type: String},
    description: { type: String }
  });



const Income = mongoose.model('Income', incomeSchema);


module.exports = Income;