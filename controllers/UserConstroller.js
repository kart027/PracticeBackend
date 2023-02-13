const  ErrorHandler  = require("../utils/Errorhandler");
const User = require("../models/Usermodels");
const { CatchAsyncError } =require("../middlewares/CatchAsyncError");
const {sendToken} = require("../utils/SendToken");
const { sendEmail } = require("../utils/SendEmail");
const Course = require("../models/CourseSchema")
const cloudinary = require("cloudinary")
const getDatauri = require("../utils/DataUri")

const crypto = require("crypto")


exports.register = CatchAsyncError(async(req,res,next)=>{
    const { name,email,password} = req.body;
    const file = req.file;
   

    if(!name|| !email || !password){
        return next(new ErrorHandler("Please addd all field",400))
    }

    let user = await User.findOne({email});

    if(user){
        return next(new ErrorHandler("User alerdy exist"),409)
    }
 

    const fileuri = getDatauri(file)

    const mycloud = await cloudinary.v2.uploader.upload(fileuri.content)
    user = await User.create({
        name,
        email,
        password,
        avatar:{
         public_id:mycloud.public_id,
            url:mycloud.secure_url,
          }
    })

    sendToken(res,user,"Registerred Succesfully",201);
})


exports.login = CatchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    if( !email || !password){
        return next(new ErrorHandler("Please addd all field",400))
    }

    const user = await User.findOne({email})

    if(!user){
        return next(new ErrorHandler("User Doesn't Exist",400))
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorHandler(" Incoreect Email or password  "))
    }

    sendToken(res,user,"Welcome back",)

})

exports.logout = CatchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now())
    }).json({
        sucess:true,
        message:"logout"
    })

})

exports.getMyprofile = CatchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user._id);
    
    res.status(200).json({
        sucess:true,
       user
    })

})


exports.deleteMyprofile = CatchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user._id);

    if(!user){
        return next(new ErrorHandler("User Doesn't Exist",400))
    }

    
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

   await user.remove();
    
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now() + 15*24*60*60*1000),
        httpOnly:true,
        //secure:true,
       
    }).json({
        sucess:true,
       message:"user deleted"
    })

})
exports.changepassword = CatchAsyncError(async(req,res,next)=>{

    const { oldPassword,newwPassword} = req.body;
    if( !oldPassword || !newwPassword){
        return next(new ErrorHandler("Please addd all field",400))
    }


    const user = await User.findById(req.user._id);
    
    const isMatch = await user.matchPassword(oldPassword);

    if(!isMatch){
        return next(new ErrorHandler("Imcorrect old Password",400))
    }
        user.password = newwPassword;
        await user.save();
    
        res.status(200).json({
            sucess:true,
           message:"Password change sucessfully"
        })

})



exports.Updateprofile = CatchAsyncError(async(req,res,next)=>{

    const { name,Email} = req.body;
    if( !name ){
        return next(new ErrorHandler("Please addd all field",400))
    }


    const user = await User.findById(req.user._id);
    
   
       if(name) user.name = name;
       if(Email) user.email = email;
        await user.save();
    
        res.status(200).json({
            sucess:true,
           message:"Profile updated"
        })

})

exports.Updateprofilepictu = CatchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id)


    
    if(!user){
        return next(new ErrorHandler("User Doesn't Exist",400))
    }
   
    const file = req.file;

    const fileuri = getDatauri(file)

    const mycloud = await cloudinary.v2.uploader.upload(fileuri.content)

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      
    user.avatar = {
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
    }

    await user.save();
   
        res.status(200).json({
            sucess:true,
           message:"Profile updated"
        })

})



exports.forgetpassword = CatchAsyncError(async(req,res,next)=>{

   const { email} = req.body;

   const user = await User.findOne({email});

   if(!user){
    return next(new ErrorHandler("User not found",400));
   }

   const resettoken = await user.getresetToken();

   await user.save();

   const url =`${process.env.frontenUrl}/resetpassword/${resettoken}`

   const message = `Click on the link to reset password. ${url}.`

   sendEmail(user.email,"ResetPasword",message)

    res.status(200).json({
        sucess:true,
       message:`Reset token send to ${user.email}`
    })

})

exports.resetpassword = CatchAsyncError(async(req,res,next)=>{

   const {token} = req.params;

    const reserpassword = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({reserpassword,
        resetPasswordExpire:{
            $gt:Date.now()
        }});

        if(!user){
            return next(new ErrorHandler("Token is invalid or hass been expired"))
        }

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

                await user.save();


    res.status(200).json({
        sucess:true,
        message:"Password changed sucessfully"
    })

})

// Admin

exports.getallUser = CatchAsyncError(async(req,res,next)=>{

        const user = await User.find()
 
        
 
     res.status(200).json({
         sucess:true,
        user
     })
 
 })
 

 exports.updateUserrole = CatchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("Token is invalid or hass been expired"))
    }

        if(user.role=="user"){
            user.role = "admin"
        }else{
            user.role = "user"
        }

    await user.save()

 res.status(200).json({
     sucess:true,
    message:"user role updated"
 })

})



exports.deleteUser = CatchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("Token is invalid or hass been expired"))
    }

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    // Cnacel Subscription
    await user.remove();

 res.status(200).json({
     sucess:true,
    message:"Deleted"
 })

})


User.watch().on("change",async()=>{})





