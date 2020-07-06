const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require("passport");
const methodOverride = require('method-override');
const app = express();
const port = 3000;
//const userService = require('./api/userService');
require('./config/passport')(passport);



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use((methodOverride('_method')));
// Express Session & Passport
app.use(session({
    secret: "Session secret.",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());



// MongoDB connection
mongoose.connect("mongodb://localhost:27017/auctionDB", { useNewUrlParser: true, useUnifiedTopology: true } );



// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users.js'));
app.use('/auctions', require('./routes/auctions'));
app.use('/products', require('./routes/products'));
app.use('/offers', require('./routes/offers'));
//app.use('/api/users', userService.route);







app.listen(port, function(){
    console.log("Server is listening on port 3000")
});