const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    auctionId: String,
    userId: String,
    date: Date,
    price: Number
});

module.exports = offerSchema;