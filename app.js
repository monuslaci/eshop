//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
const morgan = require("morgan");
const mongoose = require('mongoose');
const api = process.env.API_URL;

// const ejs = require("ejs");
// const https = require("https");
// app.set('view engine', 'ejs');


//--------Middleware-----
//middleware for parsing json objects
app.use(bodyParser.json());
//middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("tiny"));


//------Routes------
//Products
const productsRouter=require("./routes/products.js")
app.use(`${api}/products`, productsRouter);




//DB connection
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "eshopDB"
    })
    .then(() => {
        console.log("Database connection is ready.");
    })
    .catch((err) => {
        console.log(err);
    })
//mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
})