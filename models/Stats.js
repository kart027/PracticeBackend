const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({

    users:{
        type:Number,
        default:0
    },
    subscription:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },


    created_at:{
        type:Date,
        default:Date.now
    }

})


module.exports = new mongoose.model('Stats',StatsSchema);