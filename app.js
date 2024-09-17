const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config()

const db_link = process.env.db_link;

const app = express();

app.use(cors()) ;
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3001;

app.listen(port,function(){
   console.log(`server listening on port ${port}`); 
});

app.get('/', (req,res)=>{
  res.json('api is healthy')
})

mongoose.connect(db_link)
  .then(function (db) {
    console.log("MongoDB connected successfully");
  })
  .catch(function (err) {
    console.log("Error connecting to MongoDB:", err);
  });

const userRouter = require('./Routers/userRouter');
const authRouter = require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter');
const bookingRouter = require('./Routers/bookingRouter');


   // base route   route to use
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/plans', planRouter);
app.use('/review', reviewRouter);
app.use('/booking', bookingRouter);
