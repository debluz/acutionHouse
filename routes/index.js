const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index'));

router.get('/contact', function (req, res) {
    if(req.isAuthenticated()){
        res.render('contact');
    } else {
        res.render('contactGuest');
    }
});

router.get('/aboutUs', function (req, res) {
    if(req.isAuthenticated()){
        res.render('aboutUs');
    } else {
        res.render('aboutUsGuest');
    }
});



module.exports = router;