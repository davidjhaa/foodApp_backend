const express = require('express');
const multer = require('multer');
const {getUser,updateUser,deleteUser,getAllUser,updateProfileImage} = require('../controller/userController');
const {isAuthorised,forgetpassword,resetpassword,logout} = require('../controller/authController');
const userRouter = express.Router();

userRouter
    .route('/logout')
    .get(logout)

userRouter
    .route('/forgetpassword')
    .post(forgetpassword)

userRouter
    .route('/resetpassword/:token')
    .post(resetpassword)

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

userRouter.get('/ProfileImage',(req,res)=>{
    res.sendFile("C:/Users/david/Desktop/backend/signup/multer.html");
});

userRouter
    .route('/userProfile')
    .get(getUser)


userRouter.use(isAuthorised(['admin']));
userRouter
    .route('/getAllUser')
    .get(getAllUser)



//multer for fileupload

// upload-> storage , filter
const multerStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

const filter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(new Error("Not an Image! Please upload an image"), false)
    }
  }


const upload = multer({
    storage: multerStorage,
    fileFilter: filter
});

userRouter.post("/ProfileImage", upload.single('photo') ,updateProfileImage);


module.exports=userRouter;