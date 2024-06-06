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
const { exec } = require('child_process');


dotenv.config();



// Define a route
const mongourl = process.env.DB;


//console.log(mongourl);



mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });



app.use(express.json());

app.use(cors({
  origin : "http://localhost:3000",
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// Define User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
  
    
  },
  password: {
    type: String,
    
  },
});

const User = mongoose.model('User', userSchema);


app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new user object
    const newUser = new User({ email, password });

    // Save the user to the database
    await newUser.save();

    // Respond with the newly created user
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




const storage = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, __dirname + "/DATASETS");
  },
  filename: function (req, file, callback) {
      callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
      let document = req.file; // Access the uploaded file details from the request object

      // Do something with the uploaded file, such as saving it to a database or processing it

      res.status(200).send({ message: "File Upload OK", file: document }); // Send response indicating successful file upload along with file details
  } catch (error) {
      res.status(500).send({ message: "Error uploading file", error: error.message }); // Send error response if an error occurs during file upload
  }
});




app.get('/',(req,res)=>{
    res.send("Is IT OKK::??");
  
  })



const SaleRouter = require('./SALES/salesRouter');
const IncomeExpenseRouter = require('./EXPENSE_INCOME_TRACKER/IncomeExpenseRouter');
const TransactionRouter = require('./EXPENSE_INCOME_TRACKER/Transactions');
const FinanceRouter = require('./Finance/financeRouter');



app.use('/sales',SaleRouter);
app.use('/tracking',IncomeExpenseRouter);
app.use('/transaction',TransactionRouter);
app.use('/finance',FinanceRouter);



app.get('/forecast', (req, res) => {
  exec('python revenue.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res.status(500).send('Server Error');
    }

    try {
      const forecastData = JSON.parse(stdout);
      res.json(forecastData);
    } catch (err) {
      console.error(`Error parsing JSON: ${err}`);
      res.status(500).send('Server Error');
    }
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
