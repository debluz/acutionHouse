const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    brand: String,
    size: Number,
    yearOfProduction: Number,
    description: String
});

module.exports = productSchema;