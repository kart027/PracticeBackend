const ErrorMiddleware = (err,req,res,next)=>{
    err.statuscode = err.statuscode || 500 ;

    err.message = err.message || "Internal error" ;

    res.status(err.statuscode).json({
        sucess:true,
        message:err.message,
    })
}
  
module.exports = ErrorMiddleware;