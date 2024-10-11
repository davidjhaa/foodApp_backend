const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },

    role:{
        type : String,
        enum : ['user','admin','owner','deliveryBoy'],
        default : 'user'
    },
});

const userModel = mongoose.model('userModel',userSchema);
module.exports = userModel;

