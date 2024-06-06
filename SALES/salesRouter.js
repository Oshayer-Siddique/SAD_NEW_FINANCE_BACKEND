
const express = require('express')
const path = require('path');
const router = express.Router();



const {readSalesData,readData,getTopSellingProductsRevenue,calculateTotalSales,getSalesByTimePeriod,calculateRevenueByDay,getTopSellingProductsUnits} = require('../SALES/salesController');

const filePath = path.resolve(__dirname,'../DATASETS/sales.csv');

router.get('/sales', (req, res) => {
    
    readSalesData(filePath, res);
});


router.get('/sales-by-product', async (req, res) => {
    try {
        const salesData = await readData(filePath);

        const salesByProduct = {};
        for (const sale of salesData) {
            const productName = sale['Product Name'];
            
            const salesAmount = parseFloat(sale['Unit Price']) * parseFloat(sale['Quantity Sold']);

            if (!salesByProduct[productName]) {
                salesByProduct[productName] = 0;
            }
            salesByProduct[productName] += salesAmount;
        }

        res.json({ salesByProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error reading sales data' });
    }
});



router.post('/total-sales', async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const salesData = await readData(filePath);

        let totalSales = 0;
        for (const sale of salesData) {
            const saleDate = new Date(sale.Date);
            if (saleDate >= new Date(startDate) && saleDate <= new Date(endDate)) {
                totalSales += parseFloat(sale['Unit Price']) * parseFloat(sale['Quantity Sold']);
            }
        }

        res.json({ totalSales });
    } catch (error) {
        res.status(500).json({ error: 'Error reading sales data' });
    }
});





router.get('/top-selling-products-by-revenue', async (req, res) => {
    try {
        const limit = 5;
        const topSellingProducts = await getTopSellingProductsRevenue(limit);
        res.json({ topSellingProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/top-selling-products-by-units', async (req, res) => {
    try {
        const limit = 5;
        const topSellingProducts = await getTopSellingProductsUnits(limit);
        res.json({ topSellingProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




router.get('/total-money',async(req,res)=>{
    const Money =  await calculateTotalSales();
    res.json({Money});

})




router.get('/sales-by-month', async (req, res) => {
    try {
        const salesByMonth = await getSalesByTimePeriod('month');
        res.json({ salesByMonth });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Route to get sales by quarter
router.get('/sales-by-quarter', async (req, res) => {
    try {
        const salesByQuarter = await getSalesByTimePeriod('quarter');
        res.json({ salesByQuarter });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get sales by year
router.get('/sales-by-year', async (req, res) => {
    try {
        const salesByYear = await getSalesByTimePeriod('year');
        res.json({ salesByYear });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





router.get('/revenue-by-day', async (req, res) => {
    try {
        const revenueByDay = await calculateRevenueByDay();
        res.json({ revenueByDay });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});








module.exports = router;