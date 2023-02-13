const { CatchAsyncError } = require("../middlewares/CatchAsyncError");

exports.contact = CatchAsyncError(async(req,res,next)=>{
    res.status(200).json({
        sucess:true
    })
})