const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Auction = require('../models/auction');
const Product = require('../models/product');
const ObjectId = require('mongodb').ObjectId;

// Load User model
const User = require('../models/user');

const loginREGEX = /^[a-zA-Z0-9]+$/;
const passwordREGEX = /^\S{6,}$/;
const nameREGEX = /^[a-zA-Z]+$/;
const addressREGEX = /^[a-zA-z]+\s\d+\/*\d*$/;
const postalCodeREGEX = /^[0-9]{2}\-[0-9]{3}$/;
const birthdayREGEX = /^\d{4}-\d{2}-\d{2}/;
var errors = [];

var patternMessages = {
    login: "Można używać tylko litery i cyfry",
    password: "Hasło musi mieć min. 6 znaków, bez białych znaków",
    first_name: "Pole 'Imię' może zawierać tylko litery",
    second_name: "Pole 'Nazwisko' może zawierać tylko litery",
    address: "Np. Szkolna 2/1",
    postal_code: "Np. 00-000",
    birthday: "Format daty RRRR-MM-DD",
    id: "Tylko cyfry",
    login_exist: "Podany login już istnieje"
};



router.get("/login", function (req, res) {
    res.render("login");
});

router.get("/registration", function (req, res) {
    res.render("registration", {errorsList: errors});
});

router.get("/failLogin", function (req, res) {
    res.render('failLogin');
});


router.post("/registration", function (req, res) {
    errors = [];
    if(!validator.matches(req.body.login, loginREGEX)){
        errors.push(patternMessages.login);
    }
    if(!validator.matches(req.body.password, passwordREGEX)){
        errors.push(patternMessages.password);
    }
    if(!validator.isAlpha(req.body.first_name, 'pl-PL')){
        errors.push(patternMessages.first_name);
    }
    if(!validator.isAlpha(req.body.second_name, 'pl-PL')){
        errors.push(patternMessages.second_name);
    }
    if(validator.isEmpty(req.body.birthday)){
        errors.push(patternMessages.birthday);
    }
    if(!validator.matches(req.body.address, addressREGEX)){
        errors.push(patternMessages.address);
    }
    if(!validator.isPostalCode(req.body.postal_code, 'PL')){
        errors.push(patternMessages.postal_code);
    }

    if(errors.length > 0){
        errors.forEach(function (error) {
            console.log(error);
        });
        res.redirect('/users/registration');
    } else{
        User.findOne({login: req.body.login}).then(user => {
            if (user) {
                errors.push(patternMessages.login_exist);
                res.redirect('/users/registration');
            } else {
                const newUser = new User({
                    login: req.body.login,
                    password: req.body.password,
                    firstName: req.body.first_name,
                    lastName: req.body.second_name,
                    birthday: req.body.birthday,
                    address: req.body.address,
                    postalCode: req.body.postal_code,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.render('successRegistration');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }


});



router.post("/login", function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/auctions/listOfAuctionsUser',
        failureRedirect: '/users/failLogin',
        failureFlash: false
    })(req, res, next);
});

router.get("/myDetails", function (req, res) {
    if(req.isAuthenticated()){
        const id = req.user._id;
        const userId = new ObjectId(id);
        User.findOne({_id:userId}, function(err, foundUser){
            if(foundUser){
                var birthday = new Date(foundUser.birthday);
                birthday = birthday.toISOString();
                birthday = birthday.slice(0,10);
                res.render('myDetails', {user:foundUser, birthday:birthday, errorsList: errors});
            } else {
                console.log(err);
            }
        });
    } else {
        res.render('login');
    }
});

router.put("/myDetails", function (req, res) {
    if(req.isAuthenticated()){
        errors = [];
        if(!validator.isAlpha(req.body.first_name, 'pl-PL')){
            errors.push(patternMessages.first_name);
        }
        if(!validator.isAlpha(req.body.second_name, 'pl-PL')){
            errors.push(patternMessages.second_name);
        }
        if(validator.isEmpty(req.body.birthday)){
            errors.push(patternMessages.birthday);
        }
        if(!validator.matches(req.body.address, addressREGEX)){
            errors.push(patternMessages.address);
        }
        if(!validator.isPostalCode(req.body.postal_code, 'PL')){
            errors.push(patternMessages.postal_code);
        }

        if(errors.length > 0){
            errors.forEach(function (error) {
                console.log(error);
            });
            res.redirect('/users/myDetails');
        } else{
            const id = req.user._id;
            const userId = new ObjectId(id);
            User.updateOne({_id:userId},
                {
                    firstName: req.body.first_name,
                    lastName: req.body.second_name,
                    birthday: req.body.birthday,
                    address: req.body.address,
                    postalCode: req.body.postal_code
                },
                function (err) {
                if(!err){
                    res.redirect('/auctions/listOfAuctionsUser');
                } else {
                    console.log(err);
                }
            })
        }
    } else {
        res.render('login');
    }



});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});



module.exports = router;