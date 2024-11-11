//const { Collection, default: mongoose } = require("mongoose");

const mongoose = require("mongoose");

let reminderModel = mongoose.Schema({
    Description: String,
    Date: String,
    Time: Number,
    Category: String,
    
},
{
    collection:"reminders"
});
module.exports =mongoose.model('reminder',reminderModel);
