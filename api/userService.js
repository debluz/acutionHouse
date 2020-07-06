const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user');


const loginREGEX = /^[a-zA-Z0-9]+$/;
const passwordREGEX = /^\S{6,}$/;
const nameREGEX = /^[a-zA-Z]+$/;
const addressREGEX = /^[a-zA-z]+\s\d+\/*\d*$/;
const postalCodeREGEX = /^[0-9]{2}\-[0-9]{3}$/;
const birthdayREGEX = /^\d{4}-\d{2}-\d{2}/;


var patternMessages = {
    login: "Można używać tylko litery i cyfry",
    password: "Hasło musi mieć min. 6 znaków, bez białych znaków",
    first_name: "Pole 'Imię' może zawierać tylko litery",
    second_name: "Pole 'Nazwisko' może zawierać tylko litery",
    address: "Np. Szkolna 2/1",
    postal_code: "Np. 00-000",
    birthday: "Format daty RRRR-MM-DD",
    id: "Tylko cyfry"
};


router.route("/")
    .get(function (req, res) {
        User.find(function(err, foundUsers){
            if(!err){
                res.send(foundUsers);
            } else {
                res.send(err);
            }
        });

    })

    .post(function(req, res){
        const newUser = new User({
            login: req.body.login,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthday: req.body.birthday,
            address: req.body.address,
            postalCode: req.body.postalCode
        });
        newUser.save(function (err) {
            if(!err){
                res.send("Successfully added a new user!")
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        User.deleteMany(function (err) {
            if(!err){
                res.send("Successfully deleted all users!");
            } else {
                res.send(err);
            }
        });
    });

router.route("/:userId")

    .get(function (req, res) {

        const id = req.params.userId;
        const userId = new ObjectId(id);
        console.log(userId);
        User.findOne({_id:userId}, function (err, foundUser) {
            if(foundUser){
                res.send(foundUser)
            } else {
                res.send("No users matching that title was found.")
            }
        });
    })

    .put(function (req, res) {

        const id = req.params.userId;
        const userId = new ObjectId(id);
        console.log(userId);
        User.updateOne(
            {_id:userId},
            {
                login: req.body.login,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthday: req.body.birthday,
                address: req.body.address,
                postalCode: req.body.postalCode
            },
            function (err, updatedUser) {
                if(!err){
                    res.send("Successfully updated user!")
                } else {
                    res.send(err);
                }
            }
        );
    })

    .patch(function (req, res) {
        const id = req.params.userId;
        const userId = new ObjectId(id);
        console.log(userId);
        User.update(
            {_id:userId},
            {$set: req.body},
            function (err) {
                if(!err){
                    res.send("Successfully updated user!");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete(function (req,res) {
        const id = req.params.userId;
        const userId = new ObjectId(id);
        console.log(userId);
        User.deleteOne({_id:userId},
            function (err) {
            if(!err){
                res.send("Successfully deleted user!");
            } else {
                res.send(err);
            }
        });
    });


module.exports.route = router;