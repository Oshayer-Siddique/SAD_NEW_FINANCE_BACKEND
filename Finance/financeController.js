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



const Income  = require('../EXPENSE_INCOME_TRACKER/IncomeModel');

const Expense = require('../EXPENSE_INCOME_TRACKER/ExpenseModel');
const { readData } = require("../SALES/salesController");
const filePath = path.resolve(__dirname,'../DATASETS/sales.csv');


//const totalIncomeAmount = 0;

async function calculateTotalSales(){
    try{
         const salesData = await readData(filePath);

         let totalSalesAmount = 0;

         for(const sale of salesData){
            const saleamount = parseFloat(sale['Quantity Sold']) * parseFloat(sale['Unit Price']);
            totalSalesAmount += saleamount;
         }
         return totalSalesAmount;



    }
    catch(error){
        throw new Error('Error reading sales data');
    }
}


async function TotalIncome(){
    try{
        const totalIncomes = await Income.aggregate([
            {
                $group:{_id:null, total : {$sum : "$amount"}}
            }
        ])
        
        const totalIncomeAmount = totalIncomes.length > 0 ? totalIncomes[0].total: 0;
        //console.log(totalIncomeAmount);
        return totalIncomeAmount;


    }
    catch(error){
        throw new Error('Error reading sales data');
    }
}


async function revenue(){
    const revenue = await TotalIncome() + await calculateTotalSales();

    return revenue;

}


async function TotalExpense(){
    try{
        const totalexpense = await Expense.aggregate([
            {
                $group:{_id:null, total : {$sum : "$amount"}}

            }
        ])

        const totalExpenseAmount = totalexpense.length > 0 ? totalexpense[0].total : 0;
        return totalExpenseAmount;


    }
    catch(error){
        throw new Error('Error reading COGS');
    }
}


async function gross_margin(){
    try{
        const g_m = ((await revenue() - await TotalExpense()) / (await revenue())) * 100;
        return g_m;

    }
    catch(error){
        throw new Error('Error reading gross margin');

    }
}












module.exports = {
    TotalIncome,
    calculateTotalSales,
    revenue,
    TotalExpense,
    gross_margin,
}