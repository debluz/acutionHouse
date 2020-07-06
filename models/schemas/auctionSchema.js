const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    dateStart: Date,
    dateEnd: Date,
    priceNow: Number,
    description: String
});

module.exports = auctionSchema;