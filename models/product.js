const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    userId: String,
    auctionId: String,
    name: String,
    brand: String,
    size: Number,
    yearOfProduction: Number,
    description: String
});

const Product = mongoose.model("Product", productSchema);


module.exports = Product;