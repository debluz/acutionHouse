const express = require('express');
const router = express.Router();
const Auction = require('../models/auction');
const Product = require('../models/product');
const Offer = require('../models/offer');
const User = require('../models/user');
const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;


router.get('/:id/listOfferGuest', function (req, res) {
    const id = req.params.id;
    const auctionId = new ObjectId(id);
    Auction.findOne({_id: auctionId}, function(err, foundAuction){
        if(foundAuction){
            Offer.find({auctionId: auctionId}, function (err, foundOffers) {
                if(foundOffers){
                    res.render('listOfferGuest', {auction: foundAuction, offers: foundOffers });
                } else {
                    console.log(err);
                }
            })

        } else {
            console.log(err);
        }
    });
});

router.get('/:id/listOfferUser', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.params.id;
        const auctionId = new ObjectId(id);
        const userId = new ObjectId(req.user._id);
        Auction.findOne({_id: auctionId}, function(err, foundAuction){
            if(foundAuction){
                User.findOne({_id: userId}, function (err, foundUser) {
                    if(foundUser){
                        Offer.find({auctionId: auctionId}, function (err, foundOffers) {
                            if(foundOffers){
                                res.render('listOfferUser', {auction: foundAuction, offers: foundOffers, user: foundUser });
                            } else {
                                console.log(err);
                            }
                        });
                    } else {
                        console.log(err);;
                    }
                });
            } else {
                console.log(err);
            }
        });
    } else {
        res.render('login');
    }

});

router.delete('/:id/listOfferUser', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.params.id;
        const auctionId = new ObjectId(id);
        const userId = new ObjectId(req.user._id);
        Offer.findOne({auctionId: auctionId, userId: userId}, function (err, foundOffer) {
            if(foundOffer){
                const auctionId = new ObjectId(foundOffer.auctionId);
                User.updateOne({_id: userId}, {$pull: {offers: foundOffer._id.toString()}}, function (err) {
                    if(!err){
                        console.log("user updated");
                    } else {
                        console.log(err)
                    }
                });
                Auction.findOne({_id: auctionId}, function (err, foundAuction) {
                    if(foundAuction){
                        const index = foundAuction.offers.indexOf(foundOffer._id.toString());
                        foundAuction.priceNow = foundAuction.priceStart;
                        if(index > -1){
                            foundAuction.offers.splice(index, 1);
                        }
                        foundAuction.save();
                    } else {
                        console.log("auction:"+auctionId+" updated")
                    }
                })
                Offer.deleteOne({auctionId: auctionId, userId: userId}, function (err) {
                    if(!err){
                        console.log("offer deleted!");
                    } else {
                        console.log(err)
                    }
                });
            } else {
                console.log(err);
            }
        });
        res.redirect('/offers/'+auctionId+'/listOfferUser');

    } else {
        res.render('login');
    };
});

module.exports = router;