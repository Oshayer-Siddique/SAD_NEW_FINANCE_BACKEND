const express = require('express')
const path = require('path');
const router = express.Router();

const{expensecreate,getallexpense,getExpense,TotalExpense,
    incomecreate,getallincome,getIncome,TotalIncome
} = require('./IncomeExpenseController');



const Expense = require('./ExpenseModel');
const Income = require('./IncomeModel');


router.post('/crtexpense',expensecreate);

router.post('/crtincome',incomecreate);

router.get('/getallexpense',getallexpense);

router.get('/getallincome',getallincome);

router.get('/expenses/:id', getExpense, (req, res) => {

    res.json(res.expense);

});


router.get('/incomes/:id', getIncome, (req, res) => {

  res.json(res.income);

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





  router.patch('/updtincome/:id',getIncome,async (req,res) => {
    if(req.body.date != null){
      res.income.date = req.body.date;

    }
    if(req.body.amount != null){
      res.income.amount = req.body.amount;
      
    }
    if(req.body.date != null){
      res.income.category = req.body.category;
      
    }
    if(req.body.date != null){
      res.income.description = req.body.description;
      
    }

    try{
      const UpdatedIncome = await res.income.save();
      res.json(UpdatedIncome);

    }
    catch(err){
      res.status(400).json({ message: err.message });

    }
  })



  router.delete('/dltexpenses/:id', getExpense, async (req, res) => {
    try {
      await Expense.deleteOne({_id:req.params.id})
      res.json({ message: 'Expense deleted' });
        
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


  router.delete('/dltincome/:id', getIncome, async (req, res) => {
    try {
      await Income.deleteOne({_id:req.params.id})
      res.json({ message: 'Income deleted' });
        
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


  router.get('/totalexpense',TotalExpense);

  router.get('/totalincome',TotalIncome);


   
  router.get('/total-by-category', async (req, res) => {
    try {
        const results = await Income.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        res.json(results);
    } catch (err) {
        console.error('Error fetching total by category', err);
        res.status(500).send('Server Error');
    }
});



router.get('/total-expense-by-category', async (req, res) => {
  try {
      const results = await Expense.aggregate([
          {
              $group: {
                  _id: "$category",
                  totalAmount: { $sum: "$amount" }
              }
          }
      ]);

      res.json(results);
  } catch (err) {
      console.error('Error fetching total by category', err);
      res.status(500).send('Server Error');
  }
});

  



module.exports = router;