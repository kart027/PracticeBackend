exports.CatchAsyncError = (PassedFunction)=>(req,res,next)=>{
    Promise.resolve(PassedFunction(req,res,next)).catch(next)
};