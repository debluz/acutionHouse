const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    firstName: String,
    lastName: String,
    birthday: Date,
    address: String,
    postalCode: String,
    products: Array,
    offers: Array
});

module.exports = userSchema;
