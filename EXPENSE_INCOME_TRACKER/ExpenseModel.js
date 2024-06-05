const mongoose = require("mongoose");


const expenseSchema = new mongoose.Schema({
    title: { type: String},
    date: { type: Date},
    amount: { type: Number},
    category: { type: String},
    description: { type: String }
  });



const Expense = mongoose.model('Expense', expenseSchema);


module.exports = Expense;