const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// schema
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },

    role:{
        type : String,
        enum : ['user','admin','owner','deliveryBoy'],
        default : 'user'
    },
    profileImage:{
        type:String,
        default:'img/default.jpeg'
    },
    resetToken : String
});

userSchema.methods.createResetToken = function(){
    // creating unique token using crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = async function(password, confirmPassword){
    const encryptedPassword = await bcrypt.hash(password, 10);
    this.password = encryptedPassword;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
}

// model
const userModel = mongoose.model('userModel',userSchema);
module.exports = userModel;


userSchema.pre('save',function(){
    this.confirmPassword=undefined; //THIS line will help to not save confirm password to db
})



// (async function createUser(){
//     let user = {
//         name:'jha',
//         email:'vishal@gmail.com',
//         password:'12345678',
//         confirmPassword:'12345678'
//     };
//     let data = await userModel.create(user);
//     console.log(data);
// })();