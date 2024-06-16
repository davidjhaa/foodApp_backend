const userModel = require('../models/userModel');

module.exports.getUser = async function getUser(req,res){
    console.log(req.headers.userid);
    let user = await userModel.findById(req.headers.userid);
    console.log(user);
    if(user){
        return res.status(200).json({
            user : user
        });
    }
    else{
        return res.status(404).json({
            message:'user not found'
        });
    }
}

module.exports.updateUser=async function updateUser(req,res){
    try{
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        console.log(dataToBeUpdated);
        let user = await userModel.findById(id);
        if(user){
            const keys=[];
            for(let key in dataToBeUpdated){
                keys.push(key);
            }
            for(let i = 0; i < keys.length;i++){
                user[keys[i]] = dataToBeUpdated[keys[i]];
            }
            await user.save();
        
            res.status(200).json({
                message : "data updated",
                updatedData : user
            })
        }
        else{
            res.status(404).json({
                message : "user not found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            message : err.message,
        });
    }
};

module.exports.deleteUser=async function deleteUser(req,res){
    try{
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);
        if(!user){
            res.status(404).json({
                message:'user not found'
            })
        }
        res.status(200).json({
            message : "data has been deleted",
            deletedData : user
        })
    }
    catch(err){
        res.status(500).json({
            message : err.message
        })
    }
};

module.exports.getAllUser=async function getAllUser(req,res){
    let users = await userModel.find();  
    try{
        if (users && users.length > 0){
            res.status(200).json({
                message : "users recieved",
                data : users
            });
        }  
        else {
            res.status(404).json({
                message: "No users found"
            });
        }
    }
    catch(err){
        res.status(500).json({
            message : err.message
        })
    }
}

module.exports.updateProfileImage=function updateProfileImage(req,res){
    res.json({
      message:'file uploaded succesfully'
    });
}

//  use 0f cookies npm =>cookie-parser
// function setCookies(req,res){
//     res.setHeader('Set-Cookie', 'isLoggedIn=true');
//     res.cookie('isLoggedIn',true,{maxAge:1000*60*60*24, secure:true, httpOnly:true});
//     res.cookie('isPrimeMember',true);
//     res.send('cookie has been set');
// }

// function getCookies(req,res){
//     let cookie = req.cookies;
//     console.log(cookie);
//     res.send('cookies recieved');
// }
