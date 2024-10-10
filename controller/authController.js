const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const {sendMail} = require('../utility/nodemailer')

// signup function
module.exports.signup = async function signup(req, res){
    try{
        const { name, email, password} = req.body;       

        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: encryptedPassword })
        if(user){
            return res.status(201).json({
                message : "user signed up",
                data : user
            })
        }
        else{
            res.json({
                message : "err on signup"
            })
        }
    }
    catch(err){
        res.json({
            message : err.message
        })
    }
}

// login check function
module.exports.login = async function login(req, res){
    try{
        const {email, password} = req.body;
        if(email){
            let user = await userModel.findOne({ email });
            if(user){
                const doesPasswordMatch = await bcrypt.compare(password, user.password)
                if(doesPasswordMatch){
                    const token = jwt.sign({userId : user._id}, process.env.JWT_PRIVATE_KEY, { expiresIn: '7d' })
                    res.cookie("login", token, { httpOnly: true, secure: true });
                    return res.status(201)
                    .json({
                        message:"logged in successfully",
                        name : user.name,
                        token : token,
                        userId : user._id
                    });
                }
                else{
                    return res.status(401).json({
                        message:"wrong credentials",
                    });
                }
            }
            else{
                return res.status(401).json({
                    message:"user not found",
                });
            }
        }
        else{
            return res.status(401).json({
                message:"plz enter ur mail Id",
            });
        }
    } 
    catch(err){
        console.log("cccccccccc")
        return res.status(401).json({
            message:err.mesage,
        });
    } 
}

// isAuthorised -> to check roles
module.exports.isAuthorised = function isAuthorised(roles) { 
    return async function(req, res, next) { 
        const token = req.headers.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            const user = await userModel.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    message: "Invalid token"
                })
            }
            req.role = user.role;
            req.userId = user._id;
            console.log(req.role);
            if (roles.includes(req.role)) { 
                next();
            } else {
                res.status(401).json({
                    message: 'Unauthorized access'
                })
            }
        } else {
            res.status(401).json({
                message: 'Unauthorized access'
            })
        }
    }
}

// protect route
module.exports.protectRoute = async function protectRoute(req,res,next){
    try{
        console.log(req.headers.authorization)
        const token = req.headers.authorization
        if(token){
            const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            const User = await userModel.findById(decode.userId);
            if(!User){
                return res.status(401).json({
                    message : "invalid token"
                })
            }
            req.userId = decode.userId;
            next();
        }
        else{
            return res.status(401).json({
                message:'please login'
            })
        }       
    }
    catch(err){
        return res.status(500).json({
            message:err.message,
        });
    }
}

//forgetPassword
module.exports.forgetpassword = async function forgetpassword(req, res) {
    let { email } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            //createResetToken is used to create a new token
            const resetToken = user.createResetToken();
            await user.save();

            // http://abc.com/resetpassword/resetToken
            const host = req.headers.origin;
            let resetPasswordLink = `${host}/resetpassword/${resetToken}`;
            console.log(resetPasswordLink);
            
            //send email to the user
            let obj = {
                resetPasswordLink : resetPasswordLink,
                email : email,
                name : user.name
            }
            sendMail('resetpassword',obj);
            return res.status(201).json({
                message:"reset link sent",
            })
        } 
        else {
            return res.status(500).json({
                mesage: "please signup",
            });
        }
    } 
    catch (err) {
      res.status(500).json({
        mesage: err.message,
      });
    }
};

// reset password
module.exports.resetpassword = async function resetpassword(req, res) {
    try {
      const token = req.params.token;
      console.log(token);
      let { password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password and confirmPassword do not match" });
      }
      const user = await userModel.findOne({ resetToken: token });
      if (user) {
        //resetPasswordHandler will update user's password in db
        await user.resetPasswordHandler(password, confirmPassword);
        await user.save();
        res.status(201).json({
            success: true,
            message: "password changed succesfully, please login again",
        });
      } 
      else {
        res.status(404).json({
            success: false,
            message: "user not found",
        });
      }
    } 
    catch (err) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
};

// logout user
module.exports.logout = function logout(req, res) {
    res.clearCookie('login', { httpOnly: true, path: '/' }); // Ensure path matches the original cookie
    res.status(200).json({
        message: 'User logged out successfully'
    });

};
  
  