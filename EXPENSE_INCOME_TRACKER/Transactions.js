const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');
const router = express.Router();



// Define Transaction Schema
const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    last_processed_date: { type: Date }
  });
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  

// Create Recurring Transaction
router.post('/newtransactions', async (req, res) => {
    try {
      const { amount, category, description, frequency, start_date, end_date } = req.body;
      const transaction = new Transaction({ amount, category, description, frequency, start_date, end_date });
      await transaction.save();
      res.status(201).json(transaction);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });



cron.schedule('* * * * *',async()=>{
    try{
        const currentDate = new Date();

        const recurringTransactions = await Transaction.find({end_date:{$gte:currentDate}});
        recurringTransactions.forEach(async(transaction) => {
            const lastProcessedDate = transaction.last_processed_date || transaction.start_date;
            const nextProcessingDate = getNextProcessingDate(lastProcessedDate, transaction.frequency);

            if(nextProcessingDate <= currentDate){
                const newTransaction = new Transaction({
                    amount: transaction.amount,
                    category: transaction.category,
                    description: transaction.description,
                    frequency: transaction.frequency,
                    start_date: transaction.start_date,
                    end_date: transaction.end_date,
                    last_processed_date: currentDate
                });
                await newTransaction.save();
            }

        })


    }catch(err){
        console.error('Error processing recurring transaction',err);

    }
})



function getNextProcessingDate(lastProcessedDate,frequency){
    const nextDate = new Date(lastProcessedDate);
    switch(frequency){
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setDate(nextDate.getDate() + 30);
            break;

    }

    return nextDate;
}



module.exports = router;