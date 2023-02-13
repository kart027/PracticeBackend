const { CatchAsyncError } = require("../middlewares/CatchAsyncError");
const Stats = require("../models/Stats")

exports.contact = CatchAsyncError(async(req,res,next)=>{
    res.status(200).json({
        sucess:true
    })
})

exports.getDashboardStats = CatchAsyncError(async(req,res,next)=>{
    const stats = await Stats.find({}).sort({created_at:"desc"}).limit(12)
})