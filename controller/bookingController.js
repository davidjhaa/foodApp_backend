let SK="sk_test_51N5joCSFWLzLePfQuzoSyDQbU6jM8z6hl5WDme46I2ROm7TYrQRqVbHrkIn5flurkONutm6dPSMPjuXKOnJ36fTE00t8fIMS7f";
const stripe=require('stripe')(SK);

const planModel = require("../models/planModel");
const userModel = require("../models/userModel");

module.exports.createSession=async function createSession(req,res){
    try{
    let userId=req.id;
    let planId=req.params.id;

    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: user.email,
        client_refernce_id: plan.id,
        line_items: [
          {
            name: plan.name,
            description: plan.description,
            // deploy website 
            amount: plan.price * 100,
            currency: "inr",
            quantity: 1
          }
        ],
        // dev => http
        // production => https 
        success_url: `${req.protocol}://${req.get("host")}/profile`,
        cancel_url: `${req.protocol}://${req.get("host")}/profile`
      })
      res.status(200).json({
        status: "success",
        session
      })
    } catch (err) {
      res.status(500).json({
        err: err.message
      })
    }
}