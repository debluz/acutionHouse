const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    dateStart: Date,
    dateEnd: Date,
    priceStart: Number,
    priceNow: Number,
    description: String,
    offers: Array
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;