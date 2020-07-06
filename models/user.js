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
    offers: Array,
    auctions: Array
});

const User = mongoose.model("User", userSchema);

module.exports = User;
