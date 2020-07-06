const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    auctionId: String,
    userId: String,
    date: Date,
    price: Number
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
