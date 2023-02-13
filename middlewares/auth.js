const User = require("../models/Usermodels");
const jwt = require("jsonwebtoken");
const  ErrorHandler  = require("../utils/Errorhandler");
const { CatchAsyncError } =require("../middlewares/CatchAsyncError");

exports.isAuthenticated = CatchAsyncError(async (req,res,next) =>{
    
        const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("not logged in"),401)
    }

    const decoded = await jwt.verify(token,process.env.JWTSECRET);

    req.user = await User.findById(decoded._id); 
    next();
    
    })


    exports.isAuthorizedadmin = CatchAsyncError(async (req,res,next) =>{
    if(req.user.role!="admin"){
        return next(new ErrorHandler("You are not allowed to perform this action",403))
    }
    next();
    
    })


    exports.isAuthorizeSubscriber = CatchAsyncError(async (req,res,next) =>{
        if(req.user.subscription.status !== "active" && req.user.role!=="admin"){
            return next(new ErrorHandler("You are not allowed to perform this action",403))
        }
        next();
        
        })