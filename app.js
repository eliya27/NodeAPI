const express = require("express");
const bcrypt = require("bcryptjs");
const nodemon = require("nodemon");
const ejs = require("ejs");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");

const cheeseusersModel = require("./models/users");
const PORT = 3434;

const app = express();

//Database connection
const uri =
  "mongodb://eliyagervas:Microsoft2799@ac-lwlmwob-shard-00-00.3pvwiv6.mongodb.net:27017,ac-lwlmwob-shard-00-01.3pvwiv6.mongodb.net:27017,ac-lwlmwob-shard-00-02.3pvwiv6.mongodb.net:27017/crazycheese?ssl=true&replicaSet=atlas-v4g9cq-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("MongoDB connected"));

//Middleware for data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Template engine settings
app.use(express.static("public/"));
app.use("/css", express.static(__dirname + "public/css"));
app.set("view engine", "ejs");
app.use(expressLayouts);

//Routes
app.get("/", (req, res) => {
  //res.send("Welcome we are here!!");
  res.render("index", { title: "Home 🍲" });
});

app.get("/enroll", (req, res) => {
  //res.send("Welcome we are here!!");
  res.render("enroll", { title: "join us 🍸" });
});

app.get("/login", (req, res) => {
  //res.send("Welcome we are here!!");
  res.render("login", { title: "come again? 🍟" });
});

//POST method
app.post("/enroll", async (req, res) => {
  //Values sent
  const { fullname, email, password } = req.body;

  //Check existence
  let user = await cheeseusersModel.findOne({ email });
  if (user) {
    return res.redirect("http://localhost:3434/enroll");
  }

  //Saving
  const hashedPassw = await bcrypt.hash(password, 12);

  user = new cheeseusersModel({
    fullname,
    email,
    password: hashedPassw,
  });

  await user.save();

  res.redirect("http://localhost:3434/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let loginuser = await cheeseusersModel.findOne({ email });

  if (!loginuser) {
    res.redirect("http://localhost:3434/login");
  }

  const isSame = await bcrypt.compare(password, loginuser.password);

  if (!isSame) {
    //res.redirect("http://localhost:3434/login");
    console.log("Password is not valid");
  }

  /* Token */
  const token = jwt.sign(
    { loginuser },
    process.env.TOKEN_SECRET
  ); /* , (err, token) => {
    res.json({
      token: token,
    });
  }); */
  /*  */
  res.header("auth-token", token).send(token);

  //res.redirect("http://localhost:3434/main");
});

//Verify Token middleware
/* function verifyToken(req, res, next) {
  //Get Auth header value
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
} */

const verify = require("./verifyToken");
app.get("/main", verify, (req, res) => {
  //res.send("Welcome we are here!!");
  res.render("main", { title: "Most welcome 👨‍🍳" });
});

//Port setting
app.listen(PORT, (req, res) => {
  console.log(`CheeseCake-app is up and running!! on port ${PORT}`);
});
