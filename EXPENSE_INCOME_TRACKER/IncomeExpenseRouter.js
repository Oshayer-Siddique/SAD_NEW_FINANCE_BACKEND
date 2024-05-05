const express = require('express')
const path = require('path');
const router = express.Router();

const{expensecreate,getallexpense,getExpense,TotalExpense,
    incomecreate
} = require('./IncomeExpenseController');
const Expense = require('./ExpenseModel');


router.post('/crtexpense',expensecreate);

router.post('/crtincome',incomecreate);

router.get('/getallexpense',getallexpense);

router.get('/expenses/:id', getExpense, (req, res) => {

    res.json(res.expense);

});


// Update Expense
router.patch('/updtexpenses/:id', getExpense, async (req, res) => {
    if(req.body.date != null){
        res.expense.date = req.body.date;
    }
    if(req.body.amount != null){
        res.expense.amount = req.body.amount;
    }
    if(req.body.category != null){
        res.expense.category = req.body.category;
    }
    if(req.body.description != null){
        res.expense.description = req.body.description;
    }

    try {
      const updatedExpense = await res.expense.save();
      res.json(updatedExpense);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });



  router.delete('/dltexpenses/:id', getExpense, async (req, res) => {
    try {
      await Expense.deleteOne({_id:req.params.id})
      res.json({ message: 'Expense deleted' });
        
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


  router.get('/totalexpense',TotalExpense);
  
  



module.exports = router;