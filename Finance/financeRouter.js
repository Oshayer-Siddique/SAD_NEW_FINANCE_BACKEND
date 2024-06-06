const express = require('express')
const path = require('path');
const router = express.Router();


const {TotalIncome,calculateTotalSales,revenue,TotalExpense,gross_margin} = require('./financeController');




router.get('/revenue',async(req,res)=>{
    const Money =  await revenue();
    res.json({Money});

})


router.get('/gross-margin',async(req,res)=>{
    const g_m =  (await gross_margin()).toFixed(2);
    res.json({Gross_Margin:g_m});

})



router.post('/net-income', async (req, res) => {
    const { tax_percent, depreciation, amortization } = req.body;

    try {
        // Assuming revenue(), TotalIncome(), depreciation, and amortization functions are defined elsewhere
        const Money = await revenue();
        const totalIncome = await TotalIncome();

        // Calculate taxable amount
        const taxable_amount = (totalIncome * tax_percent) / 100;

        // Calculate net income
        const netIncome = Money - taxable_amount - depreciation - amortization;

        res.json({ Net_Income: netIncome });
    } catch (error) {
        res.status(500).json({ error: 'Error calculating net income' });
    }
});








module.exports = router;