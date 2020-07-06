const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Auction = require('../models/auction');
const Offer = require('../models/offer');
const User = require('../models/user');
const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;
var errors = [];

var patternMessages = {
    date: "Data zakończenia musi być późniejsza niż obecna!",
    product_name: "Musi być podana nazwa produktu",
    brand: "Musi być podana nazwa marki",
    size: "Musi być podany rozmiar produktu",
    year: "Musi być podany rok produkcji",
    description: "Musi być podany opis"
};

router.get('/myProducts', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.user._id;
        const userId = new ObjectId(id);
        Product.find({userId: userId}, function (err, foundProducts) {
            if(foundProducts){
                Auction.find({userId: userId}, function (err, foundAuctions) {
                    if(foundAuctions){
                        res.render('myProducts', {products: foundProducts, auctions: foundAuctions});
                    } else {
                        console.log(err);
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

router.get('/addProduct', function (req, res) {
    if(req.isAuthenticated()){
        res.render('addProduct');
    } else {
        res.render('login');
    }
});

router.post('/addProduct', function (req, res) {
    if(req.isAuthenticated()){
        errors = [];
        if(validator.isEmpty(req.body.product_name)){
            errors.push(patternMessages.product_name);
        }
        if(validator.isEmpty(req.body.brand)){
            errors.push(patternMessages.brand);
        }
        if(validator.isEmpty(req.body.size)){
            errors.push(patternMessages.size);
        }
        if(validator.isEmpty(req.body.year)){
            errors.push(patternMessages.year);
        }
        if(validator.isEmpty(req.body.description)){
            errors.push(patternMessages.description);
        }
        if(errors.length > 0){
            errors.forEach(function (error) {
                console.log(error);
            });
            res.redirect('/products/addProduct');
        } else {
            const newProduct = new Product({
                userId: req.user._id,
                //auctionId: "null",
                name: req.body.product_name,
                brand: req.body.brand,
                size: req.body.size,
                yearOfProduction: req.body.year,
                description: req.body.description
            });
            newProduct.save(function (err) {
                if(!err){
                    console.log("Succesfully added new product!")
                    res.redirect('/products/myProducts');
                } else {
                    res.send(err);
                }
            });
        }
    } else {
        res.render('login');
    }
});

router.get('/:id/editProduct', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.params.id;
        const productId = new ObjectId(id);
        Product.findOne({_id: productId}, function (err, foundProduct) {
            if(foundProduct){
                res.render('editProduct', {product: foundProduct});
            } else {
                console.log(err)
            }
        });
    } else {
        res.render('login');
    }
});

router.put('/:id/editProduct', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.params.id;
        const productId = new ObjectId(id);
        Product.findOne({_id: productId}, function (err, foundProduct) {
            if(foundProduct){
                Product.updateOne(
                    {_id:productId},
                    {
                        userId: foundProduct.userId,
                        name: req.body.product_name,
                        brand: req.body.brand,
                        size: req.body.size,
                        yearOfProduction: req.body.year,
                        description: req.body.description
                    },
                    function (err) {
                        if(!err){
                            res.redirect('/products/myProducts');
                        } else {
                            console.log(err);
                        }
                    }
                );
            } else {
                console.log(err)
            }
        });

    } else {
        res.render('login');
    }
});

router.delete('/myProducts/:id', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.params.id;
        const productId = new ObjectId(id);
        const userId = new ObjectId(req.user._id);
        Product.findOne({_id: productId}, function (err, foundProduct) {
            if(foundProduct){
                const auctionId = new ObjectId(foundProduct.auctionId);
                console.log(auctionId);
                Offer.deleteMany({auctionId: auctionId}, function (err) {
                    if(!err){
                        Auction.deleteOne({_id: auctionId}, function (err) {
                            if(!err){
                                Product.deleteOne({_id:productId},
                                    function (err) {
                                        if(!err){
                                            User.updateOne({_id: userId}, {$pull: {auctions: foundProduct.auctionId}}, function (err) {
                                                if(!err){
                                                    console.log("user updated");
                                                    res.redirect('/products/myProducts');
                                                } else {
                                                    console.log(err)
                                                }
                                            });
                                        };
                                    });
                            } else {
                                console.log(err);
                            };
                        });
                    } else {
                        console.log(err)
                    };
                });
            } else {
                console.log(err);
            };
        });


    } else {
        res.render('login');
    };

});

router.get('/:id/addAuction', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.params.id;
        const productId = new ObjectId(id);
        Product.findOne({_id: productId}, function (err, foundProduct) {
            if(foundProduct){
                res.render('addAuction', {product: foundProduct, errorsList: errors});
            } else {
                console.log(err)
            }
        });
    } else {
        res.render('login');
    }
});

router.post('/:id/addAuction', function (req, res) {
    if(req.isAuthenticated()){
        errors = [];
        const id = req.params.id;
        const productId = new ObjectId(id);
        const userId = new ObjectId(req.user._id);
        var date = new Date();
        var dateString = date.toISOString();
        dateString = dateString.slice(0,10);
        console.log(dateString);
        console.log(req.body.dateEnd);
        Product.findOne({_id: productId}, function (err, foundProduct) {
            if(foundProduct){
                if(dateString >= req.body.dateEnd){
                    errors.push(patternMessages.date)
                    console.log("error added");
                }
                console.log("errors length: "+errors.length)
                if(errors.length > 0){
                    errors.forEach(function (error) {
                        console.log(error);
                    });
                    res.redirect('/products/'+id+'/addAuction');
                } else {
                    const newAuction = new Auction({
                        productId: req.params.id,
                        userId: req.user._id,
                        dateStart: new Date(),
                        dateEnd: req.body.dateEnd,
                        priceStart: req.body.priceNow,
                        priceNow: req.body.priceNow,
                        description: req.body.description
                    });
                    Product.updateOne(
                        {_id:productId},
                        {
                            userId: foundProduct.userId,
                            auctionId: newAuction._id,
                            name: foundProduct.name,
                            brand: foundProduct.brand,
                            size: foundProduct.size,
                            yearOfProduction: foundProduct.yearOfProduction,
                            description: foundProduct.description
                        },
                        function (err, updatedProduct) {
                            if(!err){
                                console.log("Successfully created new auction!")
                            } else {
                                console.log(err);
                            }
                        }
                    );
                    User.findOne({_id:userId}, function (err, foundUser) {
                        if(foundUser){
                            foundUser.auctions.push(newAuction._id.toString());
                            foundUser.save(function(err) {
                                if (!err) {
                                    console.log("User " + foundUser._id + " has been updated!")
                                } else {
                                    console.log(err);
                                }
                                ;
                            });
                        } else {
                            console.log(err);
                        }
                    });
                    newAuction.save(function (err) {
                        if(!err){
                            console.log("Succesfully added new auction!")
                            res.redirect('/products/myProducts');
                        } else {
                            console.log(err);
                        }
                    });
                };
            } else {
                console.log(err)
            }
        });
    } else {
        res.render('login');
    }
});

router.get('/putUpProducts', function (req, res) {
    if(req.isAuthenticated()){
        const id = req.user._id;
        const userId = new ObjectId(id);
        User.findOne({_id:userId}, function (err, foundUser) {
            if(foundUser){
                    Auction.find(function (err, foundAuctions) {
                        if(foundAuctions){
                            Product.find(function (err, foundProducts) {
                                if(foundProducts){
                                    res.render('putUpProducts', {user: foundUser, auctions: foundAuctions, products: foundProducts});
                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            console.log(err);
                        }

                    });


            } else {
                console.log(err);
            }
        });
    } else {
        res.render("login");
    }
});






module.exports = router;