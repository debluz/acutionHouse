const express = require('express');
const router = express.Router();
const Auction = require('../models/auction');
const Product = require('../models/product');
const Offer = require('../models/offer');
const User = require('../models/user');
const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;
var errors = [];

var patternMessages = {
    offer: "Kwota musi być większa niż aktualna",
    empty: "Wprowadź kwotę!",
    user: "Nie możesz licytować swoich aukcji!",
    date: "Data zakończenia musi być późniejsza niż obecna!",
    priceNow: "Cena początkowa nie może być większ od obecnej!"
};


router.get("/listOfAuctionsUser", function (req, res) {
    if(req.isAuthenticated()){
        Auction.find(function(err, foundAuctions){
            if(!err){
                Product.find(function (err, foundProducts) {
                    if(foundProducts){
                        res.render('listOfAuctionsUser', {auctions: foundAuctions, products: foundProducts});
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err)
            }
        });

    } else {
        res.render("listOfAuctionsGuest");
    }
});


router.get('/listOfAuctionsGuest', function (req, res) {
    Auction.find(function(err, foundAuctions){
        if(!err){
            Product.find(function (err, foundProducts) {
                if(foundProducts){
                    res.render('listOfAuctionsGuest', {auctions: foundAuctions, products: foundProducts});
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err)
        }
    });
});

router.get('/auctionDetailsGuest/:id', function (req, res) {
    const id = req.params.id;
    const auctionId = new ObjectId(id);
    Auction.findOne({_id: auctionId}, function(err, foundAuction){
        if(!err){
            Product.findOne({auctionId: foundAuction._id}, function (err, foundProduct) {
                if(foundProduct){
                    res.render('auctionDetailsGuest', {product: foundProduct, auction: foundAuction });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err)
        }
    });
});

router.get('/auctionDetailsUser/:id', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.params.id;
        const auctionId = new ObjectId(id);
        Auction.findOne({_id: auctionId}, function(err, foundAuction){
            if(!err){
                Product.findOne({auctionId: foundAuction._id}, function (err, foundProduct) {
                    if(foundProduct){
                        res.render('auctionDetailsUser', {product: foundProduct, auction: foundAuction, errorsList: errors});
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err)
            }
        });
    } else {
        res.redirect("/users/login");
    }

});

router.post('/auctionDetailsUser/:id', function (req, res) {
    errors = [];
    if(req.isAuthenticated()){
        const id = req.params.id;
        const auctionId = new ObjectId(id);
        const userId = new ObjectId(req.user._id);
        Auction.findOne({_id: auctionId}, function(err, foundAuction){
            if(foundAuction){
                if(!(req.body.offer > foundAuction.priceNow)){
                    errors.push(patternMessages.offer);
                };
                if(validator.isEmpty(req.body.offer)){
                    errors.push(patternMessages.empty);
                }
                if(foundAuction.userId != req.user._id){
                    if(errors.length > 0){
                        errors.forEach(function (error) {
                            console.log(error);
                        });
                        res.redirect('/auctions/auctionDetailsUser/'+id);
                    }else {
                        User.findOne({_id: userId}, function (err, foundUser) {
                            if (foundUser) {
                                Offer.findOne({userId: userId, auctionId: req.params.id}, function (err, foundOffer) {
                                    if (foundOffer) {
                                        Offer.updateOne(
                                            {userId: req.user._id, auctionId: req.params.id},
                                            {
                                                auctionId: req.params.id,
                                                userId: req.user._id,
                                                date: new Date(),
                                                price: req.body.offer
                                            }, function (err) {
                                                if(!err){
                                                    console.log("Offer "+foundOffer+"has been updated!");
                                                    console.log("success");
                                                } else {
                                                    console.log("fail");
                                                }
                                            });
                                        console.log("productId:"+ req.params.id+"\n"+
                                            "userId:"+ req.user._id+"\n"+
                                            "dateStart:"+ new Date()+"\n"+
                                            "dateEnd:"+ foundAuction.dateEnd+"\n"+
                                            "priceNow:"+ req.body.offer+"\n"+
                                            "description:" +foundAuction.description+"\n"+
                                            "offers:"+ foundAuction.offers+"\n"
                                        );
                                        console.log(foundAuction._id);
                                        foundAuction.priceNow = req.body.offer;
                                        foundAuction.save(function (err) {
                                            if(!err){
                                                console.log("Auction "+foundAuction._id+" has been updated!")
                                            } else {
                                                console.log(2);
                                            };
                                        });
                                        /*Auction.updateOne(
                                            {_id: foundAuction._id},
                                            {
                                                productId: foundAuction.productId,
                                                userId: req.user._id,
                                                dateStart: new Date(),
                                                dateEnd: foundAuction.dateEnd,
                                                priceNow: req.body.offer,
                                                description: foundAuction.description,
                                                offers: foundAuction.offers}
                                        );*/
                                        console.log("redirecting");
                                        res.redirect('/auctions/auctionDetailsUser/'+id);
                                    } else {
                                        const newOffer = new Offer({
                                            auctionId: req.params.id,
                                            userId: req.user._id,
                                            date: new Date(),
                                            price: req.body.offer
                                        });
                                        foundUser.offers.push(newOffer._id.toString());
                                        foundUser.save(function(err){
                                            if(!err){
                                                console.log("User "+foundUser._id+" has been updated!")
                                            } else {
                                                console.log(1);
                                            };
                                        });
                                        foundAuction.offers.push(newOffer._id.toString());
                                        foundAuction.priceNow = req.body.offer;
                                        foundAuction.save(function (err) {
                                            if(!err){
                                                console.log("Auction "+foundAuction._id+" has been updated!")
                                            } else {
                                                console.log(2);
                                            };
                                        });
                                        newOffer.save(function (err) {
                                            if(!err){
                                                console.log("Succesfully added new offer!")
                                            } else {
                                                console.log(3)
                                            }
                                        });
                                        console.log("redirecting");
                                        res.redirect('/auctions/auctionDetailsUser/'+id);
                                    };
                                });
                            } else {
                                console.log(4);
                            }
                        });
                    }

                } else {
                    errors.push(patternMessages.user);
                    res.redirect('/auctions/auctionDetailsUser/'+id);
                };
            } else {
                console.log(5)
            }
        });
    } else {
        res.render('login');
    }
});

router.get('/auctionedProducts', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.user._id;
        const userId = new ObjectId(id);
        Auction.find(function(err, foundAuctions){
            if(foundAuctions){
                Product.find(function (err, foundProducts) {
                    if(foundProducts){
                        const auctionId = new ObjectId(foundAuctions._id);
                        Offer.find({userId: userId}, function (err, foundOffers) {
                            if(foundOffers){
                                User.findOne({_id:userId}, function (err, foundUser) {
                                    if(foundUser){
                                        res.render('auctionedProducts', {auctions: foundAuctions, products: foundProducts, offers: foundOffers, user: foundUser});
                                    } else {
                                        console.log(err);
                                    }
                                });
                            }
                        });
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err)
            }
        });

    } else {
        res.render("login");
    }
});

router.get('/:id/editAuction', function (req, res) {
    if(req.isAuthenticated){
        const id = req.params.id;
        const auctionId = new ObjectId(id);
        Auction.findOne({_id: auctionId}, function (err, foundAuction) {
            if(foundAuction){
                var dateEnd = new Date(foundAuction.dateEnd);
                dateEnd = dateEnd.toISOString();
                dateEnd = dateEnd.slice(0,10);
                res.render('editAuction', {auction: foundAuction, date:dateEnd, errorsList: errors});
            } else {
                console.log(err);
            }
        });
    } else {
        res.render('login');
    }
});

router.put('/:id/editAuction', function (req, res) {
    if(req.isAuthenticated){
        errors = [];
        const id = req.params.id;
        const auctionId = new ObjectId(id);
        var date = new Date();
        var dateString = date.toISOString();
        dateString = dateString.slice(0,10);
        Auction.findOne({_id:auctionId}, function (err, foundAuction) {
            if(foundAuction){
                if(dateString >= req.body.dateEnd){
                    errors.push(patternMessages.date)
                    console.log("error added");
                }
                if(req.body.priceNow > foundAuction.priceNow){
                    errors.push(patternMessages.priceNow)
                    console.log("error added");
                }
                if(errors.length > 0){
                    errors.forEach(function (error) {
                        console.log(error);
                    });
                    res.redirect('/auctions/'+id+'/editAuction');
                } else {
                    Auction.updateOne({_id:auctionId},
                        {
                            priceStart: req.body.priceNow,
                            dateEnd: req.body.dateEnd,
                            description: req.body.description
                        },
                        function (err) {
                            if(!err){
                                res.redirect('/products/putUpProducts');
                            } else {
                                console.log(err);
                            }
                        });
                }
            } else {
                console.log(err);
            }
        });
    } else {
        res.render('login');
    }
});


module.exports = router;