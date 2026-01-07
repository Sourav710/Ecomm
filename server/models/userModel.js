const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');
require('dotenv').config();
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
                min: [1, 'Quantity can not be less than 1'],
            },
        },
    ],
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema);