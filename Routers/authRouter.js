const express = require('express');
const userModel = require('../models/userModel');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

authRouter
    .route('/signup')
    .get(middleware1,getSignup,middleware2)
    .post(postSignup)

authRouter
    .route('/login')
    .post(loginUser)


function getSignup(req, res){
    console.log("get signup called");
    next();
    // res.sendFile(__dirname + '/signup/index.html');
}

async function postSignup(req, res){
    let dataObj = req.body;
    let user =await userModel.create(dataObj);
    res.json({
        message : "user signed up",
        data : user
    })
}
    
function middleware1(req, res, next){
    console.log('middleware1 encountered');
    next();
}

function middleware2(req, res, next){
    console.log("middleware 2 encountered");
    next();
    console.log("middleware 2 ended req/res cycle");
}

async function loginUser(req,res){
    try{
        let data = req.body;
        let user = await userModel.findOne({email:data.email});
        if(user){
            // bcrypt has modified our password so plz decrypt before comparing
            if(user.password == data.password){
                res.cookie('isLoggedIn',true, {httpOnly:true});
                return res.json({
                    message:"logged in successfully",
                    userDetails:data
                });
            }
            else{
                return res.json({
                    message:"wrong credentials",
                });
            }
        }
        else{
            return res.json({
                message:"user not found",
            });
        }
    } 
    catch(err){
        return res.json({
            message:"catch error"
        });
    } 
}


module.exports=authRouter;