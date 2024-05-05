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


const router = express.Router();
const filePath = path.resolve(__dirname,'../DATASETS/sales.csv');




async function readSalesData(filePath,res){
    const salesData = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data',(row)=>{
            const date = row['Date'];
            const productId = row['Product ID'];
            const productName = row['Product Name'];
            const quantitySold = parseInt(row['Quantity Sold']);
            const unitPrice = parseFloat(row['Unit Price']);


            const totalSales = quantitySold * unitPrice;


            salesData.push({
                date,
                productId,
                productName,
                quantitySold,
                unitPrice,
                totalSales
            });



        })
        .on('end',()=>{
            res.json(salesData);

        })
        .on('error',(error)=>{
            res.status(500).json({ error: 'Error reading CSV file' });

        })
        
}

function readData(filePath) {
    return new Promise((resolve, reject) => {
        const salesData = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                salesData.push(row);
            })
            .on('end', () => {
                resolve(salesData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


async function getTopSellingProductsRevenue(limit = 5){
    try {
        const salesData = await readData(filePath);
        
        const productRevenueMap = {};
        for (const sale of salesData) {
            const productName = sale['Product Name'];
            const quantitySold = parseInt(sale['Quantity Sold']);
            const unitPrice = parseFloat(sale['Unit Price']);
            const revenue = quantitySold * unitPrice;
            
            if (!productRevenueMap[productName]) {
                productRevenueMap[productName] = 0;
            }
            productRevenueMap[productName] += revenue;
        }
        
        const topSellingProducts = Object.entries(productRevenueMap)
            .sort((a, b) => b[1] - a[1]) // Sort by total revenue in descending order
            .slice(0, limit) // Select top N products
            .map(([productName, revenue]) => ({ productName, revenue }));
        
        return topSellingProducts;
    } catch (error) {
        throw new Error('Error reading sales data');
    }


}


async function getTopSellingProductsUnits(limit = 5){
    try {
        const salesData = await readData(filePath);
        
        const productUnitMap = {};
        for (const sale of salesData) {
            const productName = sale['Product Name'];
            const quantitySold = parseInt(sale['Quantity Sold']);

            
            if (!productUnitMap[productName]) {
                productUnitMap[productName] = 0;
            }
            productUnitMap[productName] += quantitySold;
        }
        
        const topSellingProducts = Object.entries(productUnitMap)
            .sort((a, b) => b[1] - a[1]) // Sort by total revenue in descending order
            .slice(0, limit) // Select top N products
            .map(([productName, quantitySold]) => ({ productName, quantitySold }));
        
        return topSellingProducts;
    } catch (error) {
        throw new Error('Error reading sales data');
    }


}


async function calculateTotalSales(){
    try{

        const salesData = await readData(filePath);
        for(const sale of salesData){
            sale['Total Sales'] = parseFloat(sale['Quantity Sold'] ) * parseFloat(sale['Unit Price']);

        }

        return salesData;


    }
    catch(error){
        throw new Error('Error reading sales data');

    }
}



async function getSalesByTimePeriod(period) {
    try {
        const salesData = await calculateTotalSales();
        
        const salesByTimePeriod = {};
        for (const sale of salesData) {
            const date = new Date(sale.Date);
            let key;

            if (period === 'month') {
                key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            } else if (period === 'quarter') {
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                key = `${date.getFullYear()}-Q${quarter}`;
            } else if (period === 'year') {
                key = `${date.getFullYear()}`;
            } else {
                throw new Error('Invalid time period specified');
            }

            if (!salesByTimePeriod[key]) {
                salesByTimePeriod[key] = 0;
            }
            salesByTimePeriod[key] += sale['Total Sales'];
        }
        
        return salesByTimePeriod;
    } catch (error) {
        throw new Error('Error calculating sales by time period');
    }
}



async function calculateRevenueByDay() {
    try {
        const salesData = await readData('./DATASETS/sales.csv');
        const revenueByDay = {};
        
        salesData.forEach((sale) => {
            const date = sale.Date;
            const revenue = parseFloat(sale['Quantity Sold']) * parseFloat(sale['Unit Price']);
            
            if (!revenueByDay[date]) {
                revenueByDay[date] = 0;
            }
            revenueByDay[date] += revenue;
        });

        return revenueByDay;
    } catch (error) {
        throw new Error('Error calculating revenue by day');
    }
}












module.exports = {
    readSalesData,
    readData,
    getTopSellingProductsRevenue,
    calculateTotalSales,
    getSalesByTimePeriod,
    calculateRevenueByDay,
    getTopSellingProductsUnits,
}
    