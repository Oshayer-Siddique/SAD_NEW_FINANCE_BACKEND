const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const app = express();
const csv = require("csv-parser");
const { on } = require("events");

//const router = express.Router();

const Expense = require("./ExpenseModel");
const Income = require("./IncomeModel");

async function expensecreate(req, res) {
  try {
    const { date, amount, category, description } = req.body;
    const expense = new Expense({ date, amount, category, description });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



async function incomecreate(req, res) {
    try {
      const { date, amount, category, description } = req.body;
      const income = new Income({ date, amount, category, description });
      await income.save();
      res.status(201).json(income);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  

async function getallexpense(req, res) {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function getExpense(req, res, next) {
    try {
      const expense = await Expense.findById(req.params.id);
      if (expense == null) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.expense = expense;
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }



async function TotalExpense(req,res){
    try{
        const totalExpenses = await Expense.aggregate([
            {
                $group:{_id:null, total : {$sum : "$amount"}}
            }
        ]);
        const totalExpenseAmount = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
        res.json({totalExpenses : totalExpenseAmount});


    }
    catch(err){
        res.status(500).json({ message: err.message });

    }

}



module.exports = {
  expensecreate,
  getallexpense,
  getExpense,
  TotalExpense,
  incomecreate,
};
