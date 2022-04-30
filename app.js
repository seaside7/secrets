//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const req = require("express/lib/request");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const UserSchema = new mongoose.Schema({ 
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret.";

//level 2 encyrption
UserSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", UserSchema);

app.listen(3000, function(){
    console.log("run on 3000")
})

app.get("/", function(req, res){
    res.render("home");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    });
})

app.post("/login", function(req, res){
    console.log("LOGIN");
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
})

app.get("/register", function(req, res){
    res.render("register");
})