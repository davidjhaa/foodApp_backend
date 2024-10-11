const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./Routers/userRouter');
const authRouter = require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter');
const bookingRouter = require('./Routers/bookingRouter');

require('dotenv').config()

const db_link = process.env.db_link;

const app = express();


app.use(cors({
    origin: process.env.frontendOrigin,  
    credentials: true,  
}));
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
    console.log("Error connecting to DB:", err);
  });

   // base route   route to use
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/plans', planRouter);
app.use('/review', reviewRouter);
app.use('/booking', bookingRouter);


// const reviewModel = require('./models/reviewModel'); // Adjust the path to your model

// const reviewData = [
//   {
//     review: "This plan has been great so far! Really enjoying it.",
//     rating: 9,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c447"),
//   },
//   {
//     review: "Good plan, but could use more flexibility in meal choices.",
//     rating: 7,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c446"),
//   },
//   {
//     review: "The plan is amazing and very affordable.",
//     rating: 10,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c447"),
//   },
//   {
//     review: "Not worth the price, very basic options available.",
//     rating: 4,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c446"),
//   },
//   {
//     review: "Loved the variety of meals offered in this plan!",
//     rating: 8,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c446"),
//   },
//   {
//     review: "The plan didn't meet my expectations. Customer service was slow.",
//     rating: 5,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c447"),
//   },
//   {
//     review: "This is my go-to plan! I've recommended it to several friends.",
//     rating: 9,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c447"),
//   },
//   {
//     review: "Affordable and convenient. Definitely a time-saver!",
//     rating: 8,
//     user: new mongoose.Types.ObjectId("67081f1d08690cc72c5ab93b"),
//     plan: new mongoose.Types.ObjectId("6708361cb0070d93af07c447"),
//   },
// ];

// reviewModel.insertMany(reviewData)
//   .then(() => console.log("Data inserted successfully"))
//   .catch(err => console.error("Error inserting data", err));
