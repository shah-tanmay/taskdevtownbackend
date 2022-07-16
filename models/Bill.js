const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
    },
    amount:{
        type:Number,
        require:true,
        trim:true,
    },
    unitsConsumed:{
        type:Number,
        require:true,
        trim:true,
    },
    dueDate:{
        type:Date,
        required:true,
    },
    pendingAmount:{
        type:Number,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }
})  

const Bill = mongoose.model("Bills",billSchema);

module.exports = Bill;