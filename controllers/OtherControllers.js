const { CatchAsyncError } = require("../middlewares/CatchAsyncError");
const Stats = require("../models/Stats")

exports.contact = CatchAsyncError(async(req,res,next)=>{
    res.status(200).json({
        sucess:true
    })
})

exports.getDashboardStats = CatchAsyncError(async(req,res,next)=>{
    const stats = await Stats.find({}).sort({created_at:"desc"}).limit(12)

    const statData = [];
    const requiredSize = 12 - stats.length

    for(let i =0;i<stats.lenght;i++){
        statData.unshift(stats[i]);
    }
    for(let i = 0; i < requiredSize; i++){
        statData.unshift({
            users:0,
            subscription:0,
            views:0
        })
}
    let userPercentage = 0, viewsPercentage = 0, subscriptionPercentage = 0
let userProfit = true,viewsProfit = true,subscriptionProfit = true

    const usersCount = statData[11].users
    const subscriptionCount = statData[11].subscription
    const viewsCount = statData[11].viewsCount
    if(statData[10].users == 0) userPercentage = usersCount*100;
    if (statData[10].views == 0) viewsPercentage= viewsCount * 100;
    if (statData[10].subscription == 0) 
        subscriptionPercentage = subscriptionCount * 100;
    else{
        const difference = {
            users: statData[11].users  - statData[10].users,
            views: statData[11].views - statData[10].views,
            subscription: statData[11].subscription - statData[10].subscription
        };

        userPercentage = (difference.users / statData[10].users)*100;
        viewsPercentage = (difference.views / statData[10].views)*100;
        subscriptionPercentage = (difference.subscription / statData[10].subscription)
        if(userPercentage<0) userProfit = false;
        if(viewsPercentage<0) viewsProfit = false;
        if(subscriptionPercentage<0) subscriptionProfit = false
    }



res.status(200).json({
    sucess:true,
    usersCount,
    subscriptionCount,
    viewsCount,
    stats:statData,
    viewsPercentage,
    viewsProfit,
    userPercentage,
    userProfit,
    subscriptionPercentage,
    subscriptionProfit
})
     
})