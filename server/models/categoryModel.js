const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        reqquried: [true, 'Please enter category name'],
        trim: true,
        unique: true,

    }
})

module.exports = mongoose.model('Category', categorySchema);
