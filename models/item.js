const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: { type: String, required: false },
    time: { type: String, required: false },
});


module.exports = mongoose.model('Item', itemSchema);