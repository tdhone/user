require('dotenv').config();
const express = require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const mongoose = require ("mongoose");
const encrypt = require('mongoose-encryption');

const app= express();



app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields: ['password'] });

const User= new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home.ejs");
});

app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.get("/register",function(req,res){
    res.render("register.ejs");
});

app.post("/register",function(req,res){
    const newUser= new User({
        email: req.body.username,
        password: req.body.password

    });
    newUser.save();
    res.render("secrets.ejs");
});
app.post("/login",async function(req,res){
    const userName= req.body.username
    const password= req.body.password

    const foundUser= await User.findOne({email:userName});
    if(foundUser.password===password){
        res.render("secrets.ejs");
    };
});


app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});