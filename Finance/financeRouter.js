const express = require('express')
const path = require('path');
const router = express.Router();


const {TotalIncome,calculateTotalSales,revenue,TotalExpense,gross_margin} = require('./financeController');




router.get('/revenue',async(req,res)=>{
    const Money =  await revenue();
    res.json({Money});

})


router.get('/gross-margin',async(req,res)=>{
    const g_m =  await gross_margin();
    res.json({Gross_Margin:g_m});

})



router.post('/net-income', async(req,res)=>{
    const {tax_parcent, depreciation, amortization} = req.body;

    try{

        const g_m = await gross_margin();
        const taxable_amount = (await TotalIncome() * tax_parcent) / 100;
        //depreciation is tangable cost
        const dp = depreciation;
        //amortization is intangable cost
        const am = amortization;

        



    }
    catch(error){
        res.status(500).json({ error: 'Error reading sales data' });
 
    }
})







module.exports = router;